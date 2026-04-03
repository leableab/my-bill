-- ============================================================================
-- Migration: 00001_create_tables
-- Description: Create all tables for the personal finance tracker
-- ============================================================================

-- =========================
-- profiles table
-- =========================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  currency text default '฿' not null,
  budget_alert_threshold integer default 80 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- transactions table
-- =========================
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount decimal(12,2) not null check (amount > 0),
  category text not null,
  note text,
  date date default current_date not null,
  created_at timestamptz default now() not null
);

create index idx_transactions_user_date on transactions(user_id, date desc);
create index idx_transactions_user_type on transactions(user_id, type);
create index idx_transactions_user_category on transactions(user_id, category);

alter table public.transactions enable row level security;

create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on transactions for delete using (auth.uid() = user_id);

-- =========================
-- budgets table
-- =========================
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null,
  monthly_limit decimal(12,2) not null check (monthly_limit > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, category)
);

alter table public.budgets enable row level security;

create policy "Users can view own budgets" on budgets for select using (auth.uid() = user_id);
create policy "Users can insert own budgets" on budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own budgets" on budgets for update using (auth.uid() = user_id);
create policy "Users can delete own budgets" on budgets for delete using (auth.uid() = user_id);

-- =========================
-- monthly_summaries table
-- =========================
create table public.monthly_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month date not null,
  total_income decimal(12,2) default 0 not null,
  total_expense decimal(12,2) default 0 not null,
  category_breakdown jsonb default '{}' not null,
  created_at timestamptz default now() not null,
  unique(user_id, month)
);

alter table public.monthly_summaries enable row level security;

create policy "Users can view own summaries" on monthly_summaries for select using (auth.uid() = user_id);

-- =========================
-- updated_at trigger function
-- =========================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger update_budgets_updated_at before update on budgets for each row execute function update_updated_at();
