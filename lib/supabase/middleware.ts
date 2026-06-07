import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rotas que NÃO exigem login. */
const ROTAS_PUBLICAS = ["/login", "/auth"];

function ehRotaPublica(pathname: string): boolean {
  return ROTAS_PUBLICAS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Renova a sessão a cada request e protege as rotas privadas.
 * Sem usuário logado, qualquer rota não-pública é redirecionada para /login
 * (checklist, item 3: toda tela protegida checa quem está entrando).
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (ehRotaPublica(pathname)) {
      return NextResponse.next({ request });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "config");
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: getUser() revalida o token no servidor (não confie só no cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Não logado tentando acessar rota privada → manda para /login
  if (!user && !ehRotaPublica(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Já logado tentando ver /login → manda para o dashboard
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
