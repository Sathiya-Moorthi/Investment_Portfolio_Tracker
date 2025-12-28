-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Portfolios Table
create table portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Holdings Table
create table holdings (
  id uuid default uuid_generate_v4() primary key,
  portfolio_id uuid references portfolios(id) on delete cascade not null,
  symbol text not null,
  quantity numeric not null,
  average_price numeric not null,
  current_price numeric,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table portfolios enable row level security;
alter table holdings enable row level security;

-- Policies
create policy "Users can view own portfolios" on portfolios
  for select using (auth.uid() = user_id);

create policy "Users can insert own portfolios" on portfolios
  for insert with check (auth.uid() = user_id);

create policy "Users can view own holdings" on holdings
  for select using (
    exists (
      select 1 from portfolios
      where portfolios.id = holdings.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );
