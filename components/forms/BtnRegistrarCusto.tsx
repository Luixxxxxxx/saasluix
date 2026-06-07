"use client";

import { useRegistroCusto } from "./ModalCustoManual";

/** Botão "+ Lançar" da topbar — abre o modal de lançamento compartilhado. */
export default function BtnRegistrarCusto() {
  const { abrir } = useRegistroCusto();
  return (
    <button className="btn btn-primary" onClick={abrir}>
      + Lançar
    </button>
  );
}
