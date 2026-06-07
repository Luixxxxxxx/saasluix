"use client";

import { useState } from "react";
import type { Boleto } from "@/types/boleto";

interface FormBoletoProps {
  onSalvar: (boleto: Omit<Boleto, "id">) => void;
  onCancelar: () => void;
}

export default function FormBoleto({ onSalvar, onCancelar }: FormBoletoProps) {
  const [fornecedor, setFornecedor] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [status, setStatus] = useState<"pendente" | "pago">("pendente");
  const [obs, setObs] = useState("");

  function salvar() {
    const v = parseFloat(valor);
    if (!fornecedor.trim() || !v || v <= 0 || !vencimento) return;
    onSalvar({
      fornecedor: fornecedor.trim(),
      valor: v,
      vencimento,
      status,
      obs: obs.trim() || undefined,
    });
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">Fornecedor</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Coca-Cola Atacado"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Valor (R$)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Vencimento</label>
          <input
            type="date"
            className="form-input"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as "pendente" | "pago")}
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Observação (opcional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: pedido da semana..."
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onCancelar}>
          Cancelar
        </button>
        <button className="btn-save" onClick={salvar}>
          Salvar
        </button>
      </div>
    </>
  );
}
