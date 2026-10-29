-- AutoManager: schema inicial para UMA oficina.
-- Execute no SQL Editor do projeto Supabase antes de configurar o app.
-- Cada registro pertence ao usuário autenticado; RLS impede acesso anônimo e entre usuários.
create table if not exists public.clients (
 id text primary key, user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null check (jsonb_typeof(payload) = 'object'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.parts (
 id text primary key, user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null check (jsonb_typeof(payload) = 'object'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.service_orders (
 id text primary key, user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null check (jsonb_typeof(payload) = 'object'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists clients_user_id_idx on public.clients(user_id);
create index if not exists parts_user_id_idx on public.parts(user_id);
create index if not exists service_orders_user_id_idx on public.service_orders(user_id);

alter table public.clients enable row level security;
alter table public.parts enable row level security;
alter table public.service_orders enable row level security;

drop policy if exists "Authenticated owner reads clients" on public.clients;
create policy "Authenticated owner reads clients" on public.clients for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Authenticated owner inserts clients" on public.clients;
create policy "Authenticated owner inserts clients" on public.clients for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner updates clients" on public.clients;
create policy "Authenticated owner updates clients" on public.clients for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner deletes clients" on public.clients;
create policy "Authenticated owner deletes clients" on public.clients for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Authenticated owner reads parts" on public.parts;
create policy "Authenticated owner reads parts" on public.parts for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Authenticated owner inserts parts" on public.parts;
create policy "Authenticated owner inserts parts" on public.parts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner updates parts" on public.parts;
create policy "Authenticated owner updates parts" on public.parts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner deletes parts" on public.parts;
create policy "Authenticated owner deletes parts" on public.parts for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Authenticated owner reads service orders" on public.service_orders;
create policy "Authenticated owner reads service orders" on public.service_orders for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Authenticated owner inserts service orders" on public.service_orders;
create policy "Authenticated owner inserts service orders" on public.service_orders for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner updates service orders" on public.service_orders;
create policy "Authenticated owner updates service orders" on public.service_orders for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Authenticated owner deletes service orders" on public.service_orders;
create policy "Authenticated owner deletes service orders" on public.service_orders for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.clients, public.parts, public.service_orders to authenticated;
