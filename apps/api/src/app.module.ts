import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EbooksModule } from './modules/ebooks/ebooks.module';
import { PresentationsModule } from './modules/presentations/presentations.module';
import { DocsModule } from './modules/docs/docs.module';
import { MindMapsModule } from './modules/mindmaps/mindmaps.module';
import { InfographicsModule } from './modules/infographics/infographics.module';
import { WebsitesModule } from './modules/websites/websites.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    EbooksModule,
    PresentationsModule,
    DocsModule,
    MindMapsModule,
    InfographicsModule,
    WebsitesModule,
    BillingModule,
  ],
})
export class AppModule {}
