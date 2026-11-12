-- Jalankan di Supabase Dashboard > SQL Editor.
-- Kebijakan RLS memastikan JWT user hanya dapat membaca/mengubah habit & profile miliknya.

-- ==========================================
-- 1. TABEL HABITS
-- ==========================================
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

-- ==========================================
-- 2. TABEL PROFILES (Streak Freeze Protection)
-- ==========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  freeze_tickets integer not null default 1 check (freeze_tickets >= 0),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Trigger otomatis saat user baru mendaftar di auth.users
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  insert into public.profiles (id, freeze_tickets)
  values (new.id, 1)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Isi profil untuk akun yang sudah terdaftar sebelumnya
insert into public.profiles (id, freeze_tickets)
select id, 1 from auth.users
on conflict (id) do nothing;

