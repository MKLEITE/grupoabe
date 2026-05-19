/**
 * Rota estática com identificador alfanumérico (difícil de adivinhar).
 * Mantém todo o deck/apresentação que antes estava na raiz `/`.
 * Não use isto como link visível na Home pública: partilhar só o URL quando fizer falta (email, marcador interno).
 */
export const APRESENTACAO_ROUTE_TOKEN = "abe-apresentacao-8fqm3xk2" as const;

export function getApresentacaoPath(): `/${typeof APRESENTACAO_ROUTE_TOKEN}` {
  return `/${APRESENTACAO_ROUTE_TOKEN}`;
}
