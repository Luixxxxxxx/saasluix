import type { CustoFixo } from "@/types/custoFixo";
import { formatMoeda } from "@/lib/utils/formatMoeda";

export default function FixosCard({
  fixos,
  mesLabel,
}: {
  fixos: CustoFixo[];
  mesLabel: string;
}) {
  const total = fixos.reduce((acc, f) => acc + f.valor, 0);
  const pagos = fixos.filter((f) => f.status === "pago");
  const pendentes = fixos.filter((f) => f.status === "pendente");
  const pctPagos = fixos.length ? Math.round((pagos.length / fixos.length) * 100) : 0;

  return (
    <div className="fixos-card">
      <div className="card-header">
        <div>
          <div className="card-title">Custos Fixos</div>
          <div className="card-sub">{mesLabel}</div>
        </div>
      </div>

      <div className="fixos-total">{formatMoeda(total)}</div>

      <div className="fixos-progress">
        <div className="fixos-bar-bg">
          <div className="fixos-bar-fill" style={{ width: `${pctPagos}%` }} />
        </div>
        <div className="fixos-counts">
          <span className="paid">{pagos.length} pagos</span>
          <span className="pend">{pendentes.length} pendentes</span>
        </div>
      </div>

      <div className="fixos-list">
        {fixos.map((f) => (
          <div key={f.id} className="fixo-item">
            <div>
              <div className="fixo-name">{f.nome}</div>
              <div className="fixo-due">Vence dia {f.diaVencimento}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="fixo-val">{formatMoeda(f.valor)}</span>
              <span className={`fixo-badge ${f.status}`}>
                {f.status === "pago" ? "PAGO" : "PENDENTE"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
