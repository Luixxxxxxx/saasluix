export type TipoTransacao = "entrada" | "saida";
export type OrigemTransacao = "Banco" | "Manual" | "Boleto";

export interface Transacao {
  id: string;
  /** ISO date (YYYY-MM-DD) */
  data: string;
  descricao: string;
  tipo: TipoTransacao;
  origem: OrigemTransacao;
  /** valor absoluto, sempre positivo */
  valor: number;
  conta?: string;
}
