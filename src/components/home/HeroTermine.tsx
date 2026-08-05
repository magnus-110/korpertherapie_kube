import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";

/** Die nächsten Werktage ab morgen – Samstag und Sonntag werden übersprungen. */
function naechsteWerktage(anzahl: number): Date[] {
  const tage: Date[] = [];
  const lauf = startOfDay(new Date());
  while (tage.length < anzahl) {
    lauf.setDate(lauf.getDate() + 1);
    const wochentag = lauf.getDay();
    if (wochentag !== 0 && wochentag !== 6) tage.push(new Date(lauf));
  }
  return tage;
}

export function HeroTermine() {
  const tage = useMemo(() => naechsteWerktage(3), []);

  return (
    <div className="relative">
      {/* Salbeifläche, leicht versetzt – erzeugt Tiefe ohne Schlagschatten */}
      <div
        className="absolute -left-2 top-3 h-[96%] w-full rounded-[22px] bg-sage opacity-35"
        aria-hidden="true"
      />

      <div className="relative rounded-3xl bg-creme p-6 shadow-[var(--shadow-soft-md)] sm:p-7">
        <p className="eyebrow mb-1.5">Termin</p>
        <h2 className="text-xl sm:text-2xl">Wann passt es dir?</h2>

        <ul className="mt-5 grid gap-2">
          {tage.map((tag, i) => (
            <li key={tag.toISOString()}>
              <Link
                to="/termin"
                search={{ tag: format(tag, "yyyy-MM-dd") }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[0.95rem] font-semibold transition-colors ${
                  i === 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-sage/30 text-primary hover:bg-sage/50"
                }`}
              >
                <span suppressHydrationWarning>
                  {format(tag, "EEEEEE, d. MMMM", { locale: de })}
                </span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="#kalender"
          className="mt-4 inline-block border-b border-secondary/40 pb-0.5 text-[0.9rem] text-secondary transition-colors hover:border-secondary"
        >
          Anderen Tag wählen
        </a>

        <Button asChild variant="pill" size="pill" className="mt-5 w-full">
          <Link to="/termin">Online buchen</Link>
        </Button>
      </div>
    </div>
  );
}
