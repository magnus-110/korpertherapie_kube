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
              Termin buchen
            </h2>
            <p className="mt-4 max-w-[46ch] text-lg">
              Freie Zeiten direkt aussuchen – in wenigen Klicks.
            </p>
          </div>

          <BuchungsWizard kompakt />
        </div>
      </div>
    </section>
  );
}
