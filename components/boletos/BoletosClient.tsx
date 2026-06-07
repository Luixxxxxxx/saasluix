"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import BoletoList from "@/components/boletos/BoletoList";
import Modal from "@/components/ui/Modal";
import FormBoleto from "@/components/forms/FormBoleto";
import { criarBoleto, alternarStatusBoleto, excluirBoleto } from "@/lib/actions/boletos";
import { formatMoeda } from "@/lib/utils/formatMoeda";
import type { Boleto } from "@/types/boleto";

export default function BoletosClient({ lista }: { lista: Boleto[] }) {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);

  async function adicionar(novo: Omit<Boleto, "id">) {
    await criarBoleto({
      fornecedor: novo.fornecedor,
      valor: novo.valor,
      vencimento: novo.vencimento,
      status: novo.status === "pago" ? "pago" : "pendente",
      obs: novo.obs,
    });
    setModalAberto(false);
    router.refresh();
  }

  async function toggle(b: Boleto) {
    await alternarStatusBoleto(b.id, b.status === "pago" ? "pendente" : "pago");
    router.refresh();
  }

  async function excluir(b: Boleto) {
    if (!confirm(`Excluir o boleto de ${b.fornecedor}?`)) return;
    await excluirBoleto(b.id);
    router.refresh();
  }

  const aPagar = lista.filter((b) => b.status !== "pago");
  const totalAPagar = aPagar.reduce((acc, b) => acc + b.valor, 0);
  const vencidos = lista.filter((b) => b.status === "vencido");
  const urgentes = lista.filter((b) => b.status === "urgente");

  return (
    <>
      <Topbar
        title="Boletos"
        subtitle="Agenda de pagamentos"
        actions={
          <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
            + Novo boleto
          </button>
        }
      />

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">A pagar ({aPagar.length})</div>
          <div className="stat-value white">{formatMoeda(totalAPagar)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vencidos</div>
          <div className="stat-value red">{vencidos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Urgentes (até 3 dias)</div>
          <div className="stat-value amber">{urgentes.length}</div>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="boletos-card">
          <div className="card-header">
            <div>
              <div className="card-title">Boletos</div>
              <div className="card-sub">Agenda de pagamentos</div>
            </div>
            <button className="btn" onClick={() => setModalAberto(true)}>
              + Novo
            </button>
          </div>
          <div className="empty-state">Nenhum boleto cadastrado.</div>
        </div>
      ) : (
        <BoletoList
          boletos={lista}
          onNovo={() => setModalAberto(true)}
          onToggle={toggle}
          onExcluir={excluir}
        />
      )}

      <Modal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Boleto"
        sub="Cadastrar boleto a pagar"
      >
        <FormBoleto onSalvar={adicionar} onCancelar={() => setModalAberto(false)} />
      </Modal>
    </>
  );
}
