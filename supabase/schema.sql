-- Jalankan di Supabase Dashboard > SQL Editor.
-- Kebijakan RLS memastikan JWT user hanya dapat membaca/mengubah habit miliknya.
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 45),
  emoji text not null default '🎯',
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "Users can read own habits" on public.habits;
create policy "Users can read own habits" on public.habits
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can create own habits" on public.habits;
create policy "Users can create own habits" on public.habits
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update own habits" on public.habits;
create policy "Users can update own habits" on public.habits
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own habits" on public.habits;
create policy "Users can delete own habits" on public.habits
  for delete to authenticated using (auth.uid() = user_id);

create index if not exists habits_user_created_at_idx
  on public.habits (user_id, created_at desc);
