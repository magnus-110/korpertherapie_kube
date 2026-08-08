# Patientenakte mit Behandlungsepisoden

Die Patientenakte wird das Herzstück der Praxis-Ansicht: pro Patient:in eine oder mehrere Behandlungsepisoden, darin alle Termine, Dokumentationen, Body Chart, Anamnese, Fragebögen und Rechnungen.

## So hängt alles zusammen

```text
Patient:in
  └─ Behandlungsepisode (z. B. "Rückenbeschwerden, ab 03/2026")
       ├─ Body Chart        (1 pro Episode, Platzhalter)
       ├─ Anamnesebogen     (1 pro Episode, Platzhalter)
       ├─ Termine           (bestehende Termine, einer Episode zugeordnet)
       │    ├─ Dokumentation (1 pro Termin, vom Behandler)
       │    └─ Fragebogen    (automatisch 3 Tage nach dem Termin)
       └─ Rechnungen        (bestehende Rechnungen, optional der Episode zugeordnet)
```

Eine Episode ist der Behandlungsverlauf zu einem Anliegen. Beim ersten Termin
legt der Behandler die Episode an, macht sich mit Body Chart und Anamnese ein
Bild und dokumentiert danach jeden Termin. Vor dem nächsten Termin sieht er auf
einen Blick die letzte Doku.

## Ablauf für den Behandler

1. **Vor dem Termin:** In „Heute" auf den Termin tippen → Episode öffnet sich mit
   einem Kasten „Letzte Sitzung" (Datum + Doku-Text) ganz oben, darunter Body
   Chart und Anamnese.
2. **Erster Termin:** Wenn der Patient noch keine Episode hat, wird beim Öffnen
   eine angeboten („Episode anlegen") – Titel und Anliegen frei wählbar.
3. **Nach dem Termin:** Button „Dokumentation" am Termin → kurzes Formular
   (Befund, Behandlung, Plan/Hausaufgabe). Speichern, fertig.
4. **Verlauf:** Episoden-Seite listet alle Termine chronologisch, jeder mit
   Doku-Vorschau, Fragebogen-Status und zugehöriger Rechnung.

## Seiten

- **`/praxis/patienten`** – Liste mit Suche (Name, E-Mail, Telefon), Anlegen von
  Hand für Telefonanmeldungen.
- **`/praxis/patienten/$id`** – Stammdaten (bearbeitbar) + Liste der Episoden +
  Rechnungen des Patienten.
- **`/praxis/patienten/$id/episode/$episodeId`** – die eigentliche Akte:
  Kopf mit „Letzte Sitzung", Reiter Body Chart · Anamnese · Verlauf · Rechnungen.

Body Chart und Anamnese sind jetzt sichtbare, leere Bereiche mit Hinweis
„Kommt später" – die Struktur steht, die Inhalte lieferst du nach.

## Fragebogen nach dem Termin

- Zu jedem abgehakten Termin entsteht ein Fragebogen-Eintrag mit Freigabedatum
  = Termin + 3 Tage.
- Ab diesem Datum sieht der Patient ihn in „Mein Bereich"; vorher steht dort
  nichts.
- Die Fragen selbst kommen später – jetzt nur der Eintrag mit Status
  (wartet / offen / beantwortet) und ein Feld für die Antworten.
- Der automatische Versand per E-Mail ist ein späterer Schritt; die Fälligkeit
  wird jetzt schon korrekt berechnet.

## Datenbank

Neue Tabellen:

- `treatment_episodes` – patient_id, titel, anliegen, practitioner_id, status
  (aktiv/abgeschlossen), start_datum, ende_datum.
- `episode_documents` – episode_id, art (`body_chart` | `anamnese`), inhalt
  (JSON, jetzt leer), aktualisiert_von. Eine Zeile je Art und Episode.
- `session_notes` – appointment_id (eindeutig), episode_id, befund, behandlung,
  plan, verfasst_von.
- `questionnaires` – appointment_id, episode_id, faellig_ab, status, antworten
  (JSON, jetzt leer).

Ergänzungen an bestehenden Tabellen:

- `appointments.episode_id` (optional) – ordnet Termine einer Episode zu.
- `invoices.episode_id` (optional) – ordnet Rechnungen einer Episode zu.

Zugriffsregeln: Praxisteam darf alles lesen und schreiben. Patient:innen dürfen
ihre eigenen Episoden und Fragebögen sehen und die Antworten im Fragebogen
eintragen, sobald er freigegeben ist – Dokumentationen des Behandlers bleiben
intern.

## Technische Umsetzung

- Migration mit den vier neuen Tabellen inkl. GRANTs, RLS über `is_team()` und
  `mein_patient_id()`, `updated_at`-Trigger.
- Trigger auf `appointments`: beim Wechsel auf Status `abgehakt` wird der
  Fragebogen-Eintrag mit `faellig_ab = start + 3 Tage` angelegt.
- Neue Routen unter `src/routes/_authenticated/praxis/patienten.*`, geschützt
  mit `nurTeam`.
- Komponenten: `PatientenListe`, `PatientProfil`, `EpisodenListe`,
  `EpisodeAkte` (Reiter), `DokuDialog`, `PlatzhalterBereich` für Body Chart und
  Anamnese.
- `TerminDialog` und `heute.tsx` bekommen einen Link „Akte öffnen" bzw.
  „Dokumentation".
- `mein-bereich.tsx` bekommt den Abschnitt „Fragebogen" mit freigeschalteten
  Einträgen.
