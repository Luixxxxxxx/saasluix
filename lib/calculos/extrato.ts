import type { Boleto } from "@/types/boleto";
import type { CustoManual } from "@/types/custoManual";
import type { ReceitaManual } from "@/types/receitaManual";
import type { Transacao } from "@/types/transacao";

/**
 * Une transacoes bancarias, custos manuais, receitas manuais e boletos pagos
 * num extrato unico, ordenado da data mais recente para a mais antiga.
 */
export function mergeExtrato(
  transacoes: Transacao[],
  custosManuais: CustoManual[],
  receitasManuais: ReceitaManual[],
  boletos: Boleto[],
): Transacao[] {
  const saidas: Transacao[] = custosManuais.map((c) => ({
    id: `custo-${c.id}`,
    data: c.data,
    descricao: c.obs ? `${c.categoria} — ${c.obs}` : c.categoria,
    tipo: "saida",
    origem: "Manual",
    valor: c.valor,
  }));

  const entradas: Transacao[] = receitasManuais.map((r) => ({
    id: `receita-${r.id}`,
    data: r.data,
    descricao: r.obs ? `${r.categoria} — ${r.obs}` : r.categoria,
    tipo: "entrada",
    origem: "Manual",
    valor: r.valor,
  }));

  const boletosPagos: Transacao[] = boletos
    .filter((b) => b.status === "pago")
    .map((b): Transacao => ({
      id: `boleto-${b.id}`,
      data: b.dataPagamento ?? b.vencimento,
      descricao: b.obs ? `${b.fornecedor} - ${b.obs}` : b.fornecedor,
      tipo: "saida",
      origem: "Boleto",
      valor: b.valor,
    }));

  return [...transacoes, ...saidas, ...entradas, ...boletosPagos].sort((a, b) =>
    b.data.localeCompare(a.data),
  );
}
