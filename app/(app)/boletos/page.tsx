import BoletosClient from "@/components/boletos/BoletosClient";
import { getBoletos } from "@/lib/data/queries";

export default async function BoletosPage() {
  const lista = await getBoletos();
  return <BoletosClient lista={lista} />;
}
