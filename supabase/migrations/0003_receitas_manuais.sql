-- ========================================
-- TABELA: receitas_manuais (entradas lançadas à mão)
-- ========================================
-- Espelha custos_manuais, mas para ENTRADAS (ex.: vendas do dia, cartão,
-- dinheiro, delivery). Permite ter entradas/saídas/resultado reais sem banco.

create table receitas_manuais (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references restaurantes(id) on delete cascade,
  data date not null,
  valor numeric(12,2) not null check (valor >= 0),
  categoria text not null check (categoria in ('Vendas','Cartão','Dinheiro','Delivery','Outros')),
  observacao text,
  criado_em timestamptz not null default now()
);

create index idx_receitas_manuais_restaurante on receitas_manuais(restaurante_id);
create index idx_receitas_manuais_data on receitas_manuais(restaurante_id, data);

-- Segurança: mesmo isolamento por restaurante das demais tabelas
alter table receitas_manuais enable row level security;

create policy "dono ve suas receitas manuais"
  on receitas_manuais for all
  using (restaurante_id in (select restaurantes_do_usuario()))
  with check (restaurante_id in (select restaurantes_do_usuario()));
