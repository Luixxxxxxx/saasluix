# Setup do Supabase (Auth + Banco)

Passo a passo para ligar o painel a um projeto Supabase real. Hoje o código
está pronto e roda com **placeholders** no `.env.local` — o login só funcionará
de verdade depois de preencher as chaves abaixo.

---

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie um projeto (anote a senha do banco).
2. Espere o provisionamento terminar (~2 min).

## 2. Rodar o schema do banco

1. No painel do Supabase, abra **SQL Editor**.
2. Cole e execute, **nesta ordem**:
   - `supabase/migrations/0001_init_schema.sql` (tabelas + índices + RLS + políticas)
   - `supabase/migrations/0002_handle_new_user.sql` (cria o restaurante no cadastro)
   - `supabase/migrations/0003_receitas_manuais.sql` (entradas lançadas à mão)

## 3. Pegar as chaves

No Supabase: **Project Settings → API**. Copie:

| Valor no painel Supabase | Variável no `.env.local` | Vai pro navegador? |
|--------------------------|--------------------------|--------------------|
| Project URL              | `NEXT_PUBLIC_SUPABASE_URL` | Sim (pública) |
| `anon` / `public` key    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim (pública) |
| `service_role` key       | `SUPABASE_SERVICE_ROLE_KEY` | **NUNCA** |

Cole no arquivo `.env.local` (já existe na raiz, com placeholders). Esse arquivo
é ignorado pelo Git e **não pode ser commitado** (checklist, item 1).

## 4. Configurar o Auth

Em **Authentication → Providers → Email**: deixe **Email** habilitado.

- **Para testar rápido em dev:** desligue "Confirm email" (em Authentication →
  Sign In / Providers). Assim o cadastro já entra direto.
- **Em produção:** mantenha a confirmação ligada. O retorno do e-mail cai em
  `/auth/callback`, que já está implementado.

Em **Authentication → URL Configuration**, adicione as **Redirect URLs**:
- `http://localhost:3000/auth/callback` (dev)
- `https://SEU-DOMINIO.vercel.app/auth/callback` (produção)

## 5. Rodar

```bash
npm run dev
```

Acesse http://localhost:3000 → você cai em `/login`. Crie uma conta (com o nome
do restaurante) e entre.

---

## Como provar os itens do checklist de segurança

### Item 3 e 6 — autenticação nas rotas / login pelo Supabase
- **Prova (já dá pra ver agora):** sem estar logado, acesse `/dashboard`. O
  sistema redireciona para `/login` em vez de mostrar dados. Proteção em duas
  camadas: `middleware.ts` + verificação no `app/(app)/layout.tsx`.
- Senhas: são geridas 100% pelo Supabase Auth. **Não** há sistema de senha
  próprio e nenhuma senha é gravada pelo app.

### Item 2 — isolamento entre restaurantes (RLS) — **falta testar**
O SQL **liga** o RLS. A prova é o teste:

1. Crie **dois** usuários (dois restaurantes) pelo `/login`.
2. Logado como o restaurante A, cadastre um custo manual.
3. No **SQL Editor** do Supabase, rode como o usuário B (ou via API com o token
   dele) um `select * from custos_manuais`. Deve retornar **só** as linhas do B —
   nunca as do A.
4. Teste rápido alternativo: no SQL Editor, rode
   `select * from custos_manuais;` usando o **anon** com um JWT de cada usuário e
   confirme que cada um vê apenas o seu.

> Enquanto esse teste não for feito e registrado, o item 2 **não está pronto** —
> "está ligado" não é prova.

### Item 1 — a chave-mestra (service role) não vaza
- `SUPABASE_SERVICE_ROLE_KEY` vive só no `.env.local` (dev) e nas **Environment
  Variables da Vercel** (produção). Nunca tem prefixo `NEXT_PUBLIC_`, então nunca
  é embutida no navegador. Nenhum arquivo `lib/supabase/client.ts` a usa.

### Item 5 — logs / rastro
- O campo `ultima_sync` em `contas` já registra a última sincronização.
- Logs de acesso/erro: ver no painel da Vercel (Runtime Logs) e no Supabase
  (Logs). Auditoria mais fina (quem alterou o quê) é evolução futura.

### Item 4 — credenciais Open Finance
- **Não se aplica.** A integração Open Finance foi removida do projeto. As
  transações são lançadas manualmente (entradas e saídas). Caso volte a integrar
  bancos no futuro, este item volta a valer.

---

## Deploy na Vercel (resumo)

1. Suba o repositório para o GitHub (sem `.env.local`).
2. Importe na Vercel.
3. Em **Settings → Environment Variables**, recrie as 3 variáveis do Supabase.
4. Atualize as Redirect URLs do Supabase com o domínio da Vercel.
