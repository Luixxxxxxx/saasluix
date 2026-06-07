import type { Boleto, StatusBoleto } from "@/types/boleto";
import { formatMoedaCheia } from "@/lib/utils/formatMoeda";
import { formatDataCurta } from "@/lib/utils/formatData";

const pillClass: Record<StatusBoleto, string> = {
  pago: "pill-pago",
  pendente: "pill-pend",
  urgente: "pill-alerta",
  vencido: "pill-venc",
};

const pillLabel: Record<StatusBoleto, string> = {
  pago: "PAGO",
  pendente: "PENDENTE",
  urgente: "URGENTE",
  vencido: "VENCIDO",
};

function itemModifier(status: StatusBoleto): string {
  if (status === "vencido") return " vencido";
  if (status === "urgente") return " alerta";
  return "";
}

function vencModifier(status: StatusBoleto): string {
  if (status === "vencido") return " vencido";
  if (status === "urgente") return " alerta";
  return "";
}

function vencimentoTexto(b: Boleto): string {
  const dataFmt = formatDataCurta(b.vencimento);
  if (b.status === "vencido") return `Venceu em ${dataFmt}`;
  if (b.status === "urgente") return `Vence em breve — ${dataFmt}`;
  return `Vence em ${dataFmt}`;
}

interface BoletoItemProps {
  boleto: Boleto;
  onToggle?: () => void;
  onExcluir?: () => void;
}

export default function BoletoItem({ boleto, onToggle, onExcluir }: BoletoItemProps) {
  return (
    <div className={`boleto-item${itemModifier(boleto.status)}`}>
      <div className="boleto-left">
        <div className="boleto-fornecedor">{boleto.fornecedor}</div>
        <div className={`boleto-venc${vencModifier(boleto.status)}`}>
          {vencimentoTexto(boleto)}
        </div>
      </div>
      <div className="boleto-right">
        <span className="boleto-val">{formatMoedaCheia(boleto.valor)}</span>
        <span className={`status-pill ${pillClass[boleto.status]}`}>
          {pillLabel[boleto.status]}
        </span>
        {(onToggle || onExcluir) && (
          <div className="row-actions">
            {onToggle && (
              <button className="mini-btn" onClick={onToggle}>
                {boleto.status === "pago" ? "Reabrir" : "Pagar"}
              </button>
            )}
            {onExcluir && (
              <button className="icon-btn danger" title="Excluir" onClick={onExcluir}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
