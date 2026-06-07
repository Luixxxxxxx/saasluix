const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/** Formata uma data ISO (YYYY-MM-DD) no padrão brasileiro curto "06/06". */
export function formatDataCurta(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/** Mês corrente no formato "YYYY-MM" (ex.: "2026-06"). */
export function mesAtualYM(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Converte "2026-06" em rótulo "Junho 2026". */
export function mesLabelDe(ym: string): string {
  const [ano, mes] = ym.split("-").map(Number);
  return `${MESES[mes - 1]} ${ano}`;
}

/** Rótulo do mês corrente, ex.: "Junho 2026". */
export function mesAtualLabel(): string {
  return mesLabelDe(mesAtualYM());
}

/**
 * Lista os últimos `n` meses (incluindo o atual), do mais recente para o mais
 * antigo, como { ym, label }. Gerado a partir da data de hoje.
 */
export function mesesRecentes(n = 12): { ym: string; label: string }[] {
  const hoje = new Date();
  const lista: { ym: string; label: string }[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    lista.push({ ym, label: mesLabelDe(ym) });
  }
  return lista;
}
