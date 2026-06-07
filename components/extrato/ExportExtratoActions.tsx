"use client";

import { useState } from "react";
import type { Transacao } from "@/types/transacao";

interface ExportExtratoActionsProps {
  transacoes: Transacao[];
}

function dataArquivo(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatData(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function valorAssinado(t: Transacao): number {
  return t.tipo === "entrada" ? t.valor : -t.valor;
}

function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function csvCampo(valor: string | number): string {
  const texto = String(valor).replaceAll('"', '""');
  return `"${texto}"`;
}

function baixarArquivo(nome: string, conteudo: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resumo(transacoes: Transacao[]) {
  const entradas = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);
  const saidas = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + t.valor, 0);

  return {
    entradas,
    saidas,
    resultado: entradas - saidas,
  };
}

export default function ExportExtratoActions({ transacoes }: ExportExtratoActionsProps) {
  const [gerando, setGerando] = useState<"pdf" | "planilha" | null>(null);

  function criarPlanilha() {
    if (transacoes.length === 0) {
      alert("Nao ha movimentacoes para exportar.");
      return;
    }

    setGerando("planilha");
    try {
      const linhas = [
        ["Data", "Descricao", "Origem", "Tipo", "Valor"].map(csvCampo).join(";"),
        ...transacoes.map((t) =>
          [
            formatData(t.data),
            t.descricao,
            t.origem,
            t.tipo === "entrada" ? "Entrada" : "Saida",
            valorAssinado(t).toFixed(2).replace(".", ","),
          ]
            .map(csvCampo)
            .join(";"),
        ),
      ];

      baixarArquivo(
        `extrato-${dataArquivo()}.csv`,
        `\uFEFF${linhas.join("\r\n")}`,
        "text/csv;charset=utf-8",
      );
    } finally {
      setGerando(null);
    }
  }

  async function criarPdf() {
    if (transacoes.length === 0) {
      alert("Nao ha movimentacoes para exportar.");
      return;
    }

    setGerando("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 36;
      const lineHeight = 16;
      const col = {
        data: margin,
        descricao: margin + 78,
        origem: margin + 382,
        tipo: margin + 472,
        valor: pageWidth - margin,
      };
      const totais = resumo(transacoes);
      let y = 44;

      function cabecalho() {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Extrato Financeiro", margin, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Gerado em ${formatData(dataArquivo())}`, margin, y + 18);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`Entradas: ${formatMoeda(totais.entradas)}`, margin, y + 42);
        doc.text(`Saidas: ${formatMoeda(totais.saidas)}`, margin + 180, y + 42);
        doc.text(`Resultado: ${formatMoeda(totais.resultado)}`, margin + 340, y + 42);

        y += 72;
        doc.setDrawColor(210);
        doc.line(margin, y - 18, pageWidth - margin, y - 18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Data", col.data, y);
        doc.text("Descricao", col.descricao, y);
        doc.text("Origem", col.origem, y);
        doc.text("Tipo", col.tipo, y);
        doc.text("Valor", col.valor, y, { align: "right" });
        y += 10;
        doc.line(margin, y, pageWidth - margin, y);
        y += 16;
      }

      cabecalho();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      for (const t of transacoes) {
        const descricao = doc.splitTextToSize(t.descricao, 290) as string[];
        const rowHeight = Math.max(lineHeight, descricao.length * 11 + 4);

        if (y + rowHeight > pageHeight - margin) {
          doc.addPage();
          y = 44;
          cabecalho();
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
        }

        doc.text(formatData(t.data), col.data, y);
        doc.text(descricao, col.descricao, y);
        doc.text(t.origem, col.origem, y);
        doc.text(t.tipo === "entrada" ? "Entrada" : "Saida", col.tipo, y);
        doc.text(formatMoeda(valorAssinado(t)), col.valor, y, { align: "right" });
        y += rowHeight;
      }

      doc.save(`extrato-${dataArquivo()}.pdf`);
    } finally {
      setGerando(null);
    }
  }

  return (
    <>
      <button className="btn" type="button" onClick={criarPdf} disabled={gerando !== null}>
        {gerando === "pdf" ? "Gerando..." : "Criar PDF"}
      </button>
      <button
        className="btn btn-primary"
        type="button"
        onClick={criarPlanilha}
        disabled={gerando !== null}
      >
        {gerando === "planilha" ? "Gerando..." : "Criar Planilha"}
      </button>
    </>
  );
}
