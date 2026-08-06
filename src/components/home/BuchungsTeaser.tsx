import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { addDays, format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarDays, Repeat, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Slot = { start_zeit: string; end_zeit: string };

/**
 * Sichtbarer Einstieg in die Terminbuchung direkt auf der Startseite:
 * die nächsten freien Zeiten als kleine Vorschau, dahinter der Assistent.
 */
export function BuchungsTeaser() {
  const [slots, setSlots] = useState<Slot[] | null>(null);

  useEffect(() => {
    let abgebrochen = false;
    void (async () => {
      const { data: arten } = await supabase
        .from("appointment_types")
        .select("id")
        .eq("aktiv", true)
        .eq("online_buchbar", true)
        .order("sortierung")
        .limit(1);
      const ersteArt = arten?.[0]?.id;
      if (!ersteArt) {
        if (!abgebrochen) setSlots([]);
        return;
      }
      const heute = new Date();
      const { data } = await supabase.rpc("freie_zeiten", {
        _behandlungsart: ersteArt,
        _von: format(heute, "yyyy-MM-dd"),
        _bis: format(addDays(heute, 21), "yyyy-MM-dd"),
      });
      if (!abgebrochen) setSlots(((data as Slot[] | null) ?? []).slice(0, 6));
    })();
    return () => {
      abgebrochen = true;
    };
  }, []);

  return (
    <section className="py-14 sm:py-20" aria-labelledby="termin-teaser">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-creme p-7 shadow-[var(--shadow-soft-md)] sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">Termin buchen</p>
            <h2 id="termin-teaser" className="text-[clamp(1.7rem,3.4vw,2.4rem)]">
              Freie Zeiten direkt im Kalender sehen
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg">
              Sag uns kurz, ob du zum ersten Mal kommst oder die Behandlung fortsetzt. Danach wählst
              du die Behandlung – und siehst sofort den Wochenkalender mit allen freien Zeiten.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-primary">
              <span className="inline-flex items-center gap-2 rounded-full bg-sage/30 px-4 py-2">
                <Sparkles className="size-4" aria-hidden="true" /> Erstbehandlung
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sage/30 px-4 py-2">
                <Repeat className="size-4" aria-hidden="true" /> Folgetermin
              </span>
            </div>

            <Button asChild variant="pill" size="pill" className="mt-7">
              <Link to="/termin">
                <CalendarDays className="size-4" aria-hidden="true" /> Zum Terminkalender
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)]">
            <p className="eyebrow mb-4">Nächste freie Zeiten</p>
            {slots === null ? (
              <div className="grid grid-cols-2 gap-2" aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-sage/20" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Gerade sind keine Zeiten online frei – melde dich einfach telefonisch bei uns.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-2">
                {slots.map((s) => (
                  <li key={s.start_zeit}>
                    <Link
                      to="/termin"
                      className="block rounded-xl bg-sage/25 px-4 py-3 text-center transition-colors hover:bg-sage/45"
                    >
                      <span className="block text-[0.7rem] uppercase tracking-[0.08em] text-secondary">
                        {format(parseISO(s.start_zeit), "EEEEEE, d.M.", { locale: de })}
                      </span>
                      <span className="block font-display text-lg text-primary">
                        {format(parseISO(s.start_zeit), "HH:mm")} Uhr
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
