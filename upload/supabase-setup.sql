-- ╔══════════════════════════════════════════════════════════╗
-- ║  Record.me — 云端同步建表脚本                              ║
-- ║  在 Supabase 后台 → 左侧 SQL Editor → New query →          ║
-- ║  把下面全部粘贴进去 → 点 Run。                              ║
-- ╚══════════════════════════════════════════════════════════╝

create table if not exists public.records (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('entry','win')),
  payload     jsonb not null,
  ts          timestamptz not null,
  updated_at  timestamptz not null default now()
);

alter table public.records enable row level security;

-- 每个人只能读写自己的记录
drop policy if exists "own_select" on public.records;
drop policy if exists "own_insert" on public.records;
drop policy if exists "own_update" on public.records;
drop policy if exists "own_delete" on public.records;

create policy "own_select" on public.records
  for select using (auth.uid() = user_id);
create policy "own_insert" on public.records
  for insert with check (auth.uid() = user_id);
create policy "own_update" on public.records
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_delete" on public.records
  for delete using (auth.uid() = user_id);

create index if not exists records_user_idx on public.records (user_id);
