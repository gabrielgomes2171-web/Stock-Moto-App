/**
 * Rotas do app e um texto que só aparece quando a tela correspondente
 * foi de fato renderizada (usado para confirmar acesso ou bloqueio).
 */
export const ROTAS_INTERNAS: { rota: string; textos: string[] }[] = [
  { rota: '/inicial', textos: ['Painel de Controle'] },
  { rota: '/estoque', textos: ['MARCAS DE MOTOS'] },
  { rota: '/estoquehonda', textos: ['ESCOLHA O MODELO'] },
  { rota: '/estoquefan160', textos: ['CG 160 FAN', 'Peças em Estoque'] },
  { rota: '/estoquestart160', textos: ['CG 160 START', 'Peças em Estoque'] },
  { rota: '/estoquetitan160', textos: ['CG 160 TITAN', 'Peças em Estoque'] },
  { rota: '/estoquecargo160', textos: ['CG 160 CARGO', 'Peças em Estoque'] },
  { rota: '/capacetes', textos: ['Capacete Fechado Fw3 GT'] },
  { rota: '/bau', textos: ['Baú 90 Litros MG (Plástico)'] },
  { rota: '/cadastrar', textos: ['Adicionar Novo Produto'] },
  { rota: '/alertas', textos: ['Central de Alertas'] },
  { rota: '/orcamentos', textos: ['+ Novo Orçamento'] },
  { rota: '/criarorcamento', textos: ['Criar Orçamento'] },
  { rota: '/editarorcamento?id=orcamento-teste', textos: ['Salvar Alterações'] },
  { rota: '/perfil', textos: ['Editar Perfil'] },
  { rota: '/configuracoes', textos: ['Personalize o sistema conforme a sua necessidade'] },
  { rota: '/modal', textos: ['This is a modal'] },
  { rota: '/explore', textos: ['Explore'] },
];

export const ROTAS_AUTENTICACAO: { rota: string; texto: string }[] = [
  { rota: '/login', texto: 'ENTRAR NA CONTA' },
  { rota: '/cadastre-se', texto: 'CRIAR CONTA' },
  { rota: '/esqueceu-senha', texto: 'ENVIAR INSTRUÇÕES' },
  { rota: '/verificar-email', texto: 'Enviar novamente' },
  { rota: '/redefinir-senha', texto: 'VOLTAR PARA LOGIN' },
];

/** Expressão que casa com o conteúdo de qualquer tela interna. */
export const CONTEUDO_INTERNO = new RegExp(
  ['Painel de Controle', 'MARCAS DE MOTOS', 'ESCOLHA O MODELO', 'Peças em Estoque', 'Editar Perfil', 'Personalize o sistema']
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
);

export function caminhoSemQuery(rota: string) {
  return rota.split('?')[0];
}
