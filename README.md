# Körpertherapie_Kube

Projekt-Überblick

Baue die Grundlage für eine ruhige, warme Web-App für eine private Praxis

("Körpertherapie und Psychotherapie Kube", Gersthofen – Osteopathie,

Naturheilkunde, Psychotherapie). Öffentlicher Teil: Info-Website mit

Online-Terminbuchung. Interner Teil (SPÄTER, hinter Login): Kalender,

Dokumentation, Rechnungen, Zahlung, Mahnwesen.

Umfang dieses ersten Builds

NUR Projekt-Setup + globales Designsystem + öffentliche Startseite.

Noch KEIN Backend, KEINE Datenbank. Supabase Cloud wird in einem

späteren Schritt verbunden. UI zuerst.

Tech & Architektur-Prinzipien (durchgehend einhalten)

- React + Tailwind + shadcn/ui.

- Backend später über Supabase (Start auf Supabase Cloud; späterer Umzug

  auf selbst gehostetes Supabase geplant → allen Datenzugriff über den

  Standard-Supabase-Client + Umgebungsvariablen lösen, nichts fest

  verdrahten, damit der Umzug nur Konfiguration ist).

- Privacy by design: Gesundheitsdaten immer hinter Login; sobald die

  Datenbank kommt, Row Level Security auf JEDER Tabelle; service_role-

  Schlüssel NIE im Frontend

Designsystem (exakt so als globales Theme/Tokens in tailwind.config +

index.css anlegen)

Stil-Vibe: hell, warm, ruhig, natürlich, unaufgeregt, vertrauensvoll,

sanft-hochwertig. Kein generischer Standard-Look.

Farben: Hintergrund Sand #E9E2D3; Flächen/Karten Creme #F5F1E8;

Primär Tannengrün #1E3A32; Sekundär Waldgrün #2F5249;

Akzent Salbei #88A597; zarter Ton #D7E1D8; Text #2C2A22;

Erfolg #3E6E54; Hinweis #C79A3B; Fehler #B35438.

Schriften: Überschriften = Fraunces (Serif, warm); Text & Bedien-

elemente = Mulish (Sans). Beide via Google Fonts.

Formen: großzügige Rundungen, Buttons als Pille, weiche warme Schatten,

organische "Blob"-Formen und runde Foto-Ausschnitte als Signatur,

viel Weißraum.

Seitenstruktur (dieser Build = nur Startseite)

- Obere Navigation: Logo "KK" + Links (Therapien, Über uns, Kontakt).

- Hero: warme Überschrift + kurzer Untertext + Primär-Button

  "Termin buchen" + eine organische Blob-Form mit rundem Foto-Platzhalter.

- Kurzer Abschnitt "So arbeiten wir" (ganzheitlich, mit Zeit).

- Therapie-Übersicht als Karten-Raster: Osteopathie, Psychotherapie,

  Laboruntersuchungen, Sportheilkunde.

- Ruhiger Footer mit Kontakt (Dieselstraße 16, 86368 Gersthofen).

Inhalt / Ton (echten deutschen Text verwenden, warm & persönlich)

Leit-Überschrift: "Tu deinem Körper etwas Gutes, damit deine Seele

Lust hat, darin zu wohnen."

Umsetzungs-Reihenfolge

1) Jetzt: globales Designsystem + Startseite.

2) Danach: weitere Seiten (Therapie-Details, Über uns, Kontakt, FAQ).

3) Danach: Supabase Cloud verbinden (Login + Datenbank).

4) Danach: Kalender, Rechnungen, Stripe, Mahnwesen.

Baue jetzt NUR Schritt 1. Responsiv und barrierearm (sichtbarer

Tastatur-Fokus, gute Kontraste).

Hier der inhalt der aktuellen Website: https://www.koerpertherapie-kube.de/
Beigefügt ein entwurf wie es aussehen könnte

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25569b8d-6e8d-4ef1-af90-bb5e8e1b95d6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
