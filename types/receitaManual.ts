export type CategoriaReceita =
  | "Vendas"
  | "Cartão"
  | "Dinheiro"
  | "Delivery"
  | "Outros";

export interface ReceitaManual {
  id: string;
  /** ISO date (YYYY-MM-DD) */
  data: string;
  valor: number;
  categoria: CategoriaReceita;
  obs?: string;
}
