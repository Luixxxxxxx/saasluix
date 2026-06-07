import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o navegador (componentes "use client").
 * Usa apenas as chaves públicas (NEXT_PUBLIC_*). A service role key
 * NUNCA é usada aqui — ela jamais pode chegar ao navegador (checklist, item 1).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variaveis publicas do Supabase nao configuradas.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
