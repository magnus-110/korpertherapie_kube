# Buchung mit Konto: Anmeldung im Pop-up

Ein Klick auf eine freie Zeit im Kalender öffnet ab sofort ein Pop-up (Dialog) statt eines Formulars unterhalb des Kalenders. Darin meldet sich der Patient an oder legt ein Konto an – erst danach wird der Termin gebucht. Jede Buchung gehört damit zu einem Konto.

## Ablauf im Pop-up

```text
Klick auf Zeit
      │
      ├─ nicht angemeldet ──▶ Tabs: [Anmelden] [Konto anlegen]
      │                              │
      │                              └─ Konto sofort aktiv, direkt weiter
      │
      └─ angemeldet ──▶ Zusammenfassung + Anliegen + Datenschutz
                                   │
                                   └─ "Verbindlich buchen" ──▶ Bestätigung im Pop-up
```

- Kopf des Pop-ups zeigt immer Behandlung, Behandler:in, Datum und Uhrzeit.
- Konto anlegen fragt: Name, E-Mail, Passwort, Telefon, Geburtsdatum, Straße, PLZ, Ort.
- Anmelden fragt nur E-Mail und Passwort, dazu ein Link „Passwort vergessen“.
- Wichtig: Die Anmeldung im Pop-up leitet nirgendwohin weiter. Der Nutzer bleibt auf der Seite, das Pop-up springt direkt zum Buchungsabschluss.
- Nach erfolgreicher Buchung: Bestätigung im Pop-up, danach schließt es und der Wizard zeigt den Erfolgszustand.
- Fehler (Zeit inzwischen vergeben, falsches Passwort, E-Mail bereits vergeben) werden im Pop-up angezeigt, der gewählte Slot bleibt erhalten.

## Konten

- Registrierung aktiviert das Konto sofort (Auto-Bestätigung), damit die Buchung nicht unterbrochen wird.
- Beim Anlegen entsteht automatisch eine Patientenakte, die mit dem Konto verknüpft ist; bereits vorhandene Akten mit derselben E-Mail werden übernommen statt doppelt angelegt.
- Neue Konten erhalten die Rolle „Patient“ – kein Zugriff auf den Praxisbereich.
- Team-Konten (Sabrina, Björn) können sich hier ebenfalls anmelden und für sich selbst buchen; ihre Rechte ändern sich nicht.

## Zwei Wege in denselben Account

- **Buchen:** Anmeldung im Pop-up → nur Buchung, keine Weiterleitung.
- **„Intern“ oben rechts:** führt auf die Anmeldeseite. Nach dem Login landet ein Patient in seinem persönlichen Bereich, Team-Konten wie bisher im Praxisbereich.

## Persönlicher Bereich für Patienten

- Neue geschützte Seite „Mein Bereich“ mit zwei Abschnitten:
  - **Termine:** kommende und vergangene Termine mit Behandlung, Behandler:in, Datum und Uhrzeit.
  - **Rechnungen:** Rechnungsnummer, Datum, Betrag und Status (offen, bezahlt, angemahnt) inklusive Zahlungshinweis mit Bankverbindung.
- Platzhalter-Abschnitt „Fragebogen“ ist vorbereitet, aber in diesem Schritt noch leer.
- Fragebogen später: wird automatisch 3 Tage nach dem Termin freigeschaltet – das wird jetzt nur vorgesehen, nicht gebaut.


## Datenbank

- `patients` bekommt `geburtsdatum`, `strasse`, `plz`, `ort`.
- Neue Funktion `termin_buchen_konto(_behandlungsart, _start, _anliegen)`: bucht ausschließlich für den angemeldeten Nutzer, prüft den Slot erneut gegen `freie_zeiten` und legt bei Bedarf die Patientenakte an. Die alte Gast-Funktion `termin_buchen` wird entfernt, damit keine Buchung ohne Konto mehr möglich ist.
- Trigger `handle_new_user` erweitert: legt zusätzlich Rolle „patient“ und die Patientenakte mit den Registrierungsdaten an (Daten kommen aus den Metadaten der Registrierung).
- Registrierungsdaten werden serverseitig mit Zod geprüft (Längenlimits, E-Mail-Format).

## Technische Umsetzung

- Neue Komponente `src/components/site/BuchungsDialog.tsx` auf Basis von shadcn `Dialog`; enthält Anmelden/Registrieren-Tabs und den Buchungsabschluss.
- `BuchungsWizard.tsx`: Formularblock unterhalb des Kalenders entfällt; `onWaehlen` öffnet den Dialog. Der feste Container und die Höhen bleiben unverändert.
- Sitzung über `supabase.auth.getUser()` plus `onAuthStateChange`; Registrierung mit `signUp` inkl. `options.data` für Name, Telefon, Geburtsdatum und Adresse.
- Auto-Bestätigung der E-Mail wird in den Auth-Einstellungen aktiviert.
- Neue Route `src/routes/_authenticated/meine-termine.tsx` (Rolle Patient) sowie Anpassung von `SiteHeader.tsx` für den sitzungsabhängigen Link.
