import FixosClient from "@/components/fixos/FixosClient";
import { getCustosFixos } from "@/lib/data/queries";
import { mesAtualLabel } from "@/lib/utils/formatData";

export default async function FixosPage() {
  const fixos = await getCustosFixos();
  return <FixosClient fixos={fixos} mesLabel={mesAtualLabel()} />;
}
