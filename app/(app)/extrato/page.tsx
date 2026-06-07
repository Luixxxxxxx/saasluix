import Topbar from "@/components/layout/Topbar";
import ExtratoTable from "@/components/extrato/ExtratoTable";
import ExportExtratoActions from "@/components/extrato/ExportExtratoActions";
import {
  getBoletos,
  getCustosManuais,
  getReceitasManuais,
  getTransacoes,
} from "@/lib/data/queries";
import { mergeExtrato } from "@/lib/calculos/extrato";

export default async function ExtratoPage() {
  const [transacoes, custosManuais, receitasManuais, boletos] = await Promise.all([
    getTransacoes(),
    getCustosManuais(),
    getReceitasManuais(),
    getBoletos(),
  ]);
  const extrato = mergeExtrato(transacoes, custosManuais, receitasManuais, boletos);

  return (
    <>
      <Topbar
        title="Extrato"
        subtitle="Movimentações unificadas - banco, manuais e boletos"
        actions={<ExportExtratoActions transacoes={extrato} />}
      />
      <ExtratoTable transacoes={extrato} />
    </>
  );
}
