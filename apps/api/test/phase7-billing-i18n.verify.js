const assert = require('assert');
const { BillingEngineService } = require('../dist/modules/billing/services/billing-engine.service');

async function verifyPhase7() {
  console.log('============================================================');
  console.log('🧪 VERIFICAÇÃO AUTOMATIZADA — FASE 7 (MONETIZAÇÃO, CRÉDITOS & I18N)');
  console.log('============================================================\n');

  const engine = new BillingEngineService();

  // 1. Plans & Credit Packs Catalog
  const plans = engine.getPlansCatalog();
  const packs = engine.getCreditPacks();
  assert.strictEqual(plans.length, 4, 'Deve possuir 4 níveis de plano (FREE, STARTER, PRO, ENTERPRISE)');
  assert.strictEqual(packs.length, 4, 'Deve possuir 4 pacotes avulsos de créditos');
  console.log(`✅ [1/5] Catálogo SaaS validado: ${plans.length} Planos (${plans.map((p) => p.tier).join(', ')}) e ${packs.length} Pacotes de Créditos.`);

  // 2. Credit Costs Table & E-book Estimator
  const costs = engine.getCreditCostsTable();
  const opKeys = Object.keys(costs);
  assert.strictEqual(opKeys.length, 12, 'Tabela de custos deve cobrir 12 operações IA');
  const est500 = engine.estimateEbookCreditCost(500);
  const est800 = engine.estimateEbookCreditCost(800);
  assert.strictEqual(est500.recommendedTier, 'PRO', '500 páginas recomenda plano PRO');
  assert.strictEqual(est800.recommendedTier, 'ENTERPRISE', '800 páginas recomenda plano ENTERPRISE');
  console.log(`✅ [2/5] Tabela de Custos (${opKeys.length} operações) e Simulador E-book (500p = ${est500.estimatedCredits} créd.) validados.`);

  // 3. Transactional Ledger Deduction & Insufficient Credits Guard
  const deduction = engine.calculateLedgerDeduction(3500, 'EBOOK_200_PAGES');
  assert.strictEqual(deduction.cost, 360, 'Custo de EBOOK_200_PAGES deve ser 360 créditos');
  assert.strictEqual(deduction.balanceAfter, 3140, 'Saldo após dedução deve ser 3140');

  let insufficientCaught = false;
  try {
    engine.calculateLedgerDeduction(100, 'EBOOK_500_PAGES');
  } catch (err) {
    insufficientCaught = true;
  }
  assert.strictEqual(
    insufficientCaught,
    true,
    'Deve bloquear operação quando saldo de créditos é insuficiente',
  );
  console.log('✅ [3/5] Livro-Razão Transacional (Ledger) e proteção contra saldo negativo validados.');

  // 4. Stripe Checkout Session Generator
  const checkoutYearly = engine.createStripeCheckoutUrl('org-nexora-1', 'PRO', 'YEARLY');
  assert(checkoutYearly.sessionId.startsWith('cs_live_nexora_pro_'), 'Session ID Stripe válido');
  assert.strictEqual(checkoutYearly.amountEur, 372, 'Valor anual PRO deve ser €372');
  console.log(`✅ [4/5] Integração Stripe Checkout validada (${checkoutYearly.sessionId}, €${checkoutYearly.amountEur}/ano).`);

  // 5. Internationalization (PT, EN, ES, FR)
  const locales = engine.getSupportedLocales();
  assert.strictEqual(locales.length, 4, 'Deve suportar 4 idiomas iniciais (PT, EN, ES, FR)');
  const codes = locales.map((l) => l.code);
  assert.deepStrictEqual(codes, ['pt', 'en', 'es', 'fr'], 'Códigos de idioma PT, EN, ES, FR');
  for (const loc of locales) {
    assert(loc.dictionary.createPresentation, `Dicionário ${loc.code} completo`);
    assert(loc.dictionary.createEbook, `Dicionário ${loc.code} completo`);
  }
  console.log(`✅ [5/5] Internacionalização (I18n) validada para os 4 idiomas: ${codes.join(', ').toUpperCase()}.\n`);

  console.log('🎉 TODOS OS TESTES DA FASE 7 PASSARAM COM 100% DE SUCESSO!\n');
}

verifyPhase7().catch((err) => {
  console.error('❌ Falha na verificação da Fase 7:', err);
  process.exit(1);
});
