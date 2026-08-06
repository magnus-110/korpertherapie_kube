create type public.appointment_kind as enum ('erstbehandlung', 'folgetermin');

alter table public.appointment_types
  add column art_kategorie public.appointment_kind not null default 'folgetermin';

update public.appointment_types
set art_kategorie = 'erstbehandlung'
where name ilike '%erst%';