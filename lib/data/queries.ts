import { createClient } from "@/lib/supabase/server";
import { statusBoletoDisplay } from "@/lib/utils/dataAlerta";
import type { Boleto } from "@/types/boleto";
import type { CustoFixo } from "@/types/custoFixo";
import type { CategoriaCusto, CustoManual } from "@/types/custoManual";
import type { CategoriaReceita, ReceitaManual } from "@/types/receitaManual";
import type { Transacao } from "@/types/transacao";

export async function getCustosManuais(): Promise<CustoManual[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("custos_manuais")
    .select("*")
    .order("data", { ascending: false })
    .order("criado_em", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    data: r.data,
    valor: Number(r.valor),
    categoria: r.categoria as CategoriaCusto,
    obs: r.observacao ?? undefined,
  }));
}

export async function getReceitasManuais(): Promise<ReceitaManual[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("receitas_manuais")
    .select("*")
    .order("data", { ascending: false })
    .order("criado_em", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    data: r.data,
    valor: Number(r.valor),
    categoria: r.categoria as CategoriaReceita,
    obs: r.observacao ?? undefined,
  }));
}

export async function getCustosFixos(): Promise<CustoFixo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("custos_fixos")
    .select("*")
    .order("dia_vencimento", { ascending: true });

  return (data ?? []).map((r) => ({
    id: r.id,
    nome: r.nome,
    valor: Number(r.valor),
    diaVencimento: r.dia_vencimento,
    status: r.status as "pago" | "pendente",
  }));
}

export async function getBoletos(): Promise<Boleto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("boletos")
    .select("*")
    .order("vencimento", { ascending: true });

  return (data ?? []).map((r) => ({
    id: r.id,
    fornecedor: r.fornecedor,
    valor: Number(r.valor),
    vencimento: r.vencimento,
    dataPagamento: r.data_pagamento ?? undefined,
    status: statusBoletoDisplay(r.status, r.vencimento),
    obs: r.observacao ?? undefined,
  }));
}

export async function getTransacoes(): Promise<Transacao[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transacoes")
    .select("*")
    .order("data", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    data: r.data,
    descricao: r.descricao,
    tipo: r.tipo as "entrada" | "saida",
    origem: "Banco",
    valor: Number(r.valor),
    conta: r.conta_id ?? undefined,
  }));
}

export async function getSaldoContas(): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase.from("contas").select("saldo");
  return (data ?? []).reduce((acc, c) => acc + Number(c.saldo), 0);
}
