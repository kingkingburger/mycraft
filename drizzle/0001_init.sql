create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Seoul',
  theme text not null default 'dark' check (theme in ('dark', 'light', 'auto')),
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  emoji text,
  mapped_stat text not null check (mapped_stat in ('vitality', 'intelligence', 'focus', 'social')),
  unit text not null check (unit in ('minutes', 'count')),
  is_default boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  log_date date not null,
  value numeric(10, 2),
  note text,
  xp_earned integer not null,
  stat_delta integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_log_entries_user_date on log_entries(user_id, log_date desc);
create index if not exists idx_log_entries_category_date on log_entries(category_id, log_date desc);

create table if not exists user_state (
  user_id uuid primary key references profiles(id) on delete cascade,
  total_xp bigint not null default 0,
  level integer not null default 1,
  xp_in_level integer not null default 0,
  vitality bigint not null default 0,
  intelligence bigint not null default 0,
  focus bigint not null default 0,
  social bigint not null default 0,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  last_log_date date,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table categories enable row level security;
alter table log_entries enable row level security;
alter table user_state enable row level security;

drop policy if exists "users see own profile" on profiles;
create policy "users see own profile" on profiles for all using (auth.uid() = id);

drop policy if exists "users see own categories" on categories;
create policy "users see own categories" on categories for all using (auth.uid() = user_id);

drop policy if exists "users see own logs" on log_entries;
create policy "users see own logs" on log_entries for all using (auth.uid() = user_id);

drop policy if exists "users see own state" on user_state;
create policy "users see own state" on user_state for all using (auth.uid() = user_id);
