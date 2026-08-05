# Schritt 1: Designsystem + öffentliche Startseite

Aufbau der visuellen Grundlage der Praxis-Website nach dem beigefügten Entwurf. Kein Backend, keine Datenbank, keine Buchungslogik – nur UI.

## Designsystem (global)

Farben als Design-Tokens (oklch) in `src/styles.css`, hell und dunkel-neutral gehalten:

- Hintergrund Sand `#E9E2D3`, Karten/Flächen Creme `#F5F1E8`
- Primär Tannengrün `#1E3A32`, Sekundär Waldgrün `#2F5249`
- Akzent Salbei `#88A597`, zarter Ton `#D7E1D8`
- Text `#2C2A22`, Erfolg `#3E6E54`, Hinweis `#C79A3B`, Fehler `#B35438`
- Linie/Border `#D8CFBD`

Weiteres:
- Schriften Fraunces (Überschriften) und Mulish (Text/Bedienelemente) über Google-Fonts-`<link>` im Root-Layout, als Tokens `--font-display` / `--font-body`.
- Weiche warme Schatten (`--shadow-sm/md/lg`) und großzügige Radien inkl. Pillen-Buttons als Tokens.
- Button-Varianten `primary` (Pille, Tannengrün) und `ghost` (Outline) über die shadcn-Button-Variants – keine hartcodierten Farbklassen in Komponenten.
- Sichtbarer Tastaturfokus (Outline in Waldgrün) global, `prefers-reduced-motion` respektiert.

## Startseite (`/`)

Ersetzt die Platzhalterseite, Inhalte auf Deutsch, Ton warm und persönlich:

1. **Navigation** – Logo-Marke „KK" + Wortmarke, Links Ansatz / Therapien / Über uns / Kontakt, CTA „Termin buchen"; mobil als Burger-Menü (Sheet).
2. **Hero** – Eyebrow „Privatpraxis für Körper & Seele · Gersthofen", Leit-Überschrift „Tu deinem Körper etwas Gutes, damit deine Seele Lust hat, darin zu wohnen.", Untertext, Buttons „Termin buchen" + „Unsere Therapien", rechts organische Blob-Formen mit rundem Foto-Ausschnitt (Platzhalter).
3. **So arbeiten wir** – drei Karten: Zeit & Ruhe, Ganzheitlich, Auf Augenhöhe.
4. **Therapien** – Karten-Raster: Osteopathie, Psychotherapie, Laboruntersuchungen, Sportheilkunde, je mit kurzer Beschreibung.
5. **Ruhiges Zitat-Band** in Waldgrün mit Blob-Akzent.
6. **Kontakt-Abschnitt** – Adresse Dieselstraße 16, 86368 Gersthofen, Erreichbarkeit, Karte-/CTA-Karte „Termin buchen".
7. **Footer** – Marke, Navigationslinks, Kontakt, Platzhalter für Impressum/Datenschutz.

Der „Termin buchen"-Button ist in diesem Build noch ohne Funktion (Anker zum Kontaktbereich); die echte Online-Terminbuchung folgt mit dem Backend-Schritt.

## Technische Hinweise

- Aufteilung in kleine Komponenten unter `src/components/home/` (Navbar, Hero, Approach, Therapies, QuoteBand, Contact, Footer), Startseite in `src/routes/index.tsx`.
- Logo: das hochgeladene Logo wird als Asset eingebunden und zusätzlich als Favicon gesetzt.
- SEO: eigenes `head()` auf der Startseite mit deutschem Titel, Beschreibung und OG-/Twitter-Metadaten; semantisches HTML, ein `<h1>`, `alt`-Texte.
- Responsiv (ein-, zwei- und dreispaltige Raster je Breakpoint), AA-Kontraste.
- Vorbereitung für später: keine hartverdrahteten Datenquellen; Supabase-Anbindung erfolgt in Schritt 3 ausschließlich über den Standard-Client und Umgebungsvariablen, Gesundheitsdaten dann hinter Login mit RLS.
