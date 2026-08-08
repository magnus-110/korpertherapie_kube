# Nächste Stufe: Patientenakten

Nach dem aktuellen Stand stehen Buchung, öffentliche Website und Team-Kalender. Die nächste sinnvolle Stufe ist die **Patientenübersicht** (`/praxis/patienten`), weil sie für Termine, Rechnungen und Behandlungsverlauf die gemeinsame Basis liefert.

## Ziel

Der Platzhalter unter `/praxis/patienten` wird durch eine echte, übersichtliche Patientenverwaltung ersetzt. Sie ist für Verwaltung und Behandler zugänglich, aber bewusst schlicht – ohne medizinische Dokumentation oder komplexe Historie.

## Was gebaut wird

- **Patientenliste**: Suchbare Liste aller Patienten mit Name, E-Mail, Telefon und letztem Termin.
- **Patienten-Detailansicht**: Stammdaten bearbeiten (Name, E-Mail, Telefon, Geburtsdatum, Adresse, Notizen).
- **Termine der Person**: Kommende und vergangene Termine direkt im Profil sichtbar.
- **Schnellaktionen**: Neuer Termin für diese Patientin/diesen Patienten anlegen.
- **Neuanlage**: Eine neue Patientenakte direkt aus der Liste anlegen – nützlich für Telefon-Anmeldungen.

## Technische Umsetzung

- Daten kommen aus der bestehenden Tabelle `public.patients`.
- Richtlinien (RLS) existieren bereits: Team darf lesen und schreiben, Patienten sehen nur ihre eigenen Daten.
- Neue Route `/praxis/patienten/$patientId` für die Detailansicht.
- Formulare mit einfachen Validierungen (Pflichtfelder, E-Mail-Format).
- Keine Datei-Uploads, keine medizinische Dokumentation, keine Rechnungserstellung in dieser Stufe.

## Was danach kommen kann

Sobald Patientenakten stehen, lassen sich sinnvoll anschließen:
1. **Rechnungen** aus abgehakten Terminen erzeugen.
2. **Kontaktanfragen** aus der Website bearbeiten.
3. **Zahlungen und Mahnungen** anbinden.

## Abgrenzung

- Keine vollständige Krankenakte oder Behandlungsdokumentation.
- Keine Integration von Rechnungen oder Zahlungen in diesem Schritt.
- Kein Newsletter- oder E-Mail-Versand.
