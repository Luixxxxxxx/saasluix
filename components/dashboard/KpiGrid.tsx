import { formatMoeda } from "@/lib/utils/formatMoeda";
import type { Resumo } from "@/lib/calculos/resumoMes";
import KpiCard from "./KpiCard";

export default function KpiGrid({ resumo }: { resumo: Resumo }) {
  return (
    <div className="kpi-grid">
      <KpiCard
        variant="neutral"
        valueColor="white"
        label="Saldo Atual"
        value={formatMoeda(resumo.saldoAtual)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="kpi-sub">Acumulado (entradas − saídas)</div>
      </KpiCard>

      <KpiCard
        variant="positive"
        valueColor="green"
        label="Entradas do Mês"
        value={formatMoeda(resumo.entradas)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        }
      >
        <div className="kpi-sub">Recebido no mês</div>
      </KpiCard>

      <KpiCard
        variant="negative"
        valueColor="red"
        label="Saídas do Mês"
        value={formatMoeda(resumo.saidas)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </svg>
        }
      >
        <div className="kpi-sub">Banco + custos manuais + boletos</div>
      </KpiCard>

      <KpiCard
        variant={resumo.resultado >= 0 ? "result" : "negative"}
        valueColor={resumo.resultado >= 0 ? "green" : "red"}
        label="Resultado do Mês"
        value={formatMoeda(resumo.resultado)}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      >
        <div className="kpi-sub">Entradas − saídas</div>
      </KpiCard>
    </div>
  );
}
