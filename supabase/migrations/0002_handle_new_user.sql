-- ========================================
-- PROVISIONAMENTO: cria o restaurante do dono no cadastro
-- ========================================
-- Quando um usuário se cadastra no Supabase Auth, este gatilho cria
-- automaticamente a linha em `restaurantes` ligada a ele. O nome vem do
-- metadata enviado no signUp (options.data.nome). Assim o `restaurante_id`
-- nunca é digitado pelo dono — o sistema preenche sozinho.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.restaurantes (user_id, nome)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nome', ''), 'Meu Restaurante')
  );
  return new;
end;
$$;

-- Dispara após cada novo usuário criado no Auth
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
