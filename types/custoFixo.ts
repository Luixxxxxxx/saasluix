export type StatusFixo = "pago" | "pendente";

export interface CustoFixo {
  id: string;
  nome: string;
  valor: number;
  diaVencimento: number;
  status: StatusFixo;
}
