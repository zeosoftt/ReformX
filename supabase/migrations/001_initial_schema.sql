-- Pilates / Physiotherapy studio — initial schema
-- Run in Supabase SQL editor or via CLI migrations

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Studios (tenant root)
-- ---------------------------------------------------------------------------
create table public.studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  station_count int not null default 1 check (station_count >= 0),
  trainer_count int not null default 1 check (trainer_count >= 0),
  services text[] default '{}',
  working_hours jsonb default '{}',
  timezone text default 'Europe/Istanbul',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_studios_slug on public.studios (slug) where slug is not null;

-- ---------------------------------------------------------------------------
-- Trainers (belong to studio)
-- ---------------------------------------------------------------------------
create table public.trainers (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_trainers_studio on public.trainers (studio_id);

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  name text not null,
  phone text,
  email text,
  goals text[] default '{}',
  trainer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clients_studio on public.clients (studio_id);
create index idx_clients_email on public.clients (studio_id, email) where email is not null;

-- ---------------------------------------------------------------------------
-- Client health (1:1 extension)
-- ---------------------------------------------------------------------------
create table public.client_health (
  client_id uuid primary key references public.clients (id) on delete cascade,
  injuries text,
  conditions text,
  medical_notes text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Measurements (time-series — AI / progress)
-- ---------------------------------------------------------------------------
create table public.client_measurements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  measured_at timestamptz not null default now(),
  weight_kg numeric(6,2),
  height_cm numeric(6,2),
  waist_cm numeric(6,2),
  hip_cm numeric(6,2),
  body_fat_percent numeric(5,2),
  notes text,
  source text default 'manual',
  created_at timestamptz not null default now()
);

create index idx_measurements_client_time on public.client_measurements (client_id, measured_at desc);

-- ---------------------------------------------------------------------------
-- Package templates (catalog)
-- ---------------------------------------------------------------------------
create table public.package_templates (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  name text not null,
  session_count int not null check (session_count > 0),
  validity_days int,
  price_cents int,
  currency text default 'TRY',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_package_templates_studio on public.package_templates (studio_id);

-- ---------------------------------------------------------------------------
-- Client package instances (remaining sessions + expiry)
-- ---------------------------------------------------------------------------
create table public.client_packages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  template_id uuid references public.package_templates (id) on delete set null,
  sessions_total int not null check (sessions_total > 0),
  sessions_remaining int not null check (sessions_remaining >= 0),
  starts_at date not null default (current_date),
  expires_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_remaining_lte_total check (sessions_remaining <= sessions_total)
);

create index idx_client_packages_client on public.client_packages (client_id);
create index idx_client_packages_expiry on public.client_packages (expires_at) where expires_at is not null;

-- ---------------------------------------------------------------------------
-- Sessions (appointments)
-- ---------------------------------------------------------------------------
create type public.session_status as enum (
  'scheduled',
  'completed',
  'no_show',
  'cancelled'
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  trainer_id uuid references public.trainers (id) on delete set null,
  scheduled_at timestamptz not null,
  duration_min int not null default 50 check (duration_min > 0),
  session_type text,
  status public.session_status not null default 'scheduled',
  attendance_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sessions_studio_time on public.sessions (studio_id, scheduled_at);
create index idx_sessions_client_time on public.sessions (client_id, scheduled_at desc);
create index idx_sessions_status on public.sessions (studio_id, status, scheduled_at);

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  client_package_id uuid references public.client_packages (id) on delete set null,
  amount_cents int not null check (amount_cents >= 0),
  currency text not null default 'TRY',
  status public.payment_status not null default 'pending',
  provider text,
  external_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_payments_studio on public.payments (studio_id, created_at desc);
create index idx_payments_client on public.payments (client_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger (reuse one function)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_studios_updated before update on public.studios
  for each row execute function public.set_updated_at();

create trigger tr_trainers_updated before update on public.trainers
  for each row execute function public.set_updated_at();

create trigger tr_clients_updated before update on public.clients
  for each row execute function public.set_updated_at();

create trigger tr_client_packages_updated before update on public.client_packages
  for each row execute function public.set_updated_at();

create trigger tr_sessions_updated before update on public.sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS (enable + policies — tighten per auth user in production)
-- ---------------------------------------------------------------------------
alter table public.studios enable row level security;
alter table public.trainers enable row level security;
alter table public.clients enable row level security;
alter table public.client_health enable row level security;
alter table public.client_measurements enable row level security;
alter table public.package_templates enable row level security;
alter table public.client_packages enable row level security;
alter table public.sessions enable row level security;
alter table public.payments enable row level security;

-- Placeholder: replace with auth.uid() + studio membership table
-- For development: allow all authenticated users (adjust before launch)
create policy "dev_authenticated_all_studios"
  on public.studios for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_trainers"
  on public.trainers for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_clients"
  on public.clients for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_client_health"
  on public.client_health for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_measurements"
  on public.client_measurements for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_package_templates"
  on public.package_templates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_client_packages"
  on public.client_packages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_sessions"
  on public.sessions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "dev_authenticated_all_payments"
  on public.payments for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
