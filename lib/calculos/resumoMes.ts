export interface Resumo {
  saldoAtual: number;
  entradas: number;
  saidas: number;
  resultado: number;
}

/** Movimentação simplificada usada nos cálculos. */
export interface MovSimples {
  data: string;
  valor: number;
}

const somar = (lista: MovSimples[]) => lista.reduce((acc, m) => acc + m.valor, 0);
const doMes = (lista: MovSimples[], ym: string) =>
  lista.filter((m) => m.data.startsWith(ym));

/**
 * Calcula o resumo a partir das entradas e saídas (manuais e/ou bancárias):
 * - entradas/saídas: total do mês informado (`ym` = "YYYY-MM")
 * - resultado: entradas − saídas do mês
 * - saldoAtual: acumulado de todas as entradas − todas as saídas (todo período)
 */
export function calcularResumo(
  entradas: MovSimples[],
  saidas: MovSimples[],
  ym: string,
): Resumo {
  const entradasMes = somar(doMes(entradas, ym));
  const saidasMes = somar(doMes(saidas, ym));

  return {
    saldoAtual: somar(entradas) - somar(saidas),
    entradas: entradasMes,
    saidas: saidasMes,
    resultado: entradasMes - saidasMes,
  };
}
