export const COVER_THEMES: Record<
  string,
  {
    id: string
    name: string
    bgStart: string
    bgEnd: string
    accent: string
    text: string
    badgeBg: string
  }
> = {
  CORPORATE_EXECUTIVE: {
    id: 'CORPORATE_EXECUTIVE',
    name: 'Executivo Corporativo',
    bgStart: '#0f172a',
    bgEnd: '#1e3a8a',
    accent: '#38bdf8',
    text: '#f8fafc',
    badgeBg: 'rgba(56,189,248,0.18)',
  },
  MINIMALIST_MODERN: {
    id: 'MINIMALIST_MODERN',
    name: 'Minimalista Editorial',
    bgStart: '#f8fafc',
    bgEnd: '#e2e8f0',
    accent: '#6d28d9',
    text: '#0f172a',
    badgeBg: 'rgba(109,40,217,0.12)',
  },
  ACADEMIC_CLASSIC: {
    id: 'ACADEMIC_CLASSIC',
    name: 'Académico Clássico',
    bgStart: '#1e1b4b',
    bgEnd: '#312e81',
    accent: '#fbbf24',
    text: '#fef3c7',
    badgeBg: 'rgba(251,191,36,0.18)',
  },
  TECH_FUTURISTIC: {
    id: 'TECH_FUTURISTIC',
    name: 'Tecnológico & IA',
    bgStart: '#18052c',
    bgEnd: '#3b0764',
    accent: '#c084fc',
    text: '#f3e8ff',
    badgeBg: 'rgba(192,132,252,0.2)',
  },
  CREATIVE_VIBRANT: {
    id: 'CREATIVE_VIBRANT',
    name: 'Criativo Vibrante',
    bgStart: '#831843',
    bgEnd: '#be123c',
    accent: '#fde047',
    text: '#fff1f2',
    badgeBg: 'rgba(253,224,71,0.2)',
  },
  LUXURY_EDITORIAL: {
    id: 'LUXURY_EDITORIAL',
    name: 'Premium Gold',
    bgStart: '#09090b',
    bgEnd: '#27272a',
    accent: '#f59e0b',
    text: '#fafafa',
    badgeBg: 'rgba(245,158,11,0.2)',
  },
}

export function buildCoverSvgDataUrl(params: {
  title: string
  subtitle: string
  author: string
  style: string
  badgeText: string
  targetPages: number
  pageFormat: string
}): string {
  const theme = COVER_THEMES[params.style] ?? COVER_THEMES.CORPORATE_EXECUTIVE
  const safeTitle = (params.title || 'Título da Obra Editorial').replace(/[<>&"]/g, '')
  const safeSub = (
    params.subtitle || 'Guia Completo Estruturado com Inteligência Artificial'
  ).replace(/[<>&"]/g, '')
  const safeAuthor = (params.author || 'NEXORA Studio').replace(/[<>&"]/g, '')
  const safeBadge = (params.badgeText || 'EDIÇÃO OFICIAL NEXORA AI').replace(/[<>&"]/g, '')

  const words = safeTitle.split(' ')
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if ((current + ' ' + w).trim().length > 22 && lines.length < 3) {
      if (current) lines.push(current.trim())
      current = w
    } else {
      current = (current + ' ' + w).trim()
    }
  }
  if (current) lines.push(current.trim())

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bgStart}" />
        <stop offset="100%" stop-color="${theme.bgEnd}" />
      </linearGradient>
    </defs>
    <rect width="800" height="1200" fill="url(#bg)" />
    <circle cx="720" cy="140" r="260" fill="${theme.accent}" opacity="0.08" />
    <circle cx="80" cy="1080" r="320" fill="${theme.accent}" opacity="0.06" />
    <rect x="56" y="56" width="688" height="1088" rx="18" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.35" />
    <rect x="96" y="110" width="360" height="42" rx="21" fill="${theme.badgeBg}" />
    <text x="120" y="137" fill="${theme.accent}" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="800" letter-spacing="2">${safeBadge.toUpperCase()}</text>
    ${lines
      .map(
        (line, idx) =>
          `<text x="96" y="${280 + idx * 68}" fill="${theme.text}" font-family="Georgia, serif" font-size="54" font-weight="800">${line}</text>`
      )
      .join('')}
    <rect x="96" y="${310 + lines.length * 68}" width="140" height="6" rx="3" fill="${theme.accent}" />
    <text x="96" y="${370 + lines.length * 68}" fill="${theme.text}" opacity="0.82" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="500">${safeSub.slice(0, 52)}</text>
    <text x="96" y="${406 + lines.length * 68}" fill="${theme.text}" opacity="0.72" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="400">${safeSub.slice(52, 104)}</text>
    <line x1="96" y1="980" x2="704" y2="980" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="1.5" />
    <text x="96" y="1025" fill="${theme.accent}" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" letter-spacing="2">AUTOR / ORGANIZAÇÃO</text>
    <text x="96" y="1065" fill="${theme.text}" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800">${safeAuthor}</text>
    <text x="704" y="1065" text-anchor="end" fill="${theme.text}" opacity="0.65" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="600">${params.targetPages} Páginas • ${params.pageFormat}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
