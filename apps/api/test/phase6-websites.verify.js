const assert = require('assert');
const JSZip = require('jszip');
const { WebsitesEngineService } = require('../dist/modules/websites/services/websites-engine.service');

async function verifyPhase6() {
  console.log('============================================================');
  console.log('🧪 VERIFICAÇÃO AUTOMATIZADA — FASE 6 (NEXORA WEB & LANDING PAGES)');
  console.log('============================================================\n');

  const engine = new WebsitesEngineService();

  // 1. Metadata validation
  const archetypes = engine.getArchetypes();
  const themes = engine.getThemes();
  assert.strictEqual(archetypes.length, 5, 'Deve suportar 5 arquétipos de Website');
  assert.strictEqual(themes.length, 5, 'Deve suportar 5 temas visuais');
  console.log(`✅ [1/5] Arquétipos (${archetypes.length}) e Temas Visuais (${themes.length}) validados.`);

  // 2. Structured 9-section Website generation
  const generated = engine.generateWebsite({
    projectId: 'proj-web-test',
    title: 'NEXORA Cloud — Plataforma SaaS de Criação Digital com IA',
    brandName: 'NEXORA Cloud',
    archetype: 'SAAS_LANDING',
    theme: 'MIDNIGHT_INDIGO',
    primaryCtaText: 'Começar Agora Gratuitamente',
  });
  assert(generated.seo && generated.seo.slug, 'SEO e slug gerados');
  assert.strictEqual(generated.metricsBanner.length, 4, 'Deve possuir 4 métricas de impacto');
  assert.strictEqual(generated.featuresGrid.items.length, 6, 'Deve possuir 6 cartões de funcionalidades');
  assert.strictEqual(generated.showcaseSteps.steps.length, 3, 'Deve possuir 3 etapas de workflow');
  assert.strictEqual(generated.testimonials.length, 3, 'Deve possuir 3 testemunhos');
  assert.strictEqual(generated.pricingTable.plans.length, 3, 'Deve possuir 3 planos de preços');
  assert(generated.faq.length >= 4, 'Deve possuir >= 4 perguntas na FAQ');
  console.log('✅ [2/5] Estrutura responsiva de 9 secções e metadados SEO/OpenGraph validados.');

  // 3. AI CRO & Translation Commands
  const croResult = engine.executeAiCommand(
    generated,
    'Otimizar copy para conversão (CRO)',
  );
  assert(
    croResult.updatedData.hero.primaryCta.includes('Garantir'),
    'CTA principal otimizado para conversão',
  );

  const enResult = engine.executeAiCommand(
    croResult.updatedData,
    'Traduzir para Inglês',
  );
  assert.strictEqual(enResult.updatedData.language, 'en', 'Idioma alterado para EN');
  console.log('✅ [3/5] Assistente IA de Conversão (CRO) e Tradução Multilíngue validados.');

  // 4. Standalone HTML5 Export
  const html = engine.exportToHtml(
    'NEXORA Cloud — Plataforma SaaS de Criação Digital com IA',
    generated,
  );
  assert(html.startsWith('<!DOCTYPE html>'), 'Deve iniciar com DOCTYPE html');
  assert(html.includes('property="og:title"'), 'Deve incluir meta tags OpenGraph');
  assert(html.includes('https://cdn.tailwindcss.com'), 'Deve incluir Tailwind CSS');
  console.log(`✅ [4/5] Exportação HTML5 Autónomo validada (${html.length} bytes).`);

  // 5. Static Bundle ZIP Export
  const zipBuffer = await engine.exportToZip(
    'NEXORA Cloud — Plataforma SaaS de Criação Digital com IA',
    generated,
  );
  assert(zipBuffer.length > 2500, 'Pacote ZIP deve ter > 2.5 KB');
  assert.strictEqual(zipBuffer.slice(0, 2).toString(), 'PK', 'Assinatura ZIP PK válida');

  const loadedZip = await JSZip.loadAsync(zipBuffer);
  const files = Object.keys(loadedZip.files);
  assert(files.includes('index.html'), 'ZIP deve conter index.html');
  assert(files.includes('manifest.json'), 'ZIP deve conter manifest.json');
  assert(files.includes('README.md'), 'ZIP deve conter README.md');
  assert(files.includes('assets/css/custom.css'), 'ZIP deve conter assets/css/custom.css');
  assert(files.includes('assets/js/main.js'), 'ZIP deve conter assets/js/main.js');
  console.log(
    `✅ [5/5] Pacote Estático ZIP validado (${zipBuffer.length} bytes, ${files.length} ficheiros internos: ${files.join(', ')}).\n`,
  );

  console.log('🎉 TODOS OS TESTES DA FASE 6 PASSARAM COM 100% DE SUCESSO!\n');
}

verifyPhase6().catch((err) => {
  console.error('❌ Falha na verificação da Fase 6:', err);
  process.exit(1);
});
