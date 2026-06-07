"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import Modal from "@/components/ui/Modal";
import FormFixo from "@/components/forms/FormFixo";
import { criarCustoFixo, alternarStatusFixo, excluirCustoFixo } from "@/lib/actions/custosFixos";
import { formatMoeda } from "@/lib/utils/formatMoeda";
import type { CustoFixo } from "@/types/custoFixo";

export default function FixosClient({
  fixos,
  mesLabel,
}: {
  fixos: CustoFixo[];
  mesLabel: string;
}) {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);

  async function adicionar(novo: Omit<CustoFixo, "id">) {
    await criarCustoFixo(novo);
    setModalAberto(false);
    router.refresh();
  }

  async function toggle(f: CustoFixo) {
    await alternarStatusFixo(f.id, f.status === "pago" ? "pendente" : "pago");
    router.refresh();
  }

  async function excluir(f: CustoFixo) {
    if (!confirm(`Excluir o custo fixo "${f.nome}"?`)) return;
    await excluirCustoFixo(f.id);
    router.refresh();
  }

  const total = fixos.reduce((acc, f) => acc + f.valor, 0);
  const pagos = fixos.filter((f) => f.status === "pago");
  const pendentes = fixos.filter((f) => f.status === "pendente");
  const totalPago = pagos.reduce((acc, f) => acc + f.valor, 0);
  const totalPendente = pendentes.reduce((acc, f) => acc + f.valor, 0);

  return (
    <>
      <Topbar
        title="Custos Fixos"
        subtitle={mesLabel}
        actions={
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            + Novo custo fixo
          </button>
        }
      />

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total mensal</div>
          <div className="stat-value white">{formatMoeda(total)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Já pago ({pagos.length})</div>
          <div className="stat-value green">{formatMoeda(totalPago)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendente ({pendentes.length})</div>
          <div className="stat-value amber">{formatMoeda(totalPendente)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Lista de custos fixos</div>
            <div className="card-sub">Clique no status para marcar como pago/pendente</div>
          </div>
        </div>

        {fixos.length === 0 ? (
          <div className="empty-state">Nenhum custo fixo cadastrado.</div>
        ) : (
          <div className="fixos-list">
            {fixos.map((f) => (
              <div key={f.id} className="fixo-item">
                <div>
                  <div className="fixo-name">{f.nome}</div>
                  <div className="fixo-due">Vence dia {f.diaVencimento}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="fixo-val">{formatMoeda(f.valor)}</span>
                  <button className={`toggle-badge ${f.status}`} onClick={() => toggle(f)}>
                    {f.status === "pago" ? "PAGO" : "PENDENTE"}
                  </button>
                  <button className="icon-btn danger" title="Excluir" onClick={() => excluir(f)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Custo Fixo"
        sub="Custo mensal recorrente"
      >
        <FormFixo onSalvar={adicionar} onCancelar={() => setModalAberto(false)} />
      </Modal>
    </>
  );
}
