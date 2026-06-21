-- ============================================================
-- AutoFX Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles: automatically created for every auth.users row
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text        not null,
  full_name    text        not null default '',
  phone        text        not null default '',
  country      text        not null default '',
  role         text        not null default 'user'
               check (role in ('user', 'admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Applications: one per user
create table public.applications (
  id                    uuid        primary key default uuid_generate_v4(),
  user_id               uuid        not null references public.profiles(id) on delete cascade,

  -- Exness account details (user-submitted)
  exness_uid            text        not null,
  exness_account_number text        not null,
  account_balance       numeric(12,2) not null,
  account_currency      text        not null default 'USD',

  -- Lifecycle status
  status                text        not null default 'pending'
                        check (status in ('pending','under_review','approved','rejected')),

  -- Package (admin-set after approval)
  package               text        check (package in ('bronze','silver','gold')),
  package_price         numeric(10,2),

  -- Stripe payment link (admin provides per user)
  stripe_payment_link   text,

  -- Payment tracking
  payment_status        text        not null default 'unpaid'
                        check (payment_status in ('unpaid','paid')),
  payment_confirmed_at  timestamptz,
  payment_confirmed_by  uuid        references public.profiles(id),

  -- Mirror trading
  mirror_active         boolean     not null default false,
  mirror_activated_at   timestamptz,
  mirror_activated_by   uuid        references public.profiles(id),

  -- Admin review fields
  admin_notes           text        not null default '',
  rejection_reason      text        not null default '',
  reviewed_by           uuid        references public.profiles(id),
  reviewed_at           timestamptz,

  -- Timestamps
  submitted_at          timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- One application per user
  constraint one_application_per_user unique (user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.applications enable row level security;

-- ---- profiles ----

create policy "Users: read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users: update own profile (no role change)"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins: full access to all profiles"
  on public.profiles for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ---- applications ----

create policy "Users: read own application"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users: submit own application (once)"
  on public.applications for insert
  with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.applications where user_id = auth.uid()
    )
  );

create policy "Admins: full access to all applications"
  on public.applications for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger applications_updated_at
  before update on public.applications
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ADMIN SETUP
-- Run AFTER the admin user signs up through the app:
-- update public.profiles set role = 'admin' where email = 'admin@autofx.ae';
-- ============================================================
