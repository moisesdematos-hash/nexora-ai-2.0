// ============================================================
// ENUMS — Member & Organization
// ============================================================

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// ============================================================
// ENUMS — Project
// ============================================================

export enum ProjectType {
  PRESENTATION = 'PRESENTATION',
  EBOOK = 'EBOOK',
  DOCUMENT = 'DOCUMENT',
  MINDMAP = 'MINDMAP',
  INFOGRAPHIC = 'INFOGRAPHIC',
  WEBSITE = 'WEBSITE',
}

// ============================================================
// ENUMS — Presentation
// ============================================================

export enum PresentationStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  READY = 'READY',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// ============================================================
// ENUMS — Book / Ebook
// ============================================================

export enum BookStatus {
  DRAFT = 'DRAFT',
  OUTLINING = 'OUTLINING',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  READY = 'READY',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum ContentStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  READY = 'READY',
  EDITING = 'EDITING',
  APPROVED = 'APPROVED',
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

// ============================================================
// ENUMS — Export
// ============================================================

export enum ExportFormat {
  PDF = 'PDF',
  DOCX = 'DOCX',
  PPTX = 'PPTX',
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  EPUB = 'EPUB',
  PNG = 'PNG',
  SVG = 'SVG',
  JSON = 'JSON',
}

export enum ExportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// ============================================================
// ENUMS — AI
// ============================================================

export enum AiJobType {
  GENERATE_OUTLINE = 'GENERATE_OUTLINE',
  GENERATE_CONTENT = 'GENERATE_CONTENT',
  GENERATE_SLIDE = 'GENERATE_SLIDE',
  GENERATE_IMAGE = 'GENERATE_IMAGE',
  REWRITE = 'REWRITE',
  TRANSLATE = 'TRANSLATE',
  SUMMARIZE = 'SUMMARIZE',
  EXPAND = 'EXPAND',
  IMPROVE = 'IMPROVE',
  CUSTOM = 'CUSTOM',
}

export enum AiJobStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum AiProvider {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GEMINI = 'GEMINI',
  REPLICATE = 'REPLICATE',
}

export enum AiModel {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4_TURBO = 'gpt-4-turbo',
  CLAUDE_35_SONNET = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  GEMINI_15_PRO = 'gemini-1.5-pro',
  GEMINI_15_FLASH = 'gemini-1.5-flash',
}

// ============================================================
// ENUMS — Subscription & Billing
// ============================================================

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  INCOMPLETE = 'INCOMPLETE',
  PAUSED = 'PAUSED',
}

export enum CreditTxType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  REFUND = 'REFUND',
  BONUS = 'BONUS',
  EXPIRY = 'EXPIRY',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum PlanTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}
