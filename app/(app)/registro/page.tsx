import RegistroClient from "@/components/registro/RegistroClient";
import { getCustosManuais, getReceitasManuais } from "@/lib/data/queries";
import type { LancamentoManual } from "@/types/lancamentoManual";

export default async function RegistroPage() {
  const [custos, receitas] = await Promise.all([
    getCustosManuais(),
    getReceitasManuais(),
  ]);

  const lancamentos: LancamentoManual[] = [
    ...custos.map((c) => ({
      id: c.id,
      tipo: "saida" as const,
      data: c.data,
      categoria: c.categoria,
      obs: c.obs,
      valor: c.valor,
    })),
    ...receitas.map((r) => ({
      id: r.id,
      tipo: "entrada" as const,
      data: r.data,
      categoria: r.categoria,
      obs: r.obs,
      valor: r.valor,
    })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  return <RegistroClient lancamentos={lancamentos} />;
}
