const Module = require('module');
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@nexora/db') {
    return { PrismaClient: class {} };
  }
  return originalLoad.apply(this, arguments);
};

const JSZip = require('jszip');
const { EbookPlannerService } = require('../dist/modules/ebooks/services/ebook-planner.service');
const { EbookWriterService } = require('../dist/modules/ebooks/services/ebook-writer.service');
const { EbookQueueService } = require('../dist/modules/ebooks/services/ebook-queue.service');
const { EbookReviewService } = require('../dist/modules/ebooks/services/ebook-review.service');
const { EbookCoverService } = require('../dist/modules/ebooks/services/ebook-cover.service');
const { EbookEpubService } = require('../dist/modules/ebooks/services/ebook-epub.service');
const { EbookDocxService } = require('../dist/modules/ebooks/services/ebook-docx.service');
const { EbookPdfService } = require('../dist/modules/ebooks/services/ebook-pdf.service');

async function runPhase3Tests() {
  console.log('===============================================================');
  console.log('NEXORA AI 2.0 — PHASE 3 ADVANCED EBOOK STUDIO VERIFICATION');
  console.log('===============================================================\n');

  const planner = new EbookPlannerService();

  // -----------------------------------------------------------------
  // TEST 1: 50, 100, 200, AND 500 PAGES PLANNING & HIERARCHY
  // -----------------------------------------------------------------
  console.log('=== [TEST 1] Longform Planning: 50, 100, 200 & 500 Pages ===');
  const targets = [
    { pages: 50, expectedWords: 12500, expectedParts: 3, expectedChapters: 10 },
    { pages: 100, expectedWords: 25000, expectedParts: 4, expectedChapters: 15 },
    { pages: 200, expectedWords: 50000, expectedParts: 5, expectedChapters: 20 },
    { pages: 500, expectedWords: 125000, expectedParts: 6, expectedChapters: 30 },
  ];

  for (const t of targets) {
    const plan = await planner.generateOutline({
      topic: `Arquitetura Empresarial Escalável (${t.pages}p)`,
      targetPages: t.pages,
      language: 'pt',
    });

    console.log(
      `-> Target ${t.pages}p: ${plan.totalWordCount} words | ${plan.parts.length} parts | ${plan.chapters.length} chapters`,
    );

    if (plan.totalWordCount !== t.expectedWords) {
      throw new Error(`Expected ${t.expectedWords} words for ${t.pages}p, got ${plan.totalWordCount}`);
    }
    if (plan.parts.length !== t.expectedParts) {
      throw new Error(`Expected ${t.expectedParts} parts for ${t.pages}p, got ${plan.parts.length}`);
    }
    if (plan.chapters.length !== t.expectedChapters) {
      throw new Error(`Expected ${t.expectedChapters} chapters for ${t.pages}p, got ${plan.chapters.length}`);
    }
  }
  console.log('>>> [TEST 1 PASSED]: 50, 100, 200 & 500 page plans validated.\n');

  // -----------------------------------------------------------------
  // TEST 2: QUEUE BATCH GENERATION & CHECKPOINT RESUME
  // -----------------------------------------------------------------
  console.log('=== [TEST 2] Batch Queue Generation & Checkpoint Recovery ===');
  const chaptersStore = [
    { id: 'ch_1', bookId: 'book_adv', position: 1, title: 'Fundamentos da IA', status: 'READY', wordCount: 280, sections: [{ title: '1. Intro', content: 'A compreensão rigorosa de Fundamentos da IA constitui um marco decisivo.' }] },
    { id: 'ch_2', bookId: 'book_adv', position: 2, title: 'Orquestração de Modelos', status: 'PENDING', wordCount: 0, sections: [] },
    { id: 'ch_3', bookId: 'book_adv', position: 3, title: 'Governação e Segurança', status: 'PENDING', wordCount: 0, sections: [] },
  ];
  const versionsStore = [
    { id: 'v_1', bookId: 'book_adv', version: 1, snapshot: { lastCompletedPosition: 1 }, createdAt: new Date() },
  ];
  const memoriesStore = [
    { id: 'm_1', bookId: 'book_adv', key: 'Objetivo Geral', value: 'Dominar IA Generativa' },
  ];
  const assetsStore = [];

  let bookRecord = {
    id: 'book_adv',
    title: 'Engenharia de IA Generativa em Escala',
    subtitle: 'Arquitetura, Orquestração e Governação',
    language: 'pt',
    coverUrl: null,
    currentWordCount: 280,
    config: {
      targetPages: 50,
      author: 'Equipa NEXORA AI',
      includeExamples: true,
      includeExercises: true,
      includeReferences: true,
    },
  };

  const mockPrisma = {
    client: {
      book: {
        findUnique: async () => ({
          ...bookRecord,
          outline: { id: 'out_1' },
          chapters: chaptersStore,
          memories: memoriesStore,
          versions: versionsStore,
        }),
        update: async ({ data }) => {
          bookRecord = { ...bookRecord, ...data };
          return bookRecord;
        },
      },
      bookChapter: {
        update: async ({ where, data }) => {
          const idx = chaptersStore.findIndex((c) => c.id === where.id);
          if (idx >= 0) {
            chaptersStore[idx] = { ...chaptersStore[idx], ...data };
            return chaptersStore[idx];
          }
          return data;
        },
        aggregate: async () => ({
          _sum: { wordCount: chaptersStore.reduce((acc, c) => acc + (c.wordCount || 0), 0) },
        }),
      },
      bookSection: {
        deleteMany: async ({ where }) => {
          const ch = chaptersStore.find((c) => c.id === where.chapterId);
          if (ch) ch.sections = [];
        },
        create: async ({ data }) => {
          const ch = chaptersStore.find((c) => c.id === data.chapterId);
          const sec = { id: `sec_${Date.now()}_${Math.random()}`, ...data };
          if (ch) ch.sections.push(sec);
          return sec;
        },
      },
      bookMemory: {
        create: async ({ data }) => {
          const m = { id: `mem_${Date.now()}`, ...data };
          memoriesStore.push(m);
          return m;
        },
      },
      bookVersion: {
        count: async () => versionsStore.length,
        create: async ({ data }) => {
          const v = { id: `ver_${versionsStore.length + 1}`, ...data, createdAt: new Date() };
          versionsStore.push(v);
          return v;
        },
      },
      bookAsset: {
        create: async ({ data }) => {
          const a = { id: `ast_${assetsStore.length + 1}`, ...data };
          assetsStore.push(a);
          return a;
        },
      },
    },
  };

  const writerService = new EbookWriterService(mockPrisma);
  const queueService = new EbookQueueService(mockPrisma, writerService);

  // Resume from checkpoint (ch_1 is already READY, so only ch_2 and ch_3 should be generated)
  const queueResult = await queueService.startOrResumeBatchGeneration('book_adv', {
    synchronousForTest: true,
  });

  console.log('Queue final status:', queueResult.status);
  console.log('Queue progressPercent:', queueResult.progressPercent, '%');
  console.log('Total checkpoints in BookVersion:', versionsStore.length);

  if (queueResult.status !== 'COMPLETED' || queueResult.progressPercent !== 100) {
    throw new Error('Expected queue batch generation to reach 100% COMPLETED');
  }
  if (versionsStore.length !== 3) {
    throw new Error(`Expected 3 checkpoints in BookVersion, got ${versionsStore.length}`);
  }
  console.log('>>> [TEST 2 PASSED]: Batch Queue & Checkpoints recovery validated.\n');

  // -----------------------------------------------------------------
  // TEST 3: GLOBAL EDITORIAL REVIEW & REPETITION DETECTOR
  // -----------------------------------------------------------------
  console.log('=== [TEST 3] Global Editorial Review & Repetition Detector ===');
  const reviewService = new EbookReviewService(mockPrisma);
  const reviewReport = await reviewService.reviewBook('book_adv');

  console.log('Overall Editorial Score:', reviewReport.overallScore, '/ 100');
  console.log('Coherence Score:', reviewReport.coherenceScore, '%');
  console.log('Originality Score:', reviewReport.originalityScore, '%');
  console.log('Repetitions detected:', reviewReport.repetitionsFound.length);

  if (reviewReport.overallScore < 80) {
    throw new Error(`Expected high editorial score (>=80), got ${reviewReport.overallScore}`);
  }
  console.log('>>> [TEST 3 PASSED]: Global Review & Repetition Detector validated.\n');

  // -----------------------------------------------------------------
  // TEST 4: EDITORIAL COVER SVG GENERATOR
  // -----------------------------------------------------------------
  console.log('=== [TEST 4] Editorial Cover Generator (SVG / DataURL) ===');
  const coverService = new EbookCoverService(mockPrisma);
  const coverResult = await coverService.generateCover('book_adv', {
    style: 'TECH_FUTURISTIC',
    badgeText: 'COLEÇÃO IA AVANÇADA',
  });

  console.log('Generated cover style:', coverResult.presetName);
  console.log('Cover DataURL prefix:', coverResult.coverUrl.slice(0, 35) + '...');
  console.log('BookAssets count:', assetsStore.length);

  if (!coverResult.coverUrl.startsWith('data:image/svg+xml;base64,')) {
    throw new Error('Expected valid SVG DataURL for book cover');
  }
  console.log('>>> [TEST 4 PASSED]: Editorial Cover generation & asset storage validated.\n');

  // -----------------------------------------------------------------
  // TEST 5: EPUB 3.0 INTERNATIONAL STANDARD EXPORT
  // -----------------------------------------------------------------
  console.log('=== [TEST 5] EPUB 3.0 Package Export & Structure Inspection ===');
  const epubService = new EbookEpubService();
  const fullBookData = await mockPrisma.client.book.findUnique();
  const epubBuffer = await epubService.generateEpub(fullBookData);

  console.log('EPUB 3 binary buffer size:', epubBuffer.length, 'bytes');
  const loadedEpubZip = await JSZip.loadAsync(epubBuffer);
  const epubFiles = Object.keys(loadedEpubZip.files);
  console.log('EPUB internal files:', epubFiles.join(', '));

  const requiredEpubFiles = [
    'mimetype',
    'META-INF/container.xml',
    'OEBPS/content.opf',
    'OEBPS/toc.xhtml',
    'OEBPS/cover.xhtml',
    'OEBPS/chapter-1.xhtml',
    'OEBPS/chapter-2.xhtml',
    'OEBPS/chapter-3.xhtml',
  ];
  for (const reqFile of requiredEpubFiles) {
    if (!loadedEpubZip.files[reqFile]) {
      throw new Error(`Missing required EPUB 3 file: ${reqFile}`);
    }
  }
  const mimetypeContent = await loadedEpubZip.file('mimetype').async('string');
  if (mimetypeContent !== 'application/epub+zip') {
    throw new Error(`Invalid EPUB mimetype: ${mimetypeContent}`);
  }
  console.log('>>> [TEST 5 PASSED]: EPUB 3.0 standard structure validated.\n');

  // -----------------------------------------------------------------
  // TEST 6: DOCX EDITABLE DOCUMENT EXPORT & PDF EXPORT
  // -----------------------------------------------------------------
  console.log('=== [TEST 6] DOCX Editable Export & PDF Export ===');
  const docxService = new EbookDocxService();
  const docxBuffer = await docxService.generateDocx(fullBookData);
  console.log('DOCX binary buffer size:', docxBuffer.length, 'bytes');

  const loadedDocxZip = await JSZip.loadAsync(docxBuffer);
  if (!loadedDocxZip.files['word/document.xml']) {
    throw new Error('Invalid DOCX structure: missing word/document.xml');
  }

  const pdfService = new EbookPdfService();
  const pdfBuffer = await pdfService.generatePdf(fullBookData);
  console.log('PDF binary buffer size:', pdfBuffer.length, 'bytes');
  if (pdfBuffer.length < 2000) {
    throw new Error('PDF buffer unexpectedly small');
  }
  console.log('>>> [TEST 6 PASSED]: DOCX and PDF multi-format exports validated.\n');

  console.log('===============================================================');
  console.log('ALL 6 PHASE 3 VERIFICATION TEST SUITES PASSED SUCCESSFULLY!');
  console.log('===============================================================');
}

runPhase3Tests().catch((err) => {
  console.error('Phase 3 verification failed:', err);
  process.exit(1);
});
