# Website mit Unterseiten

Aus der bisherigen Ein-Seiten-Startseite wird eine Website mit fünf Seiten im bestehenden Kube-Design (Sand/Creme, Tannen- und Salbeigrün, Fraunces/Mulish, Pillen-Buttons, Blobs).

## Seitenstruktur

- `/` Startseite – Hero, Willkommen, Unser Ansatz (3 Werte), Therapien-Teaser (4 Karten mit Links), Team-Teaser, Ruhe-Band mit Zitat, Abschluss-Aufruf mit Telefon
- `/therapien` – Kopfbereich mit Sprung-Menü, Abschnitte Osteopathie, Psychotherapie (HeilprG, inkl. Hinweiskasten Privatleistung), Labor & Nährstoffanalyse, Sportheilkunde, Ergänzende Therapien, Abschluss-Aufruf
- `/ueber-uns` – Einleitung, Profile Sabrina und Björn (mit `[…]`-Platzhaltern für Aus- und Weiterbildungen), „Warum Selbstfürsorge dazugehört", Platzhalterfläche für die Fotogalerie
- `/kontakt` – Adresse/Telefon/E-Mail/Termine/Instagram, Hinweis für frühe Termine, Platzhalterfläche für die Karte, Kontaktformular, FAQ als Akkordeon, Abschluss-Aufruf
- `/termin` – „In wenigen Schritten zum Termin": Behandlung wählen, dann Kalenderansicht mit freien Zeiten

Pflichtseiten mit Platzhaltertexten und Footer-Links: `/impressum`, `/datenschutz`, `/widerruf`, `/sitemap`.

## Navigation

Header: Startseite · Therapien · Über uns · Kontakt – dazu auf jeder Seite an gleicher Stelle der Button **Termin buchen** (führt zu `/termin`) sowie der bestehende „Intern"-Link. Mobile Navigation über das bestehende Sheet. Footer mit Adresse, Seitenlinks und Pflichtseiten.

## Terminseite (Kalender)

Schritt 1: Auswahl der Behandlungsart. Schritt 2: Kalender (shadcn `Calendar`) mit Tagesauswahl und Liste der freien Zeitfenster für den gewählten Tag. Die Zeiten werden aus den Praxis-Öffnungszeiten und der Dauer der Behandlung berechnet und mit bereits belegten Terminen abgeglichen. Der eigentliche Buchungsabschluss (Patientendaten speichern, Termin anlegen, Bestätigung) folgt in einem späteren Schritt – hier zunächst die Auswahl mit Hinweis „Buchung folgt in Kürze".

## Kontaktformular

Neue Tabelle `contact_requests` (Name, E-Mail, Telefon optional, Nachricht, Status, Zeitpunkt) mit RLS: Anlegen durch Website-Besucher erlaubt, Lesen und Bearbeiten nur für angemeldete Mitarbeiter:innen. Validierung mit Zod (Pflichtfelder, Längenlimits, E-Mail-Format), Erfolgs- und Fehlermeldung per Toast.

## Technische Hinweise

- Ein Routen-Datei pro Seite unter `src/routes/`, gemeinsame Kopf-/Fußzeile bleibt in `SiteHeader`/`SiteFooter`.
- Jede Seite bekommt eigene `head()`-Metadaten (Titel, Beschreibung, og:title, og:description) auf Deutsch; JSON-LD `MedicalBusiness` bleibt auf der Startseite.
- Bestehende Sektionskomponenten werden aufgeteilt und neu getextet; wiederverwendbare Bausteine: `PageHero`, `CtaBand`, `TherapySection`.
- Formulareintrag über eine TanStack-Server-Funktion; kein Zugriff mit Service-Role im Frontend.
- Vorsichtige Formulierungen bei Heilaussagen („kann helfen", „unterstützt"), semantisches HTML, eine H1 pro Seite, sichtbarer Fokus, responsiv.

## Noch offen (Platzhalter im Text)

E-Mail-Adresse, Aus- und Weiterbildungen, Behandlungsdauer, Absagefrist, Mitzubringendes, Parkplatz-Hinweis, Praxisfotos.
