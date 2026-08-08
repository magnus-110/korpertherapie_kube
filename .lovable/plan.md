# Nächste Stufe: Rechnungen & Zahlungen

## Ziel
Das Verwaltungs-Backend bekommt eine funktionierende Rechnungs- und Zahlungsverwaltung. Rechnungen werden aus abgehakten Terminen erzeugt, bekommen eine fortlaufende Nummer und können als Zahlungsaufforderung per E-Mail versendet werden. Zahlungen lassen sich manuell oder per Kontoauszug-Upload zuordnen.

## Warum jetzt?
- Die Datenbanktabellen `invoices`, `invoice_items`, `payments` und `bank_transactions` existieren bereits.
- Rechnungen sind bereits in der Patientenakte und Behandlungsepisode sichtbar, aber noch Read-only.
- Ohne Rechnungen fehlt der wirtschaftliche Kern der Praxis.
- Spätere Stufen (Mahnungen, Statistik) bauen darauf auf.

## Was gebaut wird

### 1. Datenbank & Logik
- Trigger/Funktion: Beim Abhaken eines Termins (Status `abgehakt`) wird automatisch eine Rechnung aus der `appointment_type`-Gebühr erzeugt, sofern noch keine Rechnung für diesen Termin existiert.
- Automatische Rechnungsnummer im Schema `R-YYYY-XXXX` (z. B. `R-2026-0001`), thread-sicher über eine Sequenz oder eine zentrale Nummernverwaltungstabelle.
- Falls der Termin noch keiner Episode zugeordnet ist, wird die Rechnung auf Patientenebene erzeugt (ohne `episode_id`).
- Neue Tabelle oder Erweiterung für E-Mail-Log/Versandstatus: `invoice_emails` (optional, mindestens ein Audit-Log-Eintrag).

### 2. Praxis-Backend: Rechnungen (`/praxis/rechnungen`)
- Liste aller Rechnungen mit Filter (offen / bezahlt / angemahnt) und Suche.
- Pro Rechnung: Status, Patient, Datum, Betrag, Aktionen (als E-Mail senden, als bezahlt markieren, Details öffnen).
- Rechnungs-Detail-Dialog oder -Seite mit Positionen und Versand-Historie.
- Button „Rechnung per E-Mail senden“: Erzeugt eine Text-E-Mail mit Betrag und Rechnungsnummer als Verwendungszweck (kein Zahlungslink, da kein Stripe o. Ä.).

### 3. Patienten- & Episode-Ansicht erweitern
- In der Patientenakte und in der Behandlungsepisode kann manuell eine Rechnung angelegt werden.
- Abgehakte Termine ohne Rechnung bekommen einen „Rechnung erstellen“-Button.
- Sichtbarer Zahlungsstatus pro Rechnung.

### 4. Zahlungen (`/praxis/zahlungen`)
- Liste eingehender Zahlungen (`payments` + ggf. `bank_transactions`).
- Manuelle Zahlungserfassung: Betrag, Datum, zugeordnete Rechnung.
- Automatische Zuordnung per Kontoauszug-Upload (CSV/MT940, vorerst einfacher CSV-Import): Betrag + Verwendungszweck parsen, Rechnungsnummer erkennen, Vorschläge anzeigen, Bestätigung durch Team.
- Offene Differenzen (z. B. zu viel/zu wenig) werden als „Zu klären“ markiert.

### 5. Rechnungs-Status-Automatik
- Wenn eine Zahlung den Rechnungsbetrag deckt, wird die Rechnung auf `bezahlt` gesetzt.
- Teilzahlungen werden als Restbetrag angezeigt.
- Überfällige Rechnungen können manuell auf `angemahnt` gesetzt werden (Mahnungen-Seite bleibt Platzhalter, aber der Status ist schon nutzbar).

### 6. Sicherheit & Rollen
- Rechnungen und Zahlungen sind nur für die Rolle `verwaltung` sichtbar und bearbeitbar (`nurVerwaltung`).
- Behandler sehen diese Bereiche nicht (wie aktuell bei den Platzhaltern bereits vorgesehen).
- RLS-Policies werden so angepasst, dass nur `verwaltung` und `service_role` schreiben dürfen.

## Was bewusst noch nicht kommt
- Keine PDF-Generierung (zunächst E-Mail-Text).
- Keine automatischen Mahnungen/Mahngebühren (Status `angemahnt` manuell setzbar; Mahn-Seite bleibt Platzhalter).
- Keine Versicherungsabrechnung oder goÄ-Ziffern.
- Keine Stripe-/PayPal-Anbindung (per Anforderung nur Überweisung auf Praxiskonto).

## Erwarteter Nutzen
- Sabrina kann nach einer Behandlung mit einem Klick die Rechnung erzeugen und per E-Mail senden.
- Eingehende Überweisungen lassen sich dem Termin / der Rechnung zuordnen.
- Offene Posten sind jederzeit sichtbar.
- Solide Basis für die spätere Mahn- und Auswertungsstufe.
