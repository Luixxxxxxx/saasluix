import type { StatusBoleto } from "@/types/boleto";

/**
 * Decide o status de exibição de um boleto a partir do status gravado
 * ("pendente"/"pago") e da data de vencimento:
 * - pago      → PAGO
 * - vencido   → venceu antes de hoje
 * - urgente   → vence em até 3 dias
 * - pendente  → demais casos
 */
export function statusBoletoDisplay(
  statusDb: string,
  vencimentoIso: string,
): StatusBoleto {
  if (statusDb === "pago") return "pago";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(vencimentoIso + "T00:00:00");
  const dias = Math.round((venc.getTime() - hoje.getTime()) / 86_400_000);

  if (dias < 0) return "vencido";
  if (dias <= 3) return "urgente";
  return "pendente";
}
