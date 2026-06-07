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
      const margin = 34;
      const colors = {
        bg: [13, 15, 15] as const,
        surface: [20, 23, 23] as const,
        surface2: [26, 30, 30] as const,
        border: [46, 53, 53] as const,
        text: [232, 237, 236] as const,
        muted: [107, 120, 120] as const,
        muted2: [150, 164, 164] as const,
        green: [34, 201, 142] as const,
        greenBg: [13, 46, 32] as const,
        red: [224, 85, 85] as const,
        redBg: [46, 18, 18] as const,
      };
      const col = {
        data: margin + 18,
        descricao: margin + 96,
        origem: margin + 414,
        tipo: margin + 508,
        valor: pageWidth - margin - 18,
      };
      const totais = resumo(transacoes);
      const tableLeft = margin;
      const tableWidth = pageWidth - margin * 2;
      const footerY = pageHeight - 24;
      let y = 0;
      let pagina = 1;

      function setText(color: readonly [number, number, number]) {
        doc.setTextColor(color[0], color[1], color[2]);
      }

      function setFill(color: readonly [number, number, number]) {
        doc.setFillColor(color[0], color[1], color[2]);
      }

      function setStroke(color: readonly [number, number, number]) {
        doc.setDrawColor(color[0], color[1], color[2]);
      }

      function desenharFundo() {
        setFill(colors.bg);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        setFill(colors.green);
        doc.rect(0, 0, 8, pageHeight, "F");
      }

      function desenharCard(x: number, yCard: number, w: number, h: number) {
        setFill(colors.surface);
        setStroke(colors.border);
        doc.roundedRect(x, yCard, w, h, 8, 8, "FD");
      }

      function desenharResumoCard(
        x: number,
        label: string,
        valor: number,
        cor: readonly [number, number, number],
      ) {
        desenharCard(x, 92, 172, 58);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(colors.muted);
        doc.text(label.toUpperCase(), x + 16, 114);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        setText(cor);
        doc.text(formatMoeda(valor), x + 16, 137);
      }

      function rodape() {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(colors.muted);
        doc.text(`Pagina ${pagina}`, pageWidth - margin, footerY, { align: "right" });
        doc.text("Painel Financeiro", margin, footerY);
      }

      function cabecalho() {
        desenharFundo();

        setFill(colors.surface);
        doc.roundedRect(margin, 30, tableWidth, 132, 10, 10, "F");
        setStroke(colors.border);
        doc.roundedRect(margin, 30, tableWidth, 132, 10, 10, "S");

        setFill(colors.greenBg);
        doc.circle(margin + 32, 62, 15, "F");
        setText(colors.green);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("R$", margin + 32, 67, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        setText(colors.text);
        doc.text("Extrato Financeiro", margin + 58, 58);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setText(colors.muted2);
        doc.text(`Gerado em ${formatData(dataArquivo())}`, margin + 58, 76);
        doc.text(`${transacoes.length} movimentacoes exportadas`, pageWidth - margin - 18, 58, {
          align: "right",
        });

        desenharResumoCard(margin + 18, "Entradas", totais.entradas, colors.green);
        desenharResumoCard(margin + 208, "Saidas", totais.saidas, colors.red);
        desenharResumoCard(
          margin + 398,
          "Resultado",
          totais.resultado,
          totais.resultado >= 0 ? colors.green : colors.red,
        );

        y = 198;
        setFill(colors.surface2);
        setStroke(colors.border);
        doc.roundedRect(tableLeft, y - 24, tableWidth, 32, 7, 7, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setText(colors.muted2);
        doc.text("Data", col.data, y);
        doc.text("Descricao", col.descricao, y);
        doc.text("Origem", col.origem, y);
        doc.text("Tipo", col.tipo, y);
        doc.text("Valor", col.valor, y, { align: "right" });
        y += 24;

        rodape();
      }

      cabecalho();

      transacoes.forEach((t, index) => {
        const descricao = doc.splitTextToSize(t.descricao, 292) as string[];
        const rowHeight = Math.max(30, descricao.length * 11 + 16);

        if (y + rowHeight > footerY - 12) {
          doc.addPage();
          pagina += 1;
          cabecalho();
        }

        setFill(index % 2 === 0 ? colors.surface : colors.surface2);
        doc.roundedRect(tableLeft, y - 18, tableWidth, rowHeight, 6, 6, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        setText(colors.muted2);
        doc.text(formatData(t.data), col.data, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setText(colors.text);
        doc.text(descricao, col.descricao, y);

        const origemWidth = doc.getTextWidth(t.origem) + 16;
        setFill(colors.bg);
        setStroke(colors.border);
        doc.roundedRect(col.origem - 4, y - 14, origemWidth, 18, 6, 6, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(colors.muted2);
        doc.text(t.origem, col.origem + 4, y - 1);

        const tipoTexto = t.tipo === "entrada" ? "Entrada" : "Saida";
        const tipoCor = t.tipo === "entrada" ? colors.green : colors.red;
        const tipoBg = t.tipo === "entrada" ? colors.greenBg : colors.redBg;
        setFill(tipoBg);
        doc.roundedRect(col.tipo - 5, y - 14, 58, 18, 6, 6, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setText(tipoCor);
        doc.text(tipoTexto, col.tipo + 24, y - 1, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setText(tipoCor);
        doc.text(formatMoeda(valorAssinado(t)), col.valor, y, { align: "right" });

        y += rowHeight + 4;
      });

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
