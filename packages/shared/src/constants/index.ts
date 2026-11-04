import type { PlanTier } from '../types/enums.js';

export const APP_NAME = 'NEXORA AI';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'AI-powered content creation platform';

export const PLANS: Record<PlanTier, { name: string; credits: number; priceMonthly: number; priceYearly: number }> = {
  FREE: { name: 'Free', credits: 50, priceMonthly: 0, priceYearly: 0 },
  STARTER: { name: 'Starter', credits: 500, priceMonthly: 1900, priceYearly: 15900 },
  PRO: { name: 'Pro', credits: 2000, priceMonthly: 4900, priceYearly: 39900 },
  ENTERPRISE: { name: 'Enterprise', credits: 10000, priceMonthly: 14900, priceYearly: 119900 },
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,    // 10 MB
  DOCUMENT: 50 * 1024 * 1024, // 50 MB
  VIDEO: 500 * 1024 * 1024,   // 500 MB
} as const;

export const AI_CREDIT_COSTS = {
  GENERATE_OUTLINE: 5,
  GENERATE_SLIDE: 10,
  GENERATE_CONTENT: 15,
  GENERATE_IMAGE: 20,
  REWRITE: 5,
  TRANSLATE: 10,
  SUMMARIZE: 5,
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
] as const;

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  PRESENTATION: 'Presentation',
  EBOOK: 'eBook',
  DOCUMENT: 'Document',
  MINDMAP: 'Mind Map',
  INFOGRAPHIC: 'Infographic',
  WEBSITE: 'Website',
};

export const PROJECT_TYPE_ICONS: Record<string, string> = {
  PRESENTATION: 'monitor',
  EBOOK: 'book-open',
  DOCUMENT: 'file-text',
  MINDMAP: 'git-fork',
  INFOGRAPHIC: 'layout-dashboard',
  WEBSITE: 'globe',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_BILLING: '/settings/billing',
  SETTINGS_TEAM: '/settings/team',
} as const;

export const API_ROUTES = {
  HEALTH: '/health',
  AUTH: {
    VERIFY: '/auth/verify',
  },
  USERS: {
    ME: '/users/me',
  },
  ORGANIZATIONS: {
    ROOT: '/organizations',
    BY_ID: (id: string) => `/organizations/${id}`,
    MEMBERS: (id: string) => `/organizations/${id}/members`,
    INVITE: (id: string) => `/organizations/${id}/members/invite`,
  },
  PROJECTS: {
    ROOT: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    DUPLICATE: (id: string) => `/projects/${id}/duplicate`,
  },
  FOLDERS: {
    ROOT: '/folders',
    BY_ID: (id: string) => `/folders/${id}`,
  },
} as const;
