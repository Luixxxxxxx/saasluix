"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRestauranteId } from "@/lib/supabase/restaurante";

export interface NovaReceitaManual {
  data: string;
  valor: number;
  categoria: string;
  obs?: string;
}

export async function criarReceitaManual(input: NovaReceitaManual) {
  const supabase = await createClient();
  const restauranteId = await getRestauranteId(supabase);
  if (!restauranteId) throw new Error("Restaurante não encontrado.");

  const { error } = await supabase.from("receitas_manuais").insert({
    restaurante_id: restauranteId,
    data: input.data,
    valor: input.valor,
    categoria: input.categoria,
    observacao: input.obs ?? null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/registro");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
}

export async function excluirReceitaManual(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("receitas_manuais").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/registro");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
}
