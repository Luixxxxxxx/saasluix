"use client";

import { useState } from "react";
import type { CustoFixo } from "@/types/custoFixo";

interface FormFixoProps {
  onSalvar: (fixo: Omit<CustoFixo, "id">) => void;
  onCancelar: () => void;
}

export default function FormFixo({ onSalvar, onCancelar }: FormFixoProps) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [status, setStatus] = useState<"pendente" | "pago">("pendente");

  function salvar() {
    const v = parseFloat(valor);
    const dia = parseInt(diaVencimento, 10);
    if (!nome.trim() || !v || v <= 0 || !dia || dia < 1 || dia > 31) return;
    onSalvar({ nome: nome.trim(), valor: v, diaVencimento: dia, status });
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">Nome</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Aluguel"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
          <label className="form-label">Dia de vencimento</label>
          <input
            type="number"
            className="form-input"
            placeholder="1–31"
            min={1}
            max={31}
            value={diaVencimento}
            onChange={(e) => setDiaVencimento(e.target.value)}
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
