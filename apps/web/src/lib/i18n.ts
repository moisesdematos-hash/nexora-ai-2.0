export type SupportedLocale = 'pt' | 'en' | 'es' | 'fr'

export interface LocaleMeta {
  code: SupportedLocale
  name: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
]

export const I18N_DICTIONARY: Record<
  SupportedLocale,
  Record<string, string>
> = {
  pt: {
    studioTitle: 'Estúdio de Criação Digital com Inteligência Artificial',
    createPresentation: 'Criar apresentação',
    createEbook: 'Criar e-book',
    createDocument: 'Criar documento',
    createMindMap: 'Criar mapa mental',
    createInfographic: 'Criar infográfico',
    createWebsite: 'Criar website',
    templateLibrary: 'Biblioteca de modelos',
    recentProjects: 'Projetos recentes',
    availableCredits: 'Créditos disponíveis',
    billingAndPlans: 'Planos, Subscrições & Créditos IA',
    settingsTitle: 'Definições da Conta, Marca & Idioma',
    upgradeButton: 'Atualizar Plano via Stripe',
  },
  en: {
    studioTitle: 'AI-Powered Digital Creation Studio',
    createPresentation: 'Create presentation',
    createEbook: 'Create e-book',
    createDocument: 'Create document',
    createMindMap: 'Create mind map',
    createInfographic: 'Create infographic',
    createWebsite: 'Create website',
    templateLibrary: 'Template library',
    recentProjects: 'Recent projects',
    availableCredits: 'Available credits',
    billingAndPlans: 'Plans, Subscriptions & AI Credits',
    settingsTitle: 'Account, Brand & Language Settings',
    upgradeButton: 'Upgrade Plan via Stripe',
  },
  es: {
    studioTitle: 'Estudio de Creación Digital con Inteligencia Artificial',
    createPresentation: 'Crear presentación',
    createEbook: 'Crear e-book',
    createDocument: 'Crear documento',
    createMindMap: 'Crear mapa mental',
    createInfographic: 'Crear infografía',
    createWebsite: 'Crear sitio web',
    templateLibrary: 'Biblioteca de plantillas',
    recentProjects: 'Proyectos recientes',
    availableCredits: 'Créditos disponibles',
    billingAndPlans: 'Planes, Suscripciones y Créditos IA',
    settingsTitle: 'Configuración de Cuenta, Marca e Idioma',
    upgradeButton: 'Mejorar Plan vía Stripe',
  },
  fr: {
    studioTitle: 'Studio de Création Numérique par Intelligence Artificielle',
    createPresentation: 'Créer une présentation',
    createEbook: 'Créer un e-book',
    createDocument: 'Créer un document',
    createMindMap: 'Créer une carte mentale',
    createInfographic: 'Créer une infographie',
    createWebsite: 'Créer un site web',
    templateLibrary: 'Bibliothèque de modèles',
    recentProjects: 'Projets récents',
    availableCredits: 'Crédits disponibles',
    billingAndPlans: 'Forfaits, Abonnements & Crédits IA',
    settingsTitle: 'Paramètres du Compte, de la Marque et de la Langue',
    upgradeButton: 'Améliorer le forfait via Stripe',
  },
}

export function t(locale: SupportedLocale, key: string): string {
  return I18N_DICTIONARY[locale]?.[key] || I18N_DICTIONARY.pt[key] || key
}
