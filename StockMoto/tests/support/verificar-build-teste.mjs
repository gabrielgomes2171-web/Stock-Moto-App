// Confere que o build web usado nos testes aponta SOMENTE para o projeto
// Firebase fictício "demo-". Roda antes de o servidor dos testes subir (ver
// webServer em playwright.config.ts): se falhar, a suíte não executa.
//
// Uso: node tests/support/verificar-build-teste.mjs <pasta-do-build>
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pasta = process.argv[2];
if (!pasta) {
  console.error('Uso: node tests/support/verificar-build-teste.mjs <pasta-do-build>');
  process.exit(2);
}

function arquivosJs(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivosJs(caminho);
    return nome.endsWith('.js') ? [caminho] : [];
  });
}

const codigo = arquivosJs(pasta).map((arquivo) => readFileSync(arquivo, 'utf8')).join('\n');
const valores = (campo) =>
  [...codigo.matchAll(new RegExp(`${campo}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`, 'g'))].map((m) => m[1]);

const projetos = [...new Set(valores('projectId'))];
const chaves = [...new Set(valores('apiKey'))];
const erros = [];

if (projetos.length === 0) {
  erros.push('nenhuma configuração do Firebase encontrada no build');
}
for (const projeto of projetos) {
  if (!projeto.startsWith('demo-')) erros.push(`projectId não é de teste: ${projeto}`);
}
for (const chave of chaves) {
  // Chaves reais de API do Google começam com "AIza".
  if (chave.startsWith('AIza')) erros.push(`apiKey real do Google encontrada no build: ${chave.slice(0, 8)}...`);
}

if (erros.length) {
  console.error('\n[verificar-build-teste] O build NÃO é seguro para os testes:');
  for (const erro of erros) console.error(`  - ${erro}`);
  console.error('Gere o build com EXPO_PUBLIC_FIREBASE_AMBIENTE=teste.\n');
  process.exit(1);
}

console.log(`[verificar-build-teste] OK: somente projetos de teste (${projetos.join(', ')}).`);
