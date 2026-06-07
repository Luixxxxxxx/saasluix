import Link from "next/link";
import type { Boleto } from "@/types/boleto";
import BoletoItem from "./BoletoItem";

interface BoletoListProps {
  boletos: Boleto[];
  /** Se passado, o botão "+ Novo" chama isto; senão, leva para /boletos. */
  onNovo?: () => void;
  onToggle?: (b: Boleto) => void;
  onExcluir?: (b: Boleto) => void;
}

export default function BoletoList({ boletos, onNovo, onToggle, onExcluir }: BoletoListProps) {
  return (
    <div className="boletos-card">
      <div className="card-header">
        <div>
          <div className="card-title">Boletos</div>
          <div className="card-sub">Agenda de pagamentos</div>
        </div>
        {onNovo ? (
          <button className="btn" onClick={onNovo}>
            + Novo
          </button>
        ) : (
          <Link href="/boletos" className="btn">
            + Novo
          </Link>
        )}
      </div>
      <div className="boleto-list">
        {boletos.map((b) => (
          <BoletoItem
            key={b.id}
            boleto={b}
            onToggle={onToggle ? () => onToggle(b) : undefined}
            onExcluir={onExcluir ? () => onExcluir(b) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
