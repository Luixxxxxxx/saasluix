import Topbar from "@/components/layout/Topbar";
import AlertBar from "@/components/dashboard/AlertBar";
import KpiGrid from "@/components/dashboard/KpiGrid";
import ChartEntradasSaidas from "@/components/dashboard/ChartEntradasSaidas";
import FixosCard from "@/components/dashboard/FixosCard";
import SeletorMes from "@/components/dashboard/SeletorMes";
import BoletoList from "@/components/boletos/BoletoList";
import ExtratoTable from "@/components/extrato/ExtratoTable";
import { ModalCustoManualProvider } from "@/components/forms/ModalCustoManual";
import BtnRegistrarCusto from "@/components/forms/BtnRegistrarCusto";
import {
  getBoletos,
  getCustosFixos,
  getCustosManuais,
  getReceitasManuais,
  getTransacoes,
} from "@/lib/data/queries";
import { calcularResumo } from "@/lib/calculos/resumoMes";
import { calcularSemanas } from "@/lib/calculos/semanas";
import { mergeExtrato } from "@/lib/calculos/extrato";
import { mesAtualYM, mesLabelDe } from "@/lib/utils/formatData";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes } = await searchParams;
  const ym = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : mesAtualYM();

  const [fixos, boletos, custosManuais, receitasManuais, transacoes] = await Promise.all([
    getCustosFixos(),
    getBoletos(),
    getCustosManuais(),
    getReceitasManuais(),
    getTransacoes(),
  ]);

  // Entradas = receitas manuais + transacoes bancarias de entrada.
  // Saidas = custos manuais + boletos pagos + transacoes bancarias de saida.
  const entradas = [
    ...receitasManuais.map((r) => ({ data: r.data, valor: r.valor })),
    ...transacoes.filter((t) => t.tipo === "entrada").map((t) => ({ data: t.data, valor: t.valor })),
  ];
  const saidas = [
    ...custosManuais.map((c) => ({ data: c.data, valor: c.valor })),
    ...boletos
      .filter((b) => b.status === "pago")
      .map((b) => ({ data: b.dataPagamento ?? b.vencimento, valor: b.valor })),
    ...transacoes.filter((t) => t.tipo === "saida").map((t) => ({ data: t.data, valor: t.valor })),
  ];

  const mesLabel = mesLabelDe(ym);
  const resumo = calcularResumo(entradas, saidas, ym);
  const semanas = calcularSemanas(entradas, saidas, ym);
  const extrato = mergeExtrato(transacoes, custosManuais, receitasManuais, boletos)
    .filter((t) => t.data.startsWith(ym))
    .slice(0, 10);

  const alertaBoletos = boletos.filter(
    (b) => b.status === "urgente" || b.status === "vencido",
  );

  return (
    <ModalCustoManualProvider>
      <Topbar
        title="Visão Geral"
        subtitle={mesLabel}
        actions={
          <>
            <SeletorMes />
            <BtnRegistrarCusto />
          </>
        }
      />

      {alertaBoletos.length > 0 && (
        <AlertBar
          resumo={`${alertaBoletos.length} boleto(s) precisam de atenção:`}
          detalhe={alertaBoletos.map((b) => b.fornecedor).join(" · ")}
        />
      )}

      <KpiGrid resumo={resumo} />

      <div className="mid-row">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">Entradas vs Saídas</div>
              <div className="card-sub">Por semana — {mesLabel}</div>
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: "var(--green)" }} /> Entradas
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: "var(--red)" }} /> Saídas
              </div>
            </div>
          </div>
          <ChartEntradasSaidas data={semanas} />
        </div>

        <FixosCard fixos={fixos} mesLabel={mesLabel} />
      </div>

      <div className="bottom-row">
        <BoletoList boletos={boletos} />
        <ExtratoTable transacoes={extrato} />
      </div>
    </ModalCustoManualProvider>
  );
}
