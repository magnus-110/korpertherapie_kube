create type public.app_role as enum ('voll', 'eingeschraenkt');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Jede:r kann alle Profile lesen" on public.profiles
  for select to authenticated using (true);

create policy "Jede:r darf nur das eigene Profil anlegen" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "Jede:r darf nur das eigene Profil aendern" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Rollen sind fuer alle Mitarbeiter:innen lesbar" on public.user_roles
  for select to authenticated using (true);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.is_voll(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'voll');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create type public.appointment_status as enum ('geplant', 'abgehakt');

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kontakt text,
  notizen text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.patients to authenticated;
grant all on public.patients to service_role;

alter table public.patients enable row level security;

create policy "Mitarbeiter:innen koennen Patient:innen verwalten" on public.patients
  for all to authenticated using (true) with check (true);

create table public.appointment_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  behandler_id uuid references auth.users(id) on delete set null,
  dauer_minuten integer,
  gebuehren numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.appointment_types to authenticated;
grant all on public.appointment_types to service_role;

alter table public.appointment_types enable row level security;

create policy "Mitarbeiter:innen koennen Behandlungsarten verwalten" on public.appointment_types
  for all to authenticated using (true) with check (true);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  type_id uuid references public.appointment_types(id) on delete set null,
  behandler_id uuid references auth.users(id) on delete set null,
  start timestamptz not null,
  ende timestamptz not null,
  status public.appointment_status not null default 'geplant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;

alter table public.appointments enable row level security;

create policy "Mitarbeiter:innen koennen Termine verwalten" on public.appointments
  for all to authenticated using (true) with check (true);

create type public.invoice_status as enum ('offen', 'bezahlt', 'angemahnt');

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  rechnungsnummer text not null unique,
  patient_id uuid not null references public.patients(id) on delete restrict,
  datum date not null,
  betrag numeric(10,2) not null,
  status public.invoice_status not null default 'offen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.invoices to authenticated;
grant all on public.invoices to service_role;

alter table public.invoices enable row level security;

create policy "Rechnungen nur fuer Rolle voll" on public.invoices
  for all to authenticated using (public.has_role(auth.uid(), 'voll')) with check (public.has_role(auth.uid(), 'voll'));

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  bezeichnung text not null,
  betrag numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.invoice_items to authenticated;
grant all on public.invoice_items to service_role;

alter table public.invoice_items enable row level security;

create policy "Rechnungsposten nur fuer Rolle voll" on public.invoice_items
  for all to authenticated using (public.has_role(auth.uid(), 'voll')) with check (public.has_role(auth.uid(), 'voll'));

create type public.payment_source as enum ('kontoauszug', 'manuell');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  betrag numeric(10,2) not null,
  datum date not null,
  quelle public.payment_source not null default 'manuell',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;

alter table public.payments enable row level security;

create policy "Zahlungen nur fuer Rolle voll" on public.payments
  for all to authenticated using (public.has_role(auth.uid(), 'voll')) with check (public.has_role(auth.uid(), 'voll'));

create type public.bank_transaction_status as enum ('offen', 'zugeordnet');

create table public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  datum date not null,
  betrag numeric(10,2) not null,
  verwendungszweck text,
  absender text,
  status public.bank_transaction_status not null default 'offen',
  matched_invoice_id uuid references public.invoices(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.bank_transactions to authenticated;
grant all on public.bank_transactions to service_role;

alter table public.bank_transactions enable row level security;

create policy "Kontoumsaetze nur fuer Rolle voll" on public.bank_transactions
  for all to authenticated using (public.has_role(auth.uid(), 'voll')) with check (public.has_role(auth.uid(), 'voll'));

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_patients_updated_at before update on public.patients
  for each row execute function public.update_updated_at_column();

create trigger update_appointment_types_updated_at before update on public.appointment_types
  for each row execute function public.update_updated_at_column();

create trigger update_appointments_updated_at before update on public.appointments
  for each row execute function public.update_updated_at_column();

create trigger update_invoices_updated_at before update on public.invoices
  for each row execute function public.update_updated_at_column();

create trigger update_invoice_items_updated_at before update on public.invoice_items
  for each row execute function public.update_updated_at_column();

create trigger update_payments_updated_at before update on public.payments
  for each row execute function public.update_updated_at_column();

create trigger update_bank_transactions_updated_at before update on public.bank_transactions
  for each row execute function public.update_updated_at_column();