import { Link } from "@tanstack/react-router";
import { CalendarDays, Heart, Leaf } from "lucide-react";
import { BuchungsWizard } from "@/components/site/BuchungsWizard";

/**
 * Buchung direkt auf der Startseite: derselbe Assistent wie auf /termin,
 * in kompakter Variante mit fester Containerhöhe.
 */
export function BuchungsTeaser() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="termin-teaser">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="grid gap-8 rounded-[2.25rem] bg-creme p-6 shadow-[var(--shadow-soft-md)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Termin</p>
            <h2 id="termin-teaser" className="text-[clamp(1.7rem,3.4vw,2.4rem)]">
              Der nächste freie Platz kann deiner sein
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg">
              Manchmal ist der schwerste Schritt der erste. Hier ist er leicht: Zeit aussuchen,
              eintragen, ankommen – den Rest übernehmen wir.
            </p>

            <ul className="mt-6 space-y-3 text-[0.95rem] text-primary">
              <li className="flex items-start gap-3">
                <Leaf className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                Ruhige Praxis in Gersthofen, viel Zeit pro Termin
              </li>
              <li className="flex items-start gap-3">
                <Heart className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                Persönliche Begleitung – ohne Hektik, ohne Druck
              </li>
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                Freie Zeiten live im Kalender, sofort buchbar
              </li>
            </ul>

            <Link
              to="/termin"
              className="mt-6 inline-flex text-sm font-semibold text-secondary underline underline-offset-4"
            >
              Lieber auf einer eigenen Seite buchen
            </Link>
          </div>

          <BuchungsWizard kompakt />
        </div>
      </div>
    </section>
  );
}
