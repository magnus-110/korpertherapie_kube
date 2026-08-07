# Buchung: fester Container, Marketing-Texte, echter Kalender auf der Startseite

## Ziel
Der Buchungsassistent bekommt eine feste Größe (kein Springen zwischen den Schritten), einladende Marketing-Texte statt Anleitungssprache – und funktioniert direkt auf der Startseite, nicht nur als Link.

## Was gebaut wird

### 1. Gemeinsame Wizard-Komponente
Die komplette Buchungslogik aus `/termin` (Anlass → Behandlung → Kalender → Formular → Bestätigung) wandert in eine wiederverwendbare Komponente `src/components/site/BuchungsWizard.tsx`.
- `/termin` nutzt sie in voller Breite.
- Die Startseite nutzt dieselbe Komponente in kompakter Variante – gleiche Funktion, gleiche Buchung, kein Weiterleiten nötig.
- Die Daten (Behandlungsarten, Behandler) lädt die Komponente selbst, damit sie überall ohne Route-Loader läuft.

### 2. Feste Containergröße
- Der Wizard-Bereich bekommt eine feste Mindesthöhe (Desktop ca. 720 px, mobil ca. 640 px), sodass alle Schritte in denselben Rahmen passen und das Layout beim Weiterklicken ruhig bleibt.
- Inhalt scrollt innerhalb des Containers, wenn ein Schritt (z. B. Kalender + Formular) länger wird.
- Die Fortschrittsleiste und der Zurück-Bereich sitzen an fester Position oben, das Wochenraster bekommt eine feste Höhe statt variabler.
- Sanfter Übergang beim Schrittwechsel (kurzes Ein-/Ausblenden), kein Layout-Sprung.

### 3. Marketing-Texte statt Bedienungsanleitung
Neue Überschriften/Untertitel, warm und einladend statt erklärend, z. B.:
- Seite `/termin`: „Zeit für dich – im Kalender wartet schon ein Platz“ mit Untertitel über Ruhe, Zuwendung und Begleitung statt „In drei Schritten zum Termin“.
- Startseiten-Abschnitt: „Der nächste freie Platz kann deiner sein“ statt „Freie Zeiten direkt im Kalender sehen“.
- Schritt-Karten: „Zum ersten Mal hier“ / „Wir machen weiter“ mit Nutzen-orientiertem Text statt Prozessbeschreibung.
- Bestätigungsseite bleibt herzlich formuliert.
Alle Formulierungen bleiben zurückhaltend, ohne Heilversprechen.

### 4. Startseite
`BuchungsTeaser` wird ersetzt: statt Liste der nächsten freien Termine plus Link erscheint der vollständige Buchungscontainer (Marketing-Text links, Wizard rechts bzw. darunter auf Mobil). Der Link „Zum Terminkalender“ bleibt als kleiner Sekundär-Hinweis erhalten.

## Technische Details
- Neue Datei: `src/components/site/BuchungsWizard.tsx` (State-Maschine, Slot-Abruf via `freie_zeiten`, Buchung via `termin_buchen`).
- `src/routes/termin.tsx` wird auf die Komponente reduziert; Loader entfällt oder liefert nur Metadaten.
- `src/components/home/BuchungsTeaser.tsx` rendert die Komponente mit `kompakt`-Flag.
- `src/components/site/WochenKalender.tsx`: feste Rasterhöhe mit internem Scrollbereich, damit Wochenwechsel die Höhe nicht ändert.
- Keine Datenbank-Änderungen.
