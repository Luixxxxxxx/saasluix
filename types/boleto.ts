export type StatusBoleto = "pago" | "pendente" | "urgente" | "vencido";

export interface Boleto {
  id: string;
  fornecedor: string;
  valor: number;
  /** ISO date (YYYY-MM-DD) */
  vencimento: string;
  /** ISO date (YYYY-MM-DD) */
  dataPagamento?: string;
  status: StatusBoleto;
  obs?: string;
}
