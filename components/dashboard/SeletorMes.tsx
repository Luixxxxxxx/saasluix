"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { mesAtualYM, mesLabelDe, mesesRecentes } from "@/lib/utils/formatData";

/**
 * Seletor de mês. Lê/escreve o mês selecionado no parâmetro `?mes=YYYY-MM`
 * da URL; o dashboard (Server Component) recalcula os números a partir disso.
 */
export default function SeletorMes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [aberto, setAberto] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const opcoes = mesesRecentes(12);
  const atual = searchParams.get("mes") ?? mesAtualYM();

  useEffect(() => {
    function onClickFora(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, []);

  function selecionar(ym: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", ym);
    router.push(`${pathname}?${params.toString()}`);
    setAberto(false);
  }

  return (
    <div className="dropdown-wrap" ref={wrapRef}>
      <button className="btn" onClick={() => setAberto((a) => !a)}>
        {mesLabelDe(atual)} ▾
      </button>
      {aberto && (
        <div className="dropdown-menu">
          {opcoes.map((o) => (
            <button
              key={o.ym}
              className={`dropdown-item${o.ym === atual ? " active" : ""}`}
              onClick={() => selecionar(o.ym)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
