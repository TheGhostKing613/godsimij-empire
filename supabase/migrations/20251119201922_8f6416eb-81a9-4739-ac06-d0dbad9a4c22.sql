-- Create twin_memory_shards table
create table if not exists twin_memory_shards (
  id uuid primary key default gen_random_uuid(),
  twin_id uuid references twins(id) on delete cascade,
  type text not null,
  value text not null,
  rarity text default 'common' check (rarity in ('common', 'rare', 'epic', 'mythic')),
  xp int default 0,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table twin_memory_shards enable row level security;

-- RLS Policies for twin_memory_shards
create policy "Users can view own twin memory shards"
  on twin_memory_shards for select
  using (exists (
    select 1 from twins where twins.id = twin_memory_shards.twin_id and twins.user_id = auth.uid()
  ));

create policy "Users can insert own twin memory shards"
  on twin_memory_shards for insert
  with check (exists (
    select 1 from twins where twins.id = twin_memory_shards.twin_id and twins.user_id = auth.uid()
  ));

create policy "Users can update own twin memory shards"
  on twin_memory_shards for update
  using (exists (
    select 1 from twins where twins.id = twin_memory_shards.twin_id and twins.user_id = auth.uid()
  ));

-- Create twin_stats table
create table if not exists twin_stats (
  id uuid primary key default gen_random_uuid(),
  twin_id uuid unique references twins(id) on delete cascade,
  level int default 1,
  xp int default 0,
  wisdom int default 1,
  chaos int default 1,
  clarity int default 1,
  shadow int default 1,
  harmony int default 1,
  specialization text default null check (specialization in ('Seer', 'Rebel', 'Shadowborn', 'Flamebearer', 'Architect'))
);

-- Enable RLS
alter table twin_stats enable row level security;

-- RLS Policies for twin_stats
create policy "Users can view own twin stats"
  on twin_stats for select
  using (exists (
    select 1 from twins where twins.id = twin_stats.twin_id and twins.user_id = auth.uid()
  ));

create policy "Users can update own twin stats"
  on twin_stats for update
  using (exists (
    select 1 from twins where twins.id = twin_stats.twin_id and twins.user_id = auth.uid()
  ));

-- Create flame_rituals table
create table if not exists flame_rituals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  allegiance text not null check (allegiance in ('Solar Flame', 'Voidflame', 'Stormflame', 'Whisperflame')),
  ritual_text text not null,
  response_text text,
  completed_at timestamp with time zone default now()
);

-- Enable RLS
alter table flame_rituals enable row level security;

-- RLS Policies for flame_rituals
create policy "Users can view own rituals"
  on flame_rituals for select
  using (auth.uid() = user_id);

create policy "Users can insert own rituals"
  on flame_rituals for insert
  with check (auth.uid() = user_id);

-- Create seasonal_events table
create table if not exists seasonal_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  effects jsonb default '{}'::jsonb,
  active boolean default false
);

-- Enable RLS
alter table seasonal_events enable row level security;

-- RLS Policies for seasonal_events
create policy "Anyone can view seasonal events"
  on seasonal_events for select
  using (true);

create policy "Admins can manage seasonal events"
  on seasonal_events for all
  using (has_role(auth.uid(), 'admin'::app_role));

-- Create user_unlocks table
create table if not exists user_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  portal text not null check (portal in ('Flame Sanctum', 'Veil Garden', 'Echo Arena', 'Starforge')),
  unlocked boolean default false,
  unlocked_at timestamp with time zone default now(),
  unique(user_id, portal)
);

-- Enable RLS
alter table user_unlocks enable row level security;

-- RLS Policies for user_unlocks
create policy "Users can view own unlocks"
  on user_unlocks for select
  using (auth.uid() = user_id);

create policy "Users can insert own unlocks"
  on user_unlocks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own unlocks"
  on user_unlocks for update
  using (auth.uid() = user_id);