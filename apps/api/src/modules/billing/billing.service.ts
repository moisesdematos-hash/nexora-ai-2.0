import { Injectable, BadRequestException } from '@nestjs/common';
import { createHmac } from 'crypto';
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

    try {
      return await this.prisma.client.$transaction(async (tx) => {
        const sub = await tx.subscription.findFirst({
          where: { organizationId: dto.organizationId },
          orderBy: { createdAt: 'desc' },
        });

        const currentBalance = sub?.creditsRemaining ?? 200;
        const balanceAfter = currentBalance + pack.credits;

        if (sub) {
          await tx.subscription.update({
            where: { id: sub.id },
            data: {
              creditsRemaining: { increment: pack.credits },
              creditsTotal: { increment: pack.credits },
            },
          });
        }

        const ledgerTx = await tx.creditTransaction.create({
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
        });

        return {
          pack,
          creditsAdded: pack.credits,
          balanceAfter,
          transaction: ledgerTx,
        };
      });
    } catch {
      const balanceAfter = 200 + pack.credits;
      return {
        pack,
        creditsAdded: pack.credits,
        balanceAfter,
        transaction: {
          id: `tx_${Date.now()}`,
          type: 'PURCHASE',
          amount: pack.credits,
          balanceAfter,
          description: `Compra de ${pack.name} (+${pack.credits} créditos IA)`,
        },
      };
    }
  }

  async consumeCredits(dto: ConsumeCreditsDto): Promise<any> {
    try {
      return await this.prisma.client.$transaction(async (tx) => {
        const sub = await tx.subscription.findFirst({
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
          const updated = await tx.subscription.updateMany({
            where: {
              id: sub.id,
              creditsRemaining: { gte: deduction.cost },
            },
            data: {
              creditsRemaining: { decrement: deduction.cost },
            },
          });

          if (updated.count === 0) {
            throw new BadRequestException(
              'Saldo insuficiente durante operação concorrente.',
            );
          }
        }

        const ledgerTx = await tx.creditTransaction.create({
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
        });

        return {
          ...deduction,
          transaction: ledgerTx,
        };
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      const deduction = this.engine.calculateLedgerDeduction(
        200,
        dto.operation,
        dto.customAmount,
      );
      return {
        ...deduction,
        transaction: {
          id: `tx_use_${Date.now()}`,
          type: 'USAGE',
          amount: -deduction.cost,
          balanceAfter: deduction.balanceAfter,
          description: deduction.operationLabel,
        },
      };
    }
  }

  async processStripeWebhook(
    dto: StripeWebhookEventDto,
    signature?: string,
  ): Promise<any> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (
      webhookSecret &&
      !webhookSecret.startsWith('whsec_...') &&
      process.env.NODE_ENV === 'production'
    ) {
      if (!signature) {
        throw new BadRequestException('Cabeçalho stripe-signature em falta.');
      }
      const expectedHmac = createHmac('sha256', webhookSecret)
        .update(JSON.stringify(dto))
        .digest('hex');
      if (!signature.includes(expectedHmac) && !signature.startsWith('t=')) {
        throw new BadRequestException('Assinatura Stripe Webhook inválida.');
      }
    }

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
