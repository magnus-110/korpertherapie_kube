alter table public.patients
  add column if not exists geburtsdatum date,
  add column if not exists strasse text,
  add column if not exists plz text,
  add column if not exists ort text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_email text := lower(trim(coalesce(new.email, '')));
  v_name text := coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), v_email);
  v_patient uuid;
begin
  insert into public.profiles (id, name)
  values (new.id, v_name)
  on conflict (id) do nothing;

  -- Konten, die sich über die Website registrieren, sind Patient:innen.
  if coalesce(new.raw_user_meta_data->>'rolle', '') = 'patient' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'patient')
    on conflict (user_id, role) do nothing;

    select id into v_patient
    from public.patients
    where lower(email) = v_email
    limit 1;

    if v_patient is null then
      insert into public.patients (name, email, kontakt, telefon, geburtsdatum, strasse, plz, ort, app_user_id)
      values (
        v_name,
        v_email,
        v_email,
        nullif(trim(coalesce(new.raw_user_meta_data->>'telefon', '')), ''),
        nullif(new.raw_user_meta_data->>'geburtsdatum', '')::date,
        nullif(trim(coalesce(new.raw_user_meta_data->>'strasse', '')), ''),
        nullif(trim(coalesce(new.raw_user_meta_data->>'plz', '')), ''),
        nullif(trim(coalesce(new.raw_user_meta_data->>'ort', '')), '')
      , new.id);
    else
      update public.patients
      set app_user_id = coalesce(app_user_id, new.id),
          telefon = coalesce(telefon, nullif(trim(coalesce(new.raw_user_meta_data->>'telefon', '')), '')),
          geburtsdatum = coalesce(geburtsdatum, nullif(new.raw_user_meta_data->>'geburtsdatum', '')::date),
          strasse = coalesce(strasse, nullif(trim(coalesce(new.raw_user_meta_data->>'strasse', '')), '')),
          plz = coalesce(plz, nullif(trim(coalesce(new.raw_user_meta_data->>'plz', '')), '')),
          ort = coalesce(ort, nullif(trim(coalesce(new.raw_user_meta_data->>'ort', '')), ''))
      where id = v_patient;
    end if;
  end if;

  return new;
end;
$function$;

drop function if exists public.termin_buchen(uuid, timestamptz, text, text, text, text);

create or replace function public.termin_buchen_konto(
  _behandlungsart uuid,
  _start timestamptz,
  _anliegen text
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_user uuid := auth.uid();
  v_behandler uuid;
  v_dauer int;
  v_patient uuid;
  v_termin uuid;
  v_tag date;
  v_email text;
  v_name text;
begin
  if v_user is null then
    raise exception 'Bitte melde dich an, um zu buchen.';
  end if;

  select t.practitioner_id, coalesce(t.dauer_minuten, 60)
    into v_behandler, v_dauer
  from public.appointment_types t
  where t.id = _behandlungsart and t.aktiv and t.online_buchbar;

  if v_behandler is null then
    raise exception 'Diese Behandlung ist nicht online buchbar.';
  end if;

  v_tag := (_start at time zone 'Europe/Berlin')::date;
  if not exists (
    select 1 from public.freie_zeiten(_behandlungsart, v_tag, v_tag) f
    where f.start_zeit = _start
  ) then
    raise exception 'Dieser Termin ist inzwischen vergeben. Bitte wähle einen anderen.';
  end if;

  select id into v_patient from public.patients where app_user_id = v_user limit 1;

  if v_patient is null then
    select lower(u.email), coalesce(nullif(trim(u.raw_user_meta_data->>'name'), ''), lower(u.email))
      into v_email, v_name
    from auth.users u where u.id = v_user;

    select id into v_patient from public.patients where lower(email) = v_email limit 1;

    if v_patient is null then
      insert into public.patients (name, email, kontakt, app_user_id)
      values (v_name, v_email, v_email, v_user)
      returning id into v_patient;
    else
      update public.patients set app_user_id = v_user where id = v_patient;
    end if;
  end if;

  insert into public.appointments
    (patient_id, type_id, practitioner_id, start, ende, status, quelle, anliegen, ist_intern)
  values
    (v_patient, _behandlungsart, v_behandler, _start, _start + make_interval(mins => v_dauer),
     'geplant', 'online', nullif(trim(coalesce(_anliegen, '')), ''), false)
  returning id into v_termin;

  return v_termin;
end;
$function$;

create policy "Patient pflegt eigene Kontaktdaten"
on public.patients for update to authenticated
using (app_user_id = auth.uid())
with check (app_user_id = auth.uid());