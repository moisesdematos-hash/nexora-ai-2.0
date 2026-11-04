export type VisualStyleId =
  | 'PHOTOREAL_8K'
  | 'OCTANE_3D_GLASS'
  | 'CINEMATIC_IMAX'
  | 'CYBERPUNK_NEURAL'
  | 'ARCHITECTURAL_MINIMAL'
  | 'LUXURY_GOLD'
  | 'EDITORIAL_ART'
  | 'QUANTUM_BIOTECH'

export type AIImageModelId = 'FLUX_PRO_ULTRA' | 'MIDJOURNEY_V6_STYLE' | 'IDEOGRAM_2_HD' | 'DALLE_3_HD'

export interface VisualPreset {
  id: VisualStyleId
  name: string
  modelBadge: string
  description: string
  imageUrl: string
  fallbackSvgUrl: string
  overlayGradient: string
  accentHex: string
}

export const AI_IMAGE_MODELS: Array<{
  id: AIImageModelId
  name: string
  provider: string
  strength: string
  resolution: string
}> = [
  {
    id: 'FLUX_PRO_ULTRA',
    name: 'FLUX.1 Pro Ultra (8K)',
    provider: 'Black Forest Labs',
    strength: 'Fotorealismo extremo, iluminação volumétrica e texturas micro-detalhadas',
    resolution: '2048 × 2048 (Ultra HD)',
  },
  {
    id: 'MIDJOURNEY_V6_STYLE',
    name: 'Nexora Vision v6.1 (Cinematic)',
    provider: 'NEXORA Neural Engine',
    strength: 'Direção de arte cinematográfica, composição editorial e estética de revista',
    resolution: '2400 × 1350 (16:9 Cinema)',
  },
  {
    id: 'IDEOGRAM_2_HD',
    name: 'Ideogram 2.0 Typography HD',
    provider: 'Ideogram AI',
    strength: 'Capas de livros com tipografia integrada perfeita, posters e infográficos',
    resolution: '1600 × 2400 (Capa 2:3)',
  },
  {
    id: 'DALLE_3_HD',
    name: 'DALL·E 3 Studio HD',
    provider: 'OpenAI Enterprise',
    strength: 'Ilustrações concetuais complexas, metáforas visuais e diagramas artísticos',
    resolution: '1792 × 1024 (Widescreen)',
  },
]

function buildUltraRichArtSvg(params: {
  c1: string
  c2: string
  c3: string
  accent: string
  label: string
  seed: number
}): string {
  const { c1, c2, c3, accent, label, seed } = params
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
    <defs>
      <radialGradient id="g1" cx="25%" cy="25%" r="75%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.55" />
        <stop offset="45%" stop-color="${c2}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${c1}" stop-opacity="1" />
      </radialGradient>
      <radialGradient id="g2" cx="80%" cy="75%" r="65%">
        <stop offset="0%" stop-color="${c3}" stop-opacity="0.65" />
        <stop offset="60%" stop-color="${c1}" stop-opacity="0.2" />
        <stop offset="100%" stop-color="${c1}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.04" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.18" />
      </linearGradient>
      <filter id="blurHigh" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="55" />
      </filter>
    </defs>
    <rect width="1600" height="900" fill="${c1}" />
    <rect width="1600" height="900" fill="url(#g1)" />
    <rect width="1600" height="900" fill="url(#g2)" />
    <!-- Volumetric Light Orbs -->
    <circle cx="${320 + (seed * 90) % 500}" cy="240" r="260" fill="${accent}" opacity="0.32" filter="url(#blurHigh)" />
    <circle cx="${1150 - (seed * 70) % 400}" cy="640" r="310" fill="${c3}" opacity="0.38" filter="url(#blurHigh)" />
    <!-- 3D Perspective Cyber/Architectural Grid -->
    <g stroke="${accent}" stroke-opacity="0.16" stroke-width="1">
      <line x1="0" y1="680" x2="1600" y2="680" />
      <line x1="0" y1="740" x2="1600" y2="740" />
      <line x1="0" y1="810" x2="1600" y2="810" />
      <line x1="800" y1="420" x2="100" y2="900" />
      <line x1="800" y1="420" x2="450" y2="900" />
      <line x1="800" y1="420" x2="800" y2="900" />
      <line x1="800" y1="420" x2="1150" y2="900" />
      <line x1="800" y1="420" x2="1500" y2="900" />
    </g>
    <!-- Floating Glassmorphic 3D Prism Cards -->
    <g transform="translate(220, 150) rotate(-4)">
      <rect width="520" height="340" rx="28" fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.28" stroke-width="1.5" />
      <circle cx="90" cy="90" r="38" fill="${accent}" opacity="0.65" />
      <rect x="155" y="65" width="260" height="18" rx="9" fill="#ffffff" opacity="0.75" />
      <rect x="155" y="98" width="180" height="12" rx="6" fill="#ffffff" opacity="0.45" />
      <path d="M 60 260 Q 180 160 280 230 T 460 150" fill="none" stroke="${accent}" stroke-width="5" />
    </g>
    <g transform="translate(820, 230) rotate(5)">
      <rect width="540" height="360" rx="32" fill="url(#glass)" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5" />
      <circle cx="270" cy="180" r="105" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="14 8" opacity="0.8" />
      <circle cx="270" cy="180" r="65" fill="${c3}" opacity="0.45" />
      <circle cx="270" cy="180" r="24" fill="#ffffff" opacity="0.9" />
    </g>
    <rect x="60" y="810" width="380" height="44" rx="22" fill="#000000" fill-opacity="0.45" stroke="#ffffff" stroke-opacity="0.2" />
    <text x="90" y="838" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="2">${label.toUpperCase()}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: 'PHOTOREAL_8K',
    name: 'Fotorealismo 8K Editorial',
    modelBadge: 'FLUX.1 Pro Ultra',
    description: 'Fotografia ultra-realista com iluminação natural de estúdio, profundidade de campo f/1.4 e nitidez cristalina.',
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#090d16',
      c2: '#1e1b4b',
      c3: '#3b82f6',
      accent: '#38bdf8',
      label: 'FLUX.1 PRO ULTRA • 8K PHOTOREAL',
      seed: 1,
    }),
    overlayGradient: 'from-slate-950/90 via-slate-950/40 to-transparent',
    accentHex: '#38bdf8',
  },
  {
    id: 'OCTANE_3D_GLASS',
    name: '3D Glass & Octane Render',
    modelBadge: 'Octane 3D Neural',
    description: 'Esculturas de vidro translúcido, refração de luz ray-tracing e superfícies metálicas iridescentes.',
    imageUrl:
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#0f0728',
      c2: '#3b0764',
      c3: '#ec4899',
      accent: '#c084fc',
      label: 'OCTANE 3D RAY-TRACING • GLASS OS',
      seed: 2,
    }),
    overlayGradient: 'from-purple-950/90 via-indigo-950/45 to-transparent',
    accentHex: '#c084fc',
  },
  {
    id: 'CINEMATIC_IMAX',
    name: 'Cinematográfico IMAX 70mm',
    modelBadge: 'Nexora Vision v6.1',
    description: 'Composição dramática anamórfica com contraste teal & orange, luz volumétrica e atmosfera épica.',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#040d1a',
      c2: '#0f172a',
      c3: '#f59e0b',
      accent: '#06b6d4',
      label: 'IMAX 70MM ANAMORPHIC • VISION V6.1',
      seed: 3,
    }),
    overlayGradient: 'from-slate-950/95 via-slate-900/50 to-transparent',
    accentHex: '#f59e0b',
  },
  {
    id: 'CYBERPUNK_NEURAL',
    name: 'Cyber-Neural & Holografia',
    modelBadge: 'Midjourney v6.1 Style',
    description: 'Redes neurais bioluminescentes, circuitos quânticos e estética futurista neon de alta precisão.',
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#020617',
      c2: '#0f172a',
      c3: '#8b5cf6',
      accent: '#22d3ee',
      label: 'NEURAL HOLOGRAPHY • SCI-FI 8K',
      seed: 4,
    }),
    overlayGradient: 'from-cyan-950/90 via-slate-950/60 to-transparent',
    accentHex: '#22d3ee',
  },
  {
    id: 'ARCHITECTURAL_MINIMAL',
    name: 'Arquitetura Minimalista & Luz',
    modelBadge: 'FLUX.1 Architectural',
    description: 'Espaços modernos banhados por luz natural, geometria limpa e estética de design escandinavo/suíço.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#18181b',
      c2: '#27272a',
      c3: '#71717a',
      accent: '#e4e4e7',
      label: 'ARCHITECTURAL MINIMALISM • 8K',
      seed: 5,
    }),
    overlayGradient: 'from-zinc-950/90 via-zinc-900/45 to-transparent',
    accentHex: '#a1a1aa',
  },
  {
    id: 'LUXURY_GOLD',
    name: 'Luxury Obsidiana & Ouro 24K',
    modelBadge: 'Ideogram 2.0 Luxury',
    description: 'Texturas de mármore negro, reflexos dourados acetinados e sofisticação executiva de alto padrão.',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#09090b',
      c2: '#1c1917',
      c3: '#b45309',
      accent: '#fbbf24',
      label: 'OBSIDIAN & 24K GOLD • LUXURY EDITION',
      seed: 6,
    }),
    overlayGradient: 'from-stone-950/95 via-stone-950/50 to-transparent',
    accentHex: '#fbbf24',
  },
  {
    id: 'EDITORIAL_ART',
    name: 'Ilustração Editorial Concept',
    modelBadge: 'DALL·E 3 Studio HD',
    description: 'Arte conceptual vibrante estilo The Economist e Harvard Business Review para capítulos estratégicos.',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#1e1b4b',
      c2: '#4c1d95',
      c3: '#f43f5e',
      accent: '#fb7185',
      label: 'EDITORIAL CONCEPT ILLUSTRATION • HD',
      seed: 7,
    }),
    overlayGradient: 'from-rose-950/90 via-indigo-950/50 to-transparent',
    accentHex: '#fb7185',
  },
  {
    id: 'QUANTUM_BIOTECH',
    name: 'Quantum & Eco-Futurismo',
    modelBadge: 'FLUX.1 Biotech',
    description: 'Estruturas moleculares cristalinas, bio-arquitetura sustentável e luz esmeralda de alta definição.',
    imageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    fallbackSvgUrl: buildUltraRichArtSvg({
      c1: '#022c22',
      c2: '#064e3b',
      c3: '#059669',
      accent: '#34d399',
      label: 'QUANTUM BIOTECH • EMERALD 8K',
      seed: 8,
    }),
    overlayGradient: 'from-emerald-950/90 via-teal-950/50 to-transparent',
    accentHex: '#34d399',
  },
]

export function getChapterHeroVisual(chapterPosition: number, preferredStyle?: VisualStyleId): VisualPreset {
  if (preferredStyle) {
    const found = VISUAL_PRESETS.find((p) => p.id === preferredStyle)
    if (found) return found
  }
  const idx = Math.max(0, (chapterPosition - 1) % VISUAL_PRESETS.length)
  return VISUAL_PRESETS[idx]
}
