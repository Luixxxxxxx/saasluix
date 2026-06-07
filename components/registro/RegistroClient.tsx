"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import { criarCustoManual, excluirCustoManual } from "@/lib/actions/custosManuais";
import { criarReceitaManual, excluirReceitaManual } from "@/lib/actions/receitasManuais";
import { formatMoeda } from "@/lib/utils/formatMoeda";
import { formatDataCurta } from "@/lib/utils/formatData";
import type { LancamentoManual } from "@/types/lancamentoManual";

type Tipo = "entrada" | "saida";

const categoriasSaida = ["Hortifruti", "Mercado", "Gás", "Manutenção", "Outros"];
const categoriasEntrada = ["Vendas", "Cartão", "Dinheiro", "Delivery", "Outros"];

export default function RegistroClient({ lancamentos }: { lancamentos: LancamentoManual[] }) {
  const router = useRouter();
  const hoje = new Date().toISOString().split("T")[0];

  const [tipo, setTipo] = useState<Tipo>("saida");
  const [data, setData] = useState(hoje);
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(categoriasSaida[0]);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const categorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  function trocarTipo(novo: Tipo) {
    setTipo(novo);
    setCategoria(novo === "entrada" ? categoriasEntrada[0] : categoriasSaida[0]);
  }

  async function salvar() {
    const v = parseFloat(valor);
    if (!v || v <= 0) return;
    setSalvando(true);
    setErro(null);
    try {
      const payload = { data, valor: v, categoria, obs: obs.trim() || undefined };
      if (tipo === "entrada") await criarReceitaManual(payload);
      else await criarCustoManual(payload);
      setValor("");
      setObs("");
      router.refresh();
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(l: LancamentoManual) {
    if (!confirm(`Excluir este lançamento de ${l.categoria}?`)) return;
    if (l.tipo === "entrada") await excluirReceitaManual(l.id);
    else await excluirCustoManual(l.id);
    router.refresh();
  }

  const totalEntradas = lancamentos
    .filter((l) => l.tipo === "entrada")
    .reduce((acc, l) => acc + l.valor, 0);
  const totalSaidas = lancamentos
    .filter((l) => l.tipo === "saida")
    .reduce((acc, l) => acc + l.valor, 0);

  return (
    <>
      <Topbar title="Registro Manual" subtitle="Lance entradas (vendas) e saídas (custos) do dia a dia" />

      <div className="page-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Novo Lançamento</div>
              <div className="card-sub">Entrada ou saída</div>
            </div>
          </div>

          {erro && <div className="auth-error">{erro}</div>}

          <div className="extrato-filters" style={{ marginTop: 0 }}>
            <button
              className={`filter-btn${tipo === "saida" ? " active" : ""}`}
              onClick={() => trocarTipo("saida")}
            >
              Saída
            </button>
            <button
              className={`filter-btn${tipo === "entrada" ? " active" : ""}`}
              onClick={() => trocarTipo("entrada")}
            >
              Entrada
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-input"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
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
          </div>

          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observação (opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder={tipo === "entrada" ? "Ex: vendas do almoço..." : "Ex: feiras da semana..."}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button className="btn-save" onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar lançamento"}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Lançamentos do mês</div>
              <div className="card-sub">
                {lancamentos.length} registros · entradas {formatMoeda(totalEntradas)} · saídas{" "}
                {formatMoeda(totalSaidas)}
              </div>
            </div>
          </div>

          {lancamentos.length === 0 ? (
            <div className="empty-state">Nenhum lançamento ainda.</div>
          ) : (
            <table className="extrato-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Categoria</th>
                  <th>Observação</th>
                  <th style={{ textAlign: "right" }}>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map((l) => (
                  <tr key={`${l.tipo}-${l.id}`}>
                    <td className="td-date">{formatDataCurta(l.data)}</td>
                    <td className="td-desc">{l.categoria}</td>
                    <td style={{ color: "var(--muted)" }}>{l.obs ?? "—"}</td>
                    <td className={`td-val ${l.tipo === "entrada" ? "entrada" : "saida"}`}>
                      {l.tipo === "entrada" ? "+ " : "− "}
                      {formatMoeda(l.valor)}
                    </td>
                    <td style={{ width: 1, paddingLeft: 12 }}>
                      <button className="icon-btn danger" title="Excluir" onClick={() => excluir(l)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
