-- LaunchPilot AI Supabase schema
-- Run this in Supabase SQL Editor after creating a free Supabase project.

create table if not exists public.blueprints (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blueprints enable row level security;

drop policy if exists "Users can read own blueprints" on public.blueprints;
create policy "Users can read own blueprints"
on public.blueprints
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own blueprints" on public.blueprints;
create policy "Users can insert own blueprints"
on public.blueprints
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own blueprints" on public.blueprints;
create policy "Users can update own blueprints"
on public.blueprints
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own blueprints" on public.blueprints;
create policy "Users can delete own blueprints"
on public.blueprints
for delete
using (auth.uid() = user_id);

create index if not exists blueprints_user_updated_idx
on public.blueprints(user_id, updated_at desc);

create table if not exists public.usage_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  generations_used integer not null default 0,
  free_generation_limit integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint usage_credits_generations_used_nonnegative check (generations_used >= 0),
  constraint usage_credits_free_limit_positive check (free_generation_limit > 0)
);

alter table public.usage_credits enable row level security;

drop policy if exists "Users can read own usage credits" on public.usage_credits;
create policy "Users can read own usage credits"
on public.usage_credits
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage credits" on public.usage_credits;
create policy "Users can insert own usage credits"
on public.usage_credits
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own usage credits" on public.usage_credits;
create policy "Users can update own usage credits"
on public.usage_credits
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
