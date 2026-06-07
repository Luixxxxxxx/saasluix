import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o navegador (componentes "use client").
 * Usa apenas as chaves públicas (NEXT_PUBLIC_*). A service role key
 * NUNCA é usada aqui — ela jamais pode chegar ao navegador (checklist, item 1).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
