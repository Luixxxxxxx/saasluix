"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Modo = "entrar" | "cadastrar";

export default function LoginPage() {
  const router = useRouter();

  const [modo, setModo] = useState<Modo>("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function cadastrar() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
    if (error) {
      setErro(error.message);
      return;
    }
    // Se o projeto exigir confirmação de e-mail, não há sessão imediata.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo("Conta criada! Confirme o e-mail enviado para entrar.");
      setModo("entrar");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setInfo(null);
    setCarregando(true);
    try {
      if (modo === "entrar") await entrar();
      else await cadastrar();
    } catch {
      setErro("Não foi possível conectar. Verifique a configuração do Supabase.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Painel Financeiro</div>
        <div className="auth-logo-sub">Restaurantes</div>

        <div className="auth-title">
          {modo === "entrar" ? "Entrar" : "Criar conta"}
        </div>
        <div className="auth-sub">
          {modo === "entrar"
            ? "Acesse o painel do seu restaurante"
            : "Cadastre seu restaurante"}
        </div>

        {erro && <div className="auth-error">{erro}</div>}
        {info && <div className="auth-info">{info}</div>}

        <form onSubmit={onSubmit}>
          {modo === "cadastrar" && (
            <div className="form-group">
              <label className="form-label">Nome do restaurante</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Restaurante Central"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              placeholder="voce@restaurante.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={carregando}>
            {carregando
              ? "Aguarde..."
              : modo === "entrar"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <div className="auth-switch">
          {modo === "entrar" ? (
            <>
              Ainda não tem conta?
              <button onClick={() => { setModo("cadastrar"); setErro(null); setInfo(null); }}>
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?
              <button onClick={() => { setModo("entrar"); setErro(null); setInfo(null); }}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
