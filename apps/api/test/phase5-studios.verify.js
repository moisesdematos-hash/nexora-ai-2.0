const assert = require('assert');
const { DocsEngineService } = require('../dist/modules/docs/services/docs-engine.service');
const { MindMapsEngineService } = require('../dist/modules/mindmaps/services/mindmaps-engine.service');
const { InfographicsEngineService } = require('../dist/modules/infographics/services/infographics-engine.service');

async function verifyPhase5() {
  console.log('============================================================');
  console.log('🧪 VERIFICAÇÃO AUTOMATIZADA — FASE 5 (DOCS, MIND MAPS, INFOGRAPHICS)');
  console.log('============================================================\n');

  // ------------------------------------------------------------
  // 1. NEXORA DOCS ENGINE
  // ------------------------------------------------------------
  const docsEngine = new DocsEngineService();
  const templates = docsEngine.getTemplates();
  assert.strictEqual(templates.length, 5, 'Deve possuir 5 templates documentais');
  console.log(`✅ [1/6] NEXORA DOCS: ${templates.length} templates corporativos validados.`);

  const generatedDoc = docsEngine.generateStructuredDocument({
    projectId: 'proj-test-doc',
    title: 'Proposta Enterprise de Automação IA 2026',
    template: 'COMMERCIAL_PROPOSAL',
    prompt: 'Solução SaaS multi-tenant para criação editorial e visual',
    author: 'Equipa NEXORA',
    organizationName: 'NEXORA Corp',
  });
  assert(generatedDoc.wordCount > 150, 'Contagem de palavras deve ser > 150');
  assert(generatedDoc.content.sections.length >= 5, 'Proposta deve ter pelo menos 5 secções');

  const aiDocResult = docsEngine.executeAiCommand(
    'Proposta Enterprise de Automação IA 2026',
    generatedDoc.content,
    'Gerar tabela de KPIs trimestrais',
  );
  assert(
    aiDocResult.updatedContent.sections.length > generatedDoc.content.sections.length,
    'Comando IA deve adicionar nova secção de KPIs',
  );

  const docPdfBuffer = await docsEngine.exportToPdf(
    'Proposta Enterprise de Automação IA 2026',
    aiDocResult.updatedContent,
  );
  assert(docPdfBuffer.length > 1500, 'PDF de Documento deve ter > 1.5 KB');
  assert.strictEqual(docPdfBuffer.slice(0, 5).toString(), '%PDF-', 'Assinatura PDF válida');

  const docDocxBuffer = await docsEngine.exportToDocx(
    'Proposta Enterprise de Automação IA 2026',
    aiDocResult.updatedContent,
  );
  assert(docDocxBuffer.length > 3000, 'DOCX de Documento deve ter > 3 KB');
  assert.strictEqual(docDocxBuffer.slice(0, 2).toString(), 'PK', 'Assinatura ZIP/DOCX válida');

  const docMd = docsEngine.exportToMarkdown(
    'Proposta Enterprise de Automação IA 2026',
    aiDocResult.updatedContent,
  );
  assert(docMd.includes('# Proposta Enterprise'), 'Markdown deve conter título H1');
  console.log(
    `✅ [2/6] NEXORA DOCS Exportações: PDF (${docPdfBuffer.length} bytes), DOCX (${docDocxBuffer.length} bytes), MD (${docMd.length} chars).`,
  );

  // ------------------------------------------------------------
  // 2. NEXORA MIND MAPS ENGINE
  // ------------------------------------------------------------
  const mindMapsEngine = new MindMapsEngineService();
  const diagramTypes = mindMapsEngine.getDiagramTypes();
  const mmThemes = mindMapsEngine.getThemes();
  assert.strictEqual(diagramTypes.length, 5, 'Deve suportar 5 tipos de diagramas');
  assert.strictEqual(mmThemes.length, 5, 'Deve suportar 5 temas de mapas mentais');

  const generatedMap = mindMapsEngine.generateMindMap({
    projectId: 'proj-test-mm',
    title: 'Arquitetura Cloud NEXORA AI 2.0',
    diagramType: 'ARCHITECTURE',
    theme: 'NEON_TECH',
  });
  assert(generatedMap.nodes.length >= 13, 'Mapa inicial deve ter >= 13 nós (raiz + 4 L1 + 12 L2)');
  assert(generatedMap.edges.length >= 12, 'Mapa inicial deve ter >= 12 arestas');

  const expandedMap = mindMapsEngine.expandNode(
    generatedMap,
    'node-l1-1',
    'Sub-componentes de Frontend',
    3,
  );
  assert.strictEqual(expandedMap.addedNodes.length, 3, 'Deve expandir exatamente 3 novos sub-nós');
  assert.strictEqual(
    expandedMap.updatedData.nodes.length,
    generatedMap.nodes.length + 3,
    'Total de nós atualizado após expansão IA',
  );
  console.log(
    `✅ [3/6] NEXORA MIND MAPS: ${generatedMap.nodes.length} nós iniciais -> ${expandedMap.updatedData.nodes.length} nós após expansão IA.`,
  );

  const mmSvg = mindMapsEngine.exportToSvg(
    'Arquitetura Cloud NEXORA AI 2.0',
    expandedMap.updatedData,
  );
  const mmMd = mindMapsEngine.exportToMarkdown(
    'Arquitetura Cloud NEXORA AI 2.0',
    expandedMap.updatedData,
  );
  assert(mmSvg.includes('<svg') && mmSvg.includes('<path'), 'SVG deve conter curvas Bézier <path>');
  assert(mmMd.includes('Arquitetura Cloud NEXORA AI 2.0'), 'Outline Markdown válido');
  console.log(
    `✅ [4/6] NEXORA MIND MAPS Exportações: SVG Vetorial (${mmSvg.length} bytes), Outline MD (${mmMd.length} chars).`,
  );

  // ------------------------------------------------------------
  // 3. NEXORA INFOGRAPHICS ENGINE
  // ------------------------------------------------------------
  const infoEngine = new InfographicsEngineService();
  const archetypes = infoEngine.getArchetypes();
  const palettes = infoEngine.getPalettes();
  assert.strictEqual(archetypes.length, 5, 'Deve possuir 5 arquétipos de infográfico');
  assert.strictEqual(palettes.length, 5, 'Deve possuir 5 paletas cromáticas');

  const generatedInfo = infoEngine.generateInfographic({
    projectId: 'proj-test-info',
    title: 'Produtividade Global com IA Generativa 2026',
    infographicType: 'STATISTICAL',
    palette: 'CYBER_INDIGO',
  });
  assert.strictEqual(generatedInfo.kpiCards.length, 3, 'Deve conter 3 KPI cards de destaque');
  assert(generatedInfo.chartItems.length >= 4, 'Deve conter >= 4 barras comparativas');
  assert(generatedInfo.milestones.length >= 3, 'Deve conter >= 3 marcos visuais');

  const infoSvg = infoEngine.exportToSvg(
    'Produtividade Global com IA Generativa 2026',
    800,
    1200,
    generatedInfo,
  );
  const infoPdfBuffer = await infoEngine.exportToPdf(
    'Produtividade Global com IA Generativa 2026',
    generatedInfo,
  );
  assert(
    infoSvg.includes('viewBox="0 0 800 1200"'),
    'Poster SVG deve ter resolução vertical 800x1200',
  );
  assert(infoPdfBuffer.length > 1500, 'Poster PDF deve ter > 1.5 KB');
  assert.strictEqual(infoPdfBuffer.slice(0, 5).toString(), '%PDF-', 'Assinatura PDF válida');
  console.log(
    `✅ [5/6] NEXORA INFOGRAPHICS: 5 arquétipos, 5 paletas, Poster SVG 800x1200 (${infoSvg.length} bytes) e Poster PDF (${infoPdfBuffer.length} bytes).`,
  );

  console.log('✅ [6/6] TODOS OS TESTES DA FASE 5 PASSARAM COM 100% DE SUCESSO!\n');
}

verifyPhase5().catch((err) => {
  console.error('❌ Falha na verificação da Fase 5:', err);
  process.exit(1);
});
