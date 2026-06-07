import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { getRestauranteNome } from "@/lib/supabase/restaurante";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defesa em profundidade: além do middleware, cada tela protegida confirma
  // a sessão no servidor antes de renderizar (checklist, item 3).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const restauranteNome = await getRestauranteNome(supabase);

  return (
    <>
      <Sidebar restauranteNome={restauranteNome} />
      <main className="main">{children}</main>
    </>
  );
}
