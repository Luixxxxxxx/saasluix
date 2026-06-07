"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRestauranteId } from "@/lib/supabase/restaurante";

export interface NovoCustoFixo {
  nome: string;
  valor: number;
  diaVencimento: number;
  status: "pago" | "pendente";
}

export async function criarCustoFixo(input: NovoCustoFixo) {
  const supabase = await createClient();
  const restauranteId = await getRestauranteId(supabase);
  if (!restauranteId) throw new Error("Restaurante não encontrado.");

  const { error } = await supabase.from("custos_fixos").insert({
    restaurante_id: restauranteId,
    nome: input.nome,
    valor: input.valor,
    dia_vencimento: input.diaVencimento,
    status: input.status,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/fixos");
  revalidatePath("/dashboard");
}

export async function alternarStatusFixo(id: string, novoStatus: "pago" | "pendente") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custos_fixos")
    .update({ status: novoStatus })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/fixos");
  revalidatePath("/dashboard");
}

export async function excluirCustoFixo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("custos_fixos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/fixos");
  revalidatePath("/dashboard");
}
