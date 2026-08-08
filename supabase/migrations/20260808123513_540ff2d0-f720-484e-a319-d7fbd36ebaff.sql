create type public.episode_status as enum ('aktiv', 'abgeschlossen');
create type public.episode_document_kind as enum ('body_chart', 'anamnese');
create type public.questionnaire_status as enum ('wartet', 'offen', 'beantwortet');

create table public.treatment_episodes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  practitioner_id uuid references public.practitioners(id),
  titel text not null,
  anliegen text,
  status public.episode_status not null default 'aktiv',
  start_datum date not null default current_date,
  ende_datum date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.treatment_episodes to authenticated;
grant all on public.treatment_episodes to service_role;
alter table public.treatment_episodes enable row level security;
create policy "Team verwaltet Episoden" on public.treatment_episodes for all to authenticated using (public.is_team()) with check (public.is_team());
create policy "Patient sieht eigene Episoden" on public.treatment_episodes for select to authenticated using (patient_id = public.mein_patient_id());

create table public.episode_documents (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.treatment_episodes(id) on delete cascade,
  art public.episode_document_kind not null,
  inhalt jsonb not null default '{}'::jsonb,
  aktualisiert_von uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (episode_id, art)
);
grant select, insert, update, delete on public.episode_documents to authenticated;
grant all on public.episode_documents to service_role;
alter table public.episode_documents enable row level security;
create policy "Team verwaltet Episodendokumente" on public.episode_documents for all to authenticated using (public.is_team()) with check (public.is_team());

create table public.session_notes (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null unique references public.appointments(id) on delete cascade,
  episode_id uuid references public.treatment_episodes(id) on delete set null,
  befund text,
  behandlung text,
  plan text,
  verfasst_von uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.session_notes to authenticated;
grant all on public.session_notes to service_role;
alter table public.session_notes enable row level security;
create policy "Team verwaltet Dokumentation" on public.session_notes for all to authenticated using (public.is_team()) with check (public.is_team());

create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null unique references public.appointments(id) on delete cascade,
  episode_id uuid references public.treatment_episodes(id) on delete set null,
  patient_id uuid not null references public.patients(id) on delete cascade,
  faellig_ab timestamptz not null,
  status public.questionnaire_status not null default 'wartet',
  antworten jsonb not null default '{}'::jsonb,
  beantwortet_am timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.questionnaires to authenticated;
grant all on public.questionnaires to service_role;
alter table public.questionnaires enable row level security;
create policy "Team verwaltet Fragebogen" on public.questionnaires for all to authenticated using (public.is_team()) with check (public.is_team());
create policy "Patient sieht freigeschaltete Fragebogen" on public.questionnaires for select to authenticated using (patient_id = public.mein_patient_id() and faellig_ab <= now());
create policy "Patient beantwortet eigenen Fragebogen" on public.questionnaires for update to authenticated using (patient_id = public.mein_patient_id() and faellig_ab <= now()) with check (patient_id = public.mein_patient_id());

alter table public.appointments add column episode_id uuid references public.treatment_episodes(id) on delete set null;
alter table public.invoices add column episode_id uuid references public.treatment_episodes(id) on delete set null;

create trigger update_treatment_episodes_updated_at before update on public.treatment_episodes for each row execute function public.update_updated_at_column();
create trigger update_episode_documents_updated_at before update on public.episode_documents for each row execute function public.update_updated_at_column();
create trigger update_session_notes_updated_at before update on public.session_notes for each row execute function public.update_updated_at_column();
create trigger update_questionnaires_updated_at before update on public.questionnaires for each row execute function public.update_updated_at_column();

create or replace function public.fragebogen_nach_termin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'abgehakt' and (tg_op = 'INSERT' or old.status is distinct from 'abgehakt') then
    insert into public.questionnaires (appointment_id, episode_id, patient_id, faellig_ab)
    values (new.id, new.episode_id, new.patient_id, new.start + interval '3 days')
    on conflict (appointment_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger termin_fragebogen after insert or update of status on public.appointments for each row execute function public.fragebogen_nach_termin();