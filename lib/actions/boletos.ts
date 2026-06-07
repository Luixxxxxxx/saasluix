"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRestauranteId } from "@/lib/supabase/restaurante";

export interface NovoBoleto {
  fornecedor: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "pago";
  obs?: string;
}

function hojeISO(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function criarBoleto(input: NovoBoleto) {
  const supabase = await createClient();
  const restauranteId = await getRestauranteId(supabase);
  if (!restauranteId) throw new Error("Restaurante não encontrado.");

  const { error } = await supabase.from("boletos").insert({
    restaurante_id: restauranteId,
    fornecedor: input.fornecedor,
    valor: input.valor,
    vencimento: input.vencimento,
    status: input.status,
    data_pagamento: input.status === "pago" ? hojeISO() : null,
    observacao: input.obs ?? null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/boletos");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
}

export async function alternarStatusBoleto(id: string, novoStatus: "pendente" | "pago") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("boletos")
    .update({
      status: novoStatus,
      data_pagamento: novoStatus === "pago" ? hojeISO() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/boletos");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
}

export async function excluirBoleto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("boletos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/boletos");
  revalidatePath("/dashboard");
  revalidatePath("/extrato");
}
