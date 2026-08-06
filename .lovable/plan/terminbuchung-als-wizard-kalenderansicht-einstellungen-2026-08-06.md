# Terminbuchung als Wizard + Kalenderansicht + Einstellungen

## Was sich ändert

**1. Behandlungen kommen komplett aus der Verwaltung**
Behandlungsarten liegen bereits in der Datenbank – neu ist, dass die Verwaltung sie selbst pflegen kann. Ergänzt wird ein Feld "Erstbehandlung / Folgetermin", damit der Buchungs-Wizard danach filtern kann.

**2. Buchung als Wizard (3 Schritte)**
- Schritt 1: Erstbehandlung oder Folgetermin?
- Schritt 2: Welche Behandlungsart? (nur passende, jeweils mit Behandler:in und Dauer)
- Schritt 3: Wochenkalender mit freien Zeiten – eine Spalte, nämlich die des Behandlers, der zur Terminart gehört. Danach Kontaktdaten und Bestätigung.
Fortschrittsanzeige oben, Zurück-Schritte jederzeit möglich.

**3. Kalenderansicht statt Slot-Liste**
Öffentliche Buchung zeigt ein Wochenraster (Uhrzeiten links, Tage oben). Freie Zeiten sind anklickbare Kacheln, belegte Zeiten bleiben leer/grau. Wochenwechsel per Pfeilen. Auf Mobil wird das Raster horizontal scrollbar.

**4. Sichtbarer Buchungs-Einstieg**
- Auf der Terminseite ist von Anfang an ein kalenderartiges Vorschaubild/Raster zu sehen, damit klar ist: hier wird gebucht.
- Auf der Startseite kommt ein Buchungs-Block direkt unter den Hero: kompakte Wochenvorschau der nächsten freien Zeiten mit "Termin buchen".

**5. Praxiskalender mit zwei Spalten**
Der interne Kalender (Verwaltung und Behandler) zeigt pro Tag zwei Spalten – Björn und Sabrina – statt aller Termine übereinander. Wochenansicht bleibt, Farben pro Behandler bleiben.

**6. Einstellungen für die Verwaltung**
Neue Seite mit drei Bereichen:
- Behandler:innen (Name, Kürzel, Bezeichnung, Farbe, aktiv)
- Terminarten (Name, Kurztext, Behandler:in, Dauer, Erst-/Folgetermin, online buchbar, aktiv, Reihenfolge)
- Öffnungszeiten je Behandler:in (Wochentag, von–bis) plus Vorlaufzeit, Buchungsfenster, Raster und Puffer

## Technische Umsetzung

- Migration: Enum `appointment_kind` ('erstbehandlung','folgetermin'), Spalte `art_kategorie` auf `appointment_types` (Default 'folgetermin'), bestehende Zeilen sinnvoll vorbelegen. Keine weiteren Schemaänderungen nötig – `practitioners`, `availability_rules`, `booking_settings` existieren bereits mit passenden RLS-Policies.
- Öffentliche Buchung nutzt weiterhin `freie_zeiten` und `termin_buchen` (SECURITY DEFINER), Slots werden clientseitig in ein Wochenraster einsortiert.
- Neue Komponenten: `src/components/site/BuchungsWizard.tsx`, `src/components/site/WochenKalender.tsx` (geteilt für Startseiten-Teaser und Terminseite), `src/components/praxis/EinstellungenFormulare.tsx`.
- `src/routes/termin.tsx` wird auf den Wizard umgestellt; `src/routes/_authenticated/praxis/einstellungen.tsx` ersetzt den Platzhalter; `src/routes/_authenticated/praxis/kalender.tsx` bekommt Zwei-Spalten-Raster.
- Schreibzugriff in den Einstellungen über den Supabase-Client unter bestehenden `is_verwaltung()`-Policies.

## Offen
Die Zuordnung, welche bestehenden Terminarten Erstbehandlung sind, setze ich anhand des Namens vor – in den Einstellungen jederzeit änderbar.
