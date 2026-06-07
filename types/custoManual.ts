export type CategoriaCusto =
  | "Hortifruti"
  | "Mercado"
  | "Gás"
  | "Manutenção"
  | "Outros";

export interface CustoManual {
  id: string;
  /** ISO date (YYYY-MM-DD) */
  data: string;
  valor: number;
  categoria: CategoriaCusto;
  obs?: string;
}
