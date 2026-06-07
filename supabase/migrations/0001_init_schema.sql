-- ========================================
-- TABELA: restaurantes
-- ========================================
create table restaurantes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  criado_em timestamptz not null default now()
);

create index idx_restaurantes_user on restaurantes(user_id);

-- ========================================
-- TABELA: contas
-- ========================================
create table contas (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  banco text not null,
  tipo text not null default 'PJ',
  saldo numeric(12,2) not null default 0,
  consentimento_id text,
  consentimento_ate timestamptz,
  ultima_sync timestamptz,
  criado_em timestamptz not null default now()
);

create index idx_contas_restaurante on contas(restaurante_id);

-- ========================================
-- TABELA: transacoes
-- ========================================
create table transacoes (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  conta_id uuid not null references contas(id) on delete cascade,
  data date not null,
  descricao text not null,
  tipo text not null check (tipo in ('entrada', 'saida')),
  valor numeric(12,2) not null check (valor >= 0),
  id_externo text,
  criado_em timestamptz not null default now(),
  -- evita gravar a mesma transação do banco duas vezes
  unique (conta_id, id_externo)
);

create index idx_transacoes_restaurante on transacoes(restaurante_id);
create index idx_transacoes_data on transacoes(restaurante_id, data);

-- ========================================
-- TABELA: custos_manuais
-- ========================================
create table custos_manuais (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  data date not null,
  valor numeric(12,2) not null check (valor >= 0),
  categoria text not null check (categoria in ('Hortifruti','Mercado','Gás','Manutenção','Outros')),
  observacao text,
  criado_em timestamptz not null default now()
);

create index idx_custos_manuais_restaurante on custos_manuais(restaurante_id);
create index idx_custos_manuais_data on custos_manuais(restaurante_id, data);

-- ========================================
-- TABELA: custos_fixos
-- ========================================
create table custos_fixos (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  nome text not null,
  valor numeric(12,2) not null check (valor >= 0),
  dia_vencimento int not null check (dia_vencimento between 1 and 31),
  status text not null default 'pendente' check (status in ('pago','pendente')),
  criado_em timestamptz not null default now()
);

create index idx_custos_fixos_restaurante on custos_fixos(restaurante_id);

-- ========================================
-- TABELA: boletos
-- ========================================
create table boletos (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  fornecedor text not null,
  valor numeric(12,2) not null check (valor >= 0),
  vencimento date not null,
  status text not null default 'pendente' check (status in ('pendente','pago')),
  observacao text,
  criado_em timestamptz not null default now()
);

create index idx_boletos_restaurante on boletos(restaurante_id);
create index idx_boletos_vencimento on boletos(restaurante_id, vencimento);

-- ========================================
-- SEGURANÇA: Row Level Security
-- ========================================
-- Liga o RLS em todas as tabelas
alter table restaurantes   enable row level security;
alter table contas         enable row level security;
alter table transacoes     enable row level security;
alter table custos_manuais enable row level security;
alter table custos_fixos   enable row level security;
alter table boletos        enable row level security;

-- restaurantes: o dono só vê o próprio restaurante
create policy "dono ve seu restaurante"
  on restaurantes for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Função auxiliar: retorna os IDs de restaurante do usuário logado
create or replace function restaurantes_do_usuario()
returns setof uuid
language sql security definer stable
as $$
  select id from restaurantes where user_id = auth.uid()
$$;

-- contas: só vê as do próprio restaurante
create policy "dono ve suas contas"
  on contas for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));

-- transacoes
create policy "dono ve suas transacoes"
  on transacoes for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));

-- custos_manuais
create policy "dono ve seus custos manuais"
  on custos_manuais for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));

-- custos_fixos
create policy "dono ve seus custos fixos"
  on custos_fixos for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));

-- boletos
create policy "dono ve seus boletos"
  on boletos for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));
