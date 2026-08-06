import { useMemo, useState } from "react";
import { addDays, format, isBefore, parseISO, startOfWeek } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Slot = { start_zeit: string; end_zeit: string };

const STUNDE_VON = 7;
const STUNDE_BIS = 20;
const ZEILE = 52; // Pixel je Stunde

/**
 * Wochenraster mit freien Zeiten. Eine Spalte je Tag, die Termine der
 * zuständigen Person liegen als anklickbare Kacheln auf der Zeitachse.
 */
export function WochenKalender({
  slots,
  spalte,
  gewaehlt,
  onWaehlen,
  kompakt = false,
}: {
  slots: Slot[];
  spalte: string;
  gewaehlt?: string | null;
  onWaehlen?: (start: string) => void;
  kompakt?: boolean;
}) {
  const heute = new Date();
  const [wochenStart, setWochenStart] = useState(() => startOfWeek(heute, { weekStartsOn: 1 }));
  const tage = useMemo(
    () => Array.from({ length: kompakt ? 5 : 7 }, (_, i) => addDays(wochenStart, i)),
    [wochenStart, kompakt],
  );

  const proTag = useMemo(() => {
    const karte = new Map<string, Slot[]>();
    for (const s of slots) {
      const tag = format(parseISO(s.start_zeit), "yyyy-MM-dd");
      karte.set(tag, [...(karte.get(tag) ?? []), s]);
    }
    return karte;
  }, [slots]);

  const hoehe = (STUNDE_BIS - STUNDE_VON) * ZEILE;

  return (
    <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-soft-md)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">{spalte}</p>
          <p className="font-display text-lg text-primary">
            {format(wochenStart, "d. MMMM", { locale: de })} –{" "}
            {format(addDays(wochenStart, 6), "d. MMMM yyyy", { locale: de })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="pillOutline"
            size="pillSm"
            disabled={isBefore(addDays(wochenStart, -7), startOfWeek(heute, { weekStartsOn: 1 }))}
            onClick={() => setWochenStart(addDays(wochenStart, -7))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Woche</span>
          </Button>
          <Button
            variant="pillOutline"
            size="pillSm"
            onClick={() => setWochenStart(addDays(wochenStart, 7))}
          >
            <span className="sr-only sm:not-sr-only">Woche</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid gap-1"
          style={{
            minWidth: kompakt ? 420 : 620,
            gridTemplateColumns: `44px repeat(${tage.length}, 1fr)`,
          }}
        >
          <div />
          {tage.map((t) => (
            <div key={t.toISOString()} className="pb-2 text-center">
              <p className="text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">
                {format(t, "EEEEEE", { locale: de })}
              </p>
              <p className="text-sm text-primary">{format(t, "d.M.")}</p>
            </div>
          ))}

          <div>
            {Array.from({ length: STUNDE_BIS - STUNDE_VON }, (_, i) => (
              <div
                key={i}
                className="text-right text-[0.65rem] text-muted-foreground"
                style={{ height: ZEILE }}
              >
                {String(STUNDE_VON + i).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {tage.map((tag) => {
            const tagesSlots = proTag.get(format(tag, "yyyy-MM-dd")) ?? [];
            return (
              <div
                key={tag.toISOString()}
                className="relative rounded-xl bg-background/70"
                style={{ height: hoehe }}
              >
                {Array.from({ length: STUNDE_BIS - STUNDE_VON }, (_, i) => (
                  <div
                    key={i}
                    className="absolute inset-x-0 border-t border-border/50"
                    style={{ top: i * ZEILE, height: ZEILE }}
                    aria-hidden="true"
                  />
                ))}

                {tagesSlots.map((s) => {
                  const start = parseISO(s.start_zeit);
                  const ende = parseISO(s.end_zeit);
                  const top =
                    ((start.getHours() - STUNDE_VON) * 60 + start.getMinutes()) * (ZEILE / 60);
                  const h = Math.max(
                    ((ende.getTime() - start.getTime()) / 60000) * (ZEILE / 60) - 2,
                    20,
                  );
                  const aktiv = gewaehlt === s.start_zeit;
                  return (
                    <button
                      key={s.start_zeit}
                      type="button"
                      disabled={!onWaehlen}
                      onClick={() => onWaehlen?.(s.start_zeit)}
                      className={`absolute inset-x-0.5 overflow-hidden rounded-lg px-1.5 py-1 text-[0.7rem] font-semibold leading-tight transition-colors ${
                        aktiv
                          ? "bg-primary text-primary-foreground"
                          : "bg-sage/35 text-primary hover:bg-sage/60"
                      } ${onWaehlen ? "" : "cursor-default"}`}
                      style={{ top, height: h }}
                    >
                      {format(start, "HH:mm")}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block size-3 rounded bg-sage/50" aria-hidden="true" /> freie Zeiten
        – klicke auf eine Kachel
      </p>
    </div>
  );
}
