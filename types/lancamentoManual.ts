/** Item unificado do livro-caixa manual (entrada ou saída), para exibição. */
export interface LancamentoManual {
  id: string;
  tipo: "entrada" | "saida";
  /** ISO date (YYYY-MM-DD) */
  data: string;
  categoria: string;
  obs?: string;
  valor: number;
}
