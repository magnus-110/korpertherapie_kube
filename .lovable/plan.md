# Schritt 2: Backend, Anmeldung und Rollen

Ziel: eigenes Supabase-Projekt anbinden, Anmeldung mit E-Mail/Passwort für zwei Mitarbeiter-Konten, Rollen, das komplette Datenmodell mit strengem Zugriffsschutz sowie eine Login-Seite und eine schlichte geschützte Startansicht. Keine Zahlungsanbieter, keine fertigen Kalender- oder Rechnungsoberflächen.

## 1. Eigenes Supabase-Projekt anbinden

Kein Lovable Cloud. Stattdessen wird Ihr eigenes Supabase-Projekt über die Supabase-Integration verbunden (oben rechts im Editor das Supabase-Symbol → „Connect Supabase" → Organisation und Projekt auswählen). Danach stehen Migrationen, Auth und der generierte Client bereit. Zugriff ausschließlich über den Standard-Client und Umgebungsvariablen, damit ein späterer Umzug auf selbst gehostetes Supabase reine Konfigurationssache bleibt. Der geheime Server-Schlüssel taucht nie im Frontend auf.

## 2. Rollen und Profile

- Rollentyp mit den Werten `voll` und `eingeschraenkt`.
- Tabelle `user_roles` (getrennt von den Profildaten, damit Rechte nicht manipulierbar sind) plus Prüf-Funktion `has_role` und Komfort-Funktion `is_voll()`.
- Tabelle `profiles` (id → Benutzer, name) wird beim Registrieren automatisch per Trigger angelegt.
- Sabrina: `voll`. Björn: `eingeschraenkt`.
- Keine Zwei-Faktor-Anmeldung in diesem Schritt (kommt später bei Bedarf).

## 3. Tabellen

Behandlung/Betrieb (für beide Rollen lesbar/schreibbar, nur angemeldet):
- `patients` (name, kontakt, notizen)
- `appointment_types` (name, behandler_id, dauer_minuten, gebuehren)
- `appointments` (patient_id, type_id, behandler_id, start, ende, status: geplant | abgehakt)

Abrechnung (ausschließlich Rolle `voll`):
- `invoices` (rechnungsnummer eindeutig, patient_id, datum, betrag, status: offen | bezahlt | angemahnt)
- `invoice_items` (invoice_id, bezeichnung, betrag)
- `payments` (invoice_id, betrag, datum, quelle: kontoauszug | manuell)
- `bank_transactions` (datum, betrag, verwendungszweck, absender, status: offen | zugeordnet, matched_invoice_id)

Die Zahlungslogik bleibt bewusst link- und dienstleisterfrei: später verschickt die App nur eine E-Mail mit Betrag und Rechnungsnummer, der Abgleich erfolgt über hochgeladene Kontoauszüge gegen `bank_transactions`. Das Modell ist dafür bereits vorbereitet, die Logik kommt in einem späteren Prompt.

## 4. Zugriffsschutz

- Zeilenschutz (RLS) auf jeder einzelnen Tabelle, ohne Ausnahme.
- Keine anonymen Rechte: ausgeloggte Besucher sehen keine Daten.
- Abrechnungstabellen: Lesen und Schreiben nur mit Rolle `voll` — Björn sieht sie technisch gar nicht, nicht nur in der Oberfläche.
- `profiles`: jeder sieht die Namen der Kolleg:innen, ändern darf jede:r nur das eigene Profil.
- `user_roles`: nur lesbar, Änderungen nicht über die App.

## 5. Oberfläche

- `/auth`: Anmeldeseite im bestehenden Designsystem (Sand/Creme, Fraunces/Mulish, Pillen-Buttons, weiche Blob-Formen). E-Mail + Passwort, klare Fehlermeldungen auf Deutsch, sichtbarer Fokus, mobil nutzbar. Kein öffentliches Registrieren.
- `/praxis`: geschützte Startansicht — „Angemeldet als …", Rollenhinweis und Platzhalterkacheln (Kalender, Patienten, Dokumentation; Abrechnung/Einstellungen nur bei Rolle `voll` sichtbar). Abmelden-Schaltfläche.
- Die öffentliche Startseite bleibt unverändert; der Header bekommt einen dezenten Zugang zum internen Bereich.
- Gesundheitsdaten liegen ausschließlich hinter der Anmeldung.

## Technische Details

- Geschützte Routen unter `src/routes/_authenticated/`, der Zugangsschutz kommt aus dem integrationseigenen Layout (Weiterleitung nach `/auth`).
- Datenzugriff im Browser über den generierten Supabase-Client; serverseitige Abfragen später über Server-Funktionen mit Auth-Middleware.
- Rollenprüfung immer serverseitig über die `security definer`-Funktion `has_role`, nie über Client-Zustand.
- Anlage der beiden Mitarbeiter-Konten: Registrierung mit automatischer Bestätigung, danach werden die Rollen gesetzt. Passwörter geben Sie beim ersten Login selbst vor bzw. ändern sie.
