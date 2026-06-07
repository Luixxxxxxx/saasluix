import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para o servidor (Server Components, Route Handlers,
 * Server Actions). Lê/grava a sessão nos cookies. Usa a anon key — as
 * políticas de Row Level Security garantem o isolamento por restaurante.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component — ignorável; o middleware
            // (updateSession) é quem renova os cookies da sessão.
          }
        },
      },
    },
  );
}
