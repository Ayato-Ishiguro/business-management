-- プロフィールテーブル
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 出社記録テーブル
create table public.office_visits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  visit_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- セキュリティ設定
alter table public.profiles enable row level security;
alter table public.office_visits enable row level security;

-- RLSポリシー
create policy "Users can view their own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

create policy "Users can insert and update their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can view all office visits"
  on public.office_visits for select
  to authenticated;

create policy "Users can insert their own visits"
  on public.office_visits for insert
  with check ( auth.uid() = user_id );