export interface Conta {
  id: string;
  banco: string;
  tipo: string;
  saldo: number;
  /** ISO date (YYYY-MM-DD) até quando o consentimento Open Finance é válido */
  consentimentoAte?: string;
}
