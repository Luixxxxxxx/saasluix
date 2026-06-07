"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SemanaGrafico } from "@/lib/calculos/semanas";

const GREEN = "#22c98e";
const RED = "#e05555";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1a1e1e",
        border: "1px solid #2e3535",
        borderRadius: 6,
        padding: "8px 10px",
        fontFamily: "var(--mono)",
      }}
    >
      <div style={{ color: "#6b7878", fontSize: 10, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: "#e8edec", fontSize: 12 }}>
          {p.name}: R$ {p.value.toLocaleString("pt-BR")}
        </div>
      ))}
    </div>
  );
}

export default function ChartEntradasSaidas({ data }: { data: SemanaGrafico[] }) {
  // O ResponsiveContainer precisa medir o DOM; só renderiza após montar no cliente
  // (evita o aviso de dimensões durante o prerender estático).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="chart-wrap">
      {mounted && (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barGap={4}>
          <CartesianGrid stroke="#1a1e1e" vertical={false} />
          <XAxis
            dataKey="semana"
            tick={{ fill: "#6b7878", fontFamily: "var(--mono)", fontSize: 10 }}
            axisLine={{ stroke: "#242929" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7878", fontFamily: "var(--mono)", fontSize: 10 }}
            axisLine={{ stroke: "#242929" }}
            tickLine={false}
            tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="entradas"
            name="Entradas"
            fill="rgba(34,201,142,0.25)"
            stroke={GREEN}
            strokeWidth={1.5}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="saidas"
            name="Saídas"
            fill="rgba(224,85,85,0.2)"
            stroke={RED}
            strokeWidth={1.5}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
