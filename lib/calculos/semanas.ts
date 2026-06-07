import type { MovSimples } from "./resumoMes";

export interface SemanaGrafico {
  semana: string;
  entradas: number;
  saidas: number;
}

/**
 * Agrupa entradas e saídas do mês informado (`ym` = "YYYY-MM") por semana
 * (blocos de 7 dias).
 */
export function calcularSemanas(
  entradas: MovSimples[],
  saidas: MovSimples[],
  ym: string,
): SemanaGrafico[] {
  const [ano, mes] = ym.split("-").map(Number); // mes 1-based
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const nSemanas = Math.ceil(diasNoMes / 7);

  const buckets: SemanaGrafico[] = Array.from({ length: nSemanas }, (_, i) => ({
    semana: `Sem ${i + 1}`,
    entradas: 0,
    saidas: 0,
  }));

  const indice = (iso: string) => {
    const dia = parseInt(iso.slice(8, 10), 10);
    return Math.min(Math.floor((dia - 1) / 7), nSemanas - 1);
  };

  for (const e of entradas) {
    if (!e.data.startsWith(ym)) continue;
    buckets[indice(e.data)].entradas += e.valor;
  }
  for (const s of saidas) {
    if (!s.data.startsWith(ym)) continue;
    buckets[indice(s.data)].saidas += s.valor;
  }

  return buckets;
}
