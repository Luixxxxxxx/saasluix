"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { criarCustoManual } from "@/lib/actions/custosManuais";
import { criarReceitaManual } from "@/lib/actions/receitasManuais";

type Tipo = "entrada" | "saida";

const categoriasSaida = ["Hortifruti", "Mercado", "Gás", "Manutenção", "Outros"];
const categoriasEntrada = ["Vendas", "Cartão", "Dinheiro", "Delivery", "Outros"];

const Ctx = createContext<{ abrir: () => void } | null>(null);

/** Permite que qualquer botão (topbar, etc.) abra o modal de lançamento. */
export function useRegistroCusto() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useRegistroCusto deve ser usado dentro de <ModalCustoManualProvider>");
  }
  return ctx;
}

/**
 * Provê o modal de lançamento manual (entrada/saída) + o botão flutuante (FAB).
 */
export function ModalCustoManualProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hoje = new Date().toISOString().split("T")[0];

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<Tipo>("saida");
  const [data, setData] = useState(hoje);
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(categoriasSaida[0]);
  const [obs, setObs] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const categorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  function abrir() {
    setTipo("saida");
    setData(hoje);
    setValor("");
    setObs("");
    setCategoria(categoriasSaida[0]);
    setErro(null);
    setOpen(true);
  }

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
      setOpen(false);
      router.refresh();
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Ctx.Provider value={{ abrir }}>
      {children}

      <button className="fab" title="Novo lançamento" onClick={abrir}>
        +
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo Lançamento"
        sub="Entrada (venda) ou saída (custo)"
      >
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
            placeholder="Ex: vendas do almoço / feiras da semana..."
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setOpen(false)}>
            Cancelar
          </button>
          <button className="btn-save" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </Modal>
    </Ctx.Provider>
  );
}
