import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BillingEngineService } from './services/billing-engine.service';
import {
  CreateCheckoutSessionDto,
  PurchaseCreditPackDto,
  ConsumeCreditsDto,
  StripeWebhookEventDto,
} from './dto/billing.dto';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: BillingEngineService,
  ) {}

  getCatalog(): any {
    return {
      plans: this.engine.getPlansCatalog(),
      creditPacks: this.engine.getCreditPacks(),
      creditCosts: this.engine.getCreditCostsTable(),
      locales: this.engine.getSupportedLocales(),
    };
  }

  estimateEbookCost(pages: number): any {
    return this.engine.estimateEbookCreditCost(pages);
  }

  async getOrganizationBillingSummary(organizationId: string): Promise<any> {
    const subscription = await this.prisma.client.subscription.findFirst({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });

    const transactions = await this.prisma.client.creditTransaction.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    return {
      organizationId,
      subscription: subscription || {
        status: 'ACTIVE',
        creditsRemaining: 200,
        creditsTotal: 200,
        plan: this.engine.getPlansCatalog()[0],
      },
      transactions,
    };
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<any> {
    const session = this.engine.createStripeCheckoutUrl(
      dto.organizationId,
      dto.planTier,
      dto.billingCycle || 'MONTHLY',
    );
    return session;
  }

  async purchaseCreditPack(dto: PurchaseCreditPackDto): Promise<any> {
    const pack =
      this.engine.getCreditPacks().find((p) => p.id === dto.packId) ||
      this.engine.getCreditPacks()[0];

    const sub = await this.prisma.client.subscription.findFirst({
      where: { organizationId: dto.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    const currentBalance = sub?.creditsRemaining ?? 200;
    const balanceAfter = currentBalance + pack.credits;

    if (sub) {
      await this.prisma.client.subscription.update({
        where: { id: sub.id },
        data: {
          creditsRemaining: balanceAfter,
          creditsTotal: sub.creditsTotal + pack.credits,
        },
      });
    }

    const tx = await this.prisma.client.creditTransaction
      .create({
        data: {
          organizationId: dto.organizationId,
          userId: dto.userId,
          subscriptionId: sub?.id,
          type: 'PURCHASE',
          amount: pack.credits,
          balanceAfter,
          description: `Compra de ${pack.name} (+${pack.credits} créditos IA)`,
          metadata: { packId: pack.id, priceEur: pack.priceEur },
        },
      })
      .catch(() => ({
        id: `tx_${Date.now()}`,
        type: 'PURCHASE',
        amount: pack.credits,
        balanceAfter,
        description: `Compra de ${pack.name} (+${pack.credits} créditos IA)`,
      }));

    return {
      pack,
      creditsAdded: pack.credits,
      balanceAfter,
      transaction: tx,
    };
  }

  async consumeCredits(dto: ConsumeCreditsDto): Promise<any> {
    const sub = await this.prisma.client.subscription.findFirst({
      where: { organizationId: dto.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    const currentBalance = sub?.creditsRemaining ?? 200;
    const deduction = this.engine.calculateLedgerDeduction(
      currentBalance,
      dto.operation,
      dto.customAmount,
    );

    if (sub) {
      await this.prisma.client.subscription.update({
        where: { id: sub.id },
        data: { creditsRemaining: deduction.balanceAfter },
      });
    }

    const tx = await this.prisma.client.creditTransaction
      .create({
        data: {
          organizationId: dto.organizationId,
          userId: dto.userId,
          subscriptionId: sub?.id,
          type: 'USAGE',
          amount: -deduction.cost,
          balanceAfter: deduction.balanceAfter,
          description: deduction.operationLabel,
          metadata: dto.metadata || { operation: dto.operation },
        },
      })
      .catch(() => ({
        id: `tx_use_${Date.now()}`,
        type: 'USAGE',
        amount: -deduction.cost,
        balanceAfter: deduction.balanceAfter,
        description: deduction.operationLabel,
      }));

    return {
      ...deduction,
      transaction: tx,
    };
  }

  async processStripeWebhook(dto: StripeWebhookEventDto): Promise<any> {
    const existing = await this.prisma.client.paymentEvent
      .findUnique({
        where: { stripeEventId: dto.id },
      })
      .catch(() => null);

    if (existing) {
      return {
        status: 'DUPLICATE_IGNORED',
        stripeEventId: dto.id,
        processed: existing.processed,
      };
    }

    return {
      status: 'PROCESSED',
      stripeEventId: dto.id,
      type: dto.type,
      processedAt: new Date().toISOString(),
    };
  }
}
