import type {
  MemberRole,
  ProjectType,
  PresentationStatus,
  BookStatus,
  ContentStatus,
  AssetType,
  ExportFormat,
  ExportStatus,
  AiJobType,
  AiJobStatus,
  AiProvider,
  AiModel,
  SubscriptionStatus,
  CreditTxType,
  PlanTier,
} from './enums.js';

// ============================================================
// BASE TYPES
// ============================================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletable {
  deletedAt: Date | null;
}

// ============================================================
// USER & AUTH
// ============================================================

export interface User extends BaseEntity, SoftDeletable {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  supabaseId: string;
}

export interface Profile extends BaseEntity {
  userId: string;
  bio: string | null;
  website: string | null;
  location: string | null;
  language: string;
  timezone: string;
  preferences: Record<string, unknown>;
}

// ============================================================
// ORGANIZATION
// ============================================================

export interface Organization extends BaseEntity, SoftDeletable {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
}

export interface Membership extends BaseEntity {
  organizationId: string;
  userId: string;
  role: MemberRole;
  invitedAt: Date | null;
  joinedAt: Date | null;
}

// ============================================================
// PROJECT
// ============================================================

export interface Project extends BaseEntity, SoftDeletable {
  organizationId: string;
  userId: string;
  folderId: string | null;
  name: string;
  description: string | null;
  type: ProjectType;
  thumbnailUrl: string | null;
  isPublic: boolean;
  tags: string[];
}

export interface Folder extends BaseEntity {
  organizationId: string;
  userId: string;
  parentId: string | null;
  name: string;
  color: string | null;
}

// ============================================================
// PRESENTATION
// ============================================================

export interface Presentation extends BaseEntity {
  projectId: string;
  title: string;
  description: string | null;
  status: PresentationStatus;
  theme: string | null;
  slideCount: number;
  config: Record<string, unknown>;
}

export interface Slide extends BaseEntity {
  presentationId: string;
  position: number;
  title: string | null;
  content: Record<string, unknown>;
  speakerNotes: string | null;
  thumbnailUrl: string | null;
}

// ============================================================
// BOOK / EBOOK
// ============================================================

export interface Book extends BaseEntity {
  projectId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: BookStatus;
  genre: string | null;
  language: string;
  targetWordCount: number | null;
  currentWordCount: number;
  coverUrl: string | null;
  config: Record<string, unknown>;
}

export interface BookChapter extends BaseEntity {
  bookId: string;
  partId: string | null;
  position: number;
  title: string;
  summary: string | null;
  status: ContentStatus;
  wordCount: number;
}

export interface BookSection extends BaseEntity {
  chapterId: string;
  position: number;
  title: string | null;
  content: string;
  status: ContentStatus;
  wordCount: number;
}

// ============================================================
// AI
// ============================================================

export interface AiJob extends BaseEntity {
  organizationId: string;
  userId: string;
  projectId: string | null;
  type: AiJobType;
  status: AiJobStatus;
  provider: AiProvider;
  model: AiModel;
  prompt: string;
  result: unknown | null;
  error: string | null;
  tokensUsed: number;
  costUsd: number;
  metadata: Record<string, unknown>;
}

// ============================================================
// SUBSCRIPTION & BILLING
// ============================================================

export interface Plan extends BaseEntity {
  name: string;
  tier: PlanTier;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  credits: number;
  features: string[];
  limits: Record<string, number>;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  isActive: boolean;
}

export interface Subscription extends BaseEntity {
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  creditsRemaining: number;
  creditsTotal: number;
}

export interface CreditTransaction extends BaseEntity {
  organizationId: string;
  userId: string;
  subscriptionId: string | null;
  type: CreditTxType;
  amount: number;
  balanceAfter: number;
  description: string;
  metadata: Record<string, unknown>;
}

// ============================================================
// EXPORT
// ============================================================

export interface Export extends BaseEntity {
  projectId: string;
  userId: string;
  format: ExportFormat;
  status: ExportStatus;
  fileUrl: string | null;
  fileSize: number | null;
  error: string | null;
  options: Record<string, unknown>;
}

// ============================================================
// API TYPES
// ============================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Re-export enums
export type {
  MemberRole,
  ProjectType,
  PresentationStatus,
  BookStatus,
  ContentStatus,
  AssetType,
  ExportFormat,
  ExportStatus,
  AiJobType,
  AiJobStatus,
  AiProvider,
  AiModel,
  SubscriptionStatus,
  CreditTxType,
  PlanTier,
};
