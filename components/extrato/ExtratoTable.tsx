"use client";

import { useState } from "react";
import type { Transacao } from "@/types/transacao";
import { formatDataCurta } from "@/lib/utils/formatData";

type Filtro = "7 dias" | "30 dias" | "Este mês" | "Banco" | "Manual" | "Boleto";
const filtros: Filtro[] = ["7 dias", "30 dias", "Este mês", "Banco", "Manual", "Boleto"];

function aplicarFiltro(transacoes: Transacao[], filtro: Filtro): Transacao[] {
  if (filtro === "Banco") return transacoes.filter((t) => t.origem === "Banco");
  if (filtro === "Manual") return transacoes.filter((t) => t.origem === "Manual");
  if (filtro === "Boleto") return transacoes.filter((t) => t.origem === "Boleto");
  // filtros de período: no mock todos os dados já são recentes
  return transacoes;
}

export default function ExtratoTable({ transacoes }: { transacoes: Transacao[] }) {
  const [filtro, setFiltro] = useState<Filtro>("7 dias");
  const linhas = aplicarFiltro(transacoes, filtro);

  return (
    <div className="extrato-card">
      <div className="card-header">
        <div>
          <div className="card-title">Extrato</div>
          <div className="card-sub">Movimentações recentes</div>
        </div>
      </div>

      <div className="extrato-filters">
        {filtros.map((f) => (
          <button
            key={f}
            className={`filter-btn${filtro === f ? " active" : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <table className="extrato-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Origem</th>
            <th style={{ textAlign: "right" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((t) => (
            <tr key={t.id}>
              <td className="td-date">{formatDataCurta(t.data)}</td>
              <td className="td-desc">{t.descricao}</td>
              <td>
                <span className="td-origem">{t.origem}</span>
              </td>
              <td className={`td-val ${t.tipo === "entrada" ? "entrada" : "saida"}`}>
                {t.tipo === "entrada" ? "+ " : "− "}
                R$ {t.valor.toLocaleString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
