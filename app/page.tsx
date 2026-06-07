import { redirect } from "next/navigation";

export default function Home() {
  // Sem auth ainda (mock). Quando o login existir, redireciona para /login
  // caso não esteja autenticado.
  redirect("/dashboard");
}
