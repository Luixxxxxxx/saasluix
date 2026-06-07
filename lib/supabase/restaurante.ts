import type { SupabaseClient } from "@supabase/supabase-js";

interface RestauranteBasico {
  id: string;
  nome: string;
}

async function getRestauranteDoUsuario(
  supabase: SupabaseClient,
): Promise<RestauranteBasico | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("restaurantes")
    .select("id, nome")
    .eq("user_id", user.id)
    .maybeSingle();

  if (data) return data;

  const nome = (user.user_metadata?.nome as string) || "Meu Restaurante";
  const { data: novo, error } = await supabase
    .from("restaurantes")
    .insert({ user_id: user.id, nome })
    .select("id, nome")
    .single();

  if (error) return null;
  return novo;
}

export async function getRestauranteId(
  supabase: SupabaseClient,
): Promise<string | null> {
  const restaurante = await getRestauranteDoUsuario(supabase);
  return restaurante?.id ?? null;
}

export async function getRestauranteNome(
  supabase: SupabaseClient,
): Promise<string> {
  const restaurante = await getRestauranteDoUsuario(supabase);
  return restaurante?.nome ?? "Meu Restaurante";
}
