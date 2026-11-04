const Module = require('module');
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@nexora/db') {
    return { PrismaClient: class {} };
  }
  return originalLoad.apply(this, arguments);
};

const { EbookPlannerService } = require('./dist/modules/ebooks/services/ebook-planner.service');
const { EbookWriterService } = require('./dist/modules/ebooks/services/ebook-writer.service');
const { EbookPdfService } = require('./dist/modules/ebooks/services/ebook-pdf.service');

async function runTests() {
  console.log('=== [TEST 1] EbookPlannerService: 10 Pages & 20 Pages Calculation ===');
  const planner = new EbookPlannerService();
  
  // Test 10 pages
  const plan10 = await planner.generateOutline({
    topic: 'Fundamentos de Inteligência Artificial para Negócios',
    targetPages: 10,
    targetAudience: 'Executivos e empreendedores',
    tone: 'Profissional e prático',
    language: 'pt',
    chaptersCount: 4,
  });

  console.log('Plan 10 pages title:', plan10.title);
  console.log('Plan 10 totalWordCount:', plan10.totalWordCount);
  console.log('Plan 10 chapters count:', plan10.chapters.length);
  if (plan10.totalWordCount !== 2500) throw new Error('Expected 2500 words for 10 pages');
  if (plan10.chapters.length !== 4) throw new Error('Expected 4 chapters for 10 pages');

  // Test 20 pages
  const plan20 = await planner.generateOutline({
    topic: 'Manual Completo de Automação de Processos',
    targetPages: 20,
    targetAudience: 'Gestores de Operações',
    tone: 'Técnico e estruturado',
    language: 'pt',
    chaptersCount: 6,
  });

  console.log('Plan 20 pages title:', plan20.title);
  console.log('Plan 20 totalWordCount:', plan20.totalWordCount);
  console.log('Plan 20 chapters count:', plan20.chapters.length);
  if (plan20.totalWordCount !== 5000) throw new Error('Expected 5000 words for 20 pages');
  if (plan20.chapters.length !== 6) throw new Error('Expected 6 chapters for 20 pages');

  console.log('>>> [TEST 1 PASSED]: Outline calculation and chapter distribution validated.');

  console.log('\n=== [TEST 2] EbookWriterService: Incremental Writing & BookMemory ===');
  const createdSections = [];
  const createdMemories = [];

  const fakeDb = {
    book: {
      findUnique: async () => ({
        id: 'book_1',
        title: 'Fundamentos de Inteligência Artificial para Negócios',
        subtitle: 'Guia Prático para Líderes',
        language: 'pt',
        config: { tone: 'Executivo', audience: 'Gestores' },
        outline: { id: 'out_1' },
        memories: [
          { id: 'm1', key: 'Público-Alvo', value: 'Gestores' },
          { id: 'm2', key: 'Tom Editorial', value: 'Executivo' },
        ],
        chapters: [
          {
            id: 'chap_1',
            bookId: 'book_1',
            title: 'Introdução à IA Corporativa',
            position: 1,
            summary: 'Visão geral da evolução da IA e primeiros passos.',
            targetWords: 625,
            wordCount: 0,
            status: 'OUTLINED',
          },
        ],
      }),
      update: async ({ data }) => ({ id: 'book_1', ...data }),
    },
    bookChapter: {
      findUnique: async () => ({
        id: 'chap_1',
        bookId: 'book_1',
        title: 'Introdução à IA Corporativa',
        position: 1,
        summary: 'Visão geral da evolução da IA e primeiros passos.',
        targetWords: 625,
      }),
      update: async ({ data }) => ({ id: 'chap_1', ...data, sections: createdSections }),
      aggregate: async () => ({ _sum: { wordCount: 350 } }),
    },
    bookSection: {
      deleteMany: async () => { createdSections.length = 0; },
      create: async ({ data }) => {
        const sec = { id: `sec_${Date.now()}_${createdSections.length}`, ...data };
        createdSections.push(sec);
        return sec;
      },
    },
    bookMemory: {
      findFirst: async () => null,
      create: async ({ data }) => {
        const mem = { id: `mem_${Date.now()}`, ...data };
        createdMemories.push(mem);
        return mem;
      },
      update: async ({ data }) => ({ id: `mem_upd`, ...data }),
    },
  };

  const fakePrismaService = { client: fakeDb };
  const writer = new EbookWriterService(fakePrismaService);
  const chapterResult = await writer.generateChapterContent('book_1', 'chap_1');
  console.log('Generated chapter status:', chapterResult.status);
  console.log('Generated chapter word count:', chapterResult.wordCount);
  console.log('Generated sections count:', chapterResult.sections.length);
  console.log('Generated book memories count:', createdMemories.length);
  if (chapterResult.wordCount < 100) throw new Error('Expected substantial chapter content');
  if (chapterResult.status !== 'READY') throw new Error('Expected chapter status to be READY');
  if (createdMemories.length !== 1) throw new Error('Expected 1 new BookMemory entry created');
  console.log('>>> [TEST 2 PASSED]: Incremental writing, section structuring & BookMemory validated.');

  console.log('\n=== [TEST 3] EbookPdfService: Complete PDF Generation ===');
  const pdfService = new EbookPdfService();
  const mockBookForPdf = {
    id: 'book_1',
    title: 'Fundamentos de Inteligência Artificial para Negócios',
    subtitle: 'Guia Prático para Líderes',
    author: 'NEXORA Editorial Team',
    config: { targetPages: 10 },
    currentWordCount: 2550,
    chapters: [
      {
        id: 'chap_1',
        position: 1,
        title: 'Introdução à IA Corporativa',
        sections: [
          {
            title: '1. O que é IA aplicada aos negócios?',
            content: 'A inteligência artificial transformou-se no principal motor de inovação competitiva contemporânea. Organizações que adotam processos orientados a dados conseguem antecipar tendências e automatizar tarefas rotineiras com precisão milimétrica.',
          },
          {
            title: '2. Pilares de Governança',
            content: 'Implementar IA exige ética, conformidade com legislações de privacidade e alinhamento contínuo com os objetivos operacionais da empresa.',
          },
        ],
      },
      {
        id: 'chap_2',
        position: 2,
        title: 'Estratégias de Implementação',
        sections: [
          {
            title: '1. Avaliação de Maturidade Digital',
            content: 'Antes de iniciar projetos complexos de machine learning, é vital auditar a infraestrutura de dados e a capacitação das equipas internas.',
          },
        ],
      },
    ],
  };

  const pdfBuffer = await pdfService.generatePdf(mockBookForPdf);
  console.log('Generated PDF buffer length:', pdfBuffer.length, 'bytes');
  if (pdfBuffer.length < 1000) throw new Error('PDF buffer too small');
  console.log('>>> [TEST 3 PASSED]: High-fidelity PDF compilation validated.');

  console.log('\n========================================');
  console.log('ALL PHASE 2 VERIFICATION TESTS PASSED!');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
