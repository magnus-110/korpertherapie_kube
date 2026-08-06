import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { de } from "date-fns/locale";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nurTeam } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";
import { TerminDialog } from "@/components/praxis/TerminDialog";

const STUNDE_VON = 7;
const STUNDE_BIS = 19;
const ZEILE = 56; // Pixel je Stunde

export const Route = createFileRoute("/_authenticated/praxis/kalender")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  validateSearch: (s: Record<string, unknown>): { woche?: string | undefined } => ({
    woche: typeof s["woche"] === "string" ? s["woche"] : undefined,
  }),
  loaderDeps: ({ search }) => ({ woche: search.woche }),
  loader: async ({ deps }) => {
    const start = deps.woche
      ? startOfWeek(new Date(deps.woche), { weekStartsOn: 1 })
      : startOfWeek(new Date(), { weekStartsOn: 1 });
    const ende = addDays(start, 7);

    const [termine, behandler, arten, patienten] = await Promise.all([
      supabase
        .from("appointments")
        .select(
          "id, start, ende, status, ist_intern, quelle, anliegen, patient_id, type_id, practitioner_id, patients(name), appointment_types(name)",
        )
        .gte("start", start.toISOString())
        .lt("start", ende.toISOString())
        .order("start"),
      supabase
        .from("practitioners")
        .select("id, name, kuerzel, farbe")
        .eq("aktiv", true)
        .order("sortierung"),
      supabase
        .from("appointment_types")
        .select("id, name, practitioner_id, dauer_minuten")
        .eq("aktiv", true)
        .order("sortierung"),
      supabase.from("patients").select("id, name").order("name"),
    ]);

    return {
      wochenstart: start.toISOString(),
      termine: termine.data ?? [],
      behandler: behandler.data ?? [],
      arten: arten.data ?? [],
      patienten: patienten.data ?? [],
    };
  },
  head: () => ({ meta: [{ title: "Kalender · Praxis Kube" }] }),
  component: KalenderSeite,
});

function KalenderSeite() {
  const daten = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const start = new Date(daten.wochenstart);
  const tage = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const [dialog, setDialog] = useState<{ zeitpunkt?: Date; terminId?: string } | null>(null);

  function wechsle(anzahl: number) {
    void navigate({ search: { woche: addDays(start, anzahl).toISOString().slice(0, 10) } });
  }

  async function abhaken(id: string, erledigt: boolean) {
    const { error } = await supabase
      .from("appointments")
      .update({ status: erledigt ? "abgehakt" : "geplant" })
      .eq("id", id);
    if (error) {
      toast.error("Konnte nicht gespeichert werden");
      return;
    }
    toast.success(erledigt ? "Als stattgefunden markiert" : "Wieder als geplant markiert");
    void router.invalidate();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-primary">Kalender</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(start, "d. MMMM", { locale: de })} –{" "}
            {format(addDays(start, 6), "d. MMMM yyyy", { locale: de })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="pillOutline" size="pillSm" onClick={() => wechsle(-7)}>
            <ChevronLeft className="size-4" aria-hidden="true" /> Woche
          </Button>
          <Button variant="pillOutline" size="pillSm" onClick={() => void navigate({ search: {} })}>
            Heute
          </Button>
          <Button variant="pillOutline" size="pillSm" onClick={() => wechsle(7)}>
            Woche <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="pill" size="pillSm" onClick={() => setDialog({ zeitpunkt: new Date() })}>
            <Plus className="size-4" aria-hidden="true" /> Termin
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        {daten.behandler.map((b) => (
          <span key={b.id} className="flex items-center gap-2 text-sm text-primary">
            <span
              className="size-3 rounded-full"
              style={{ background: b.farbe }}
              aria-hidden="true"
            />
            {b.name}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-card p-3">
        <div className="grid min-w-[720px] grid-cols-[52px_repeat(7,1fr)] gap-1">
          <div />
          {tage.map((t) => {
            const heute = format(t, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <div key={t.toISOString()} className="pb-2 text-center">
                <p
                  className={`text-xs ${heute ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {format(t, "EEEEEE", { locale: de })}
                </p>
                <p className={`text-sm ${heute ? "font-bold text-primary" : "text-primary"}`}>
                  {format(t, "d.M.")}
                </p>
              </div>
            );
          })}

          <div>
            {Array.from({ length: STUNDE_BIS - STUNDE_VON }, (_, i) => (
              <div
                key={i}
                className="text-right text-[0.7rem] text-muted-foreground"
                style={{ height: ZEILE }}
              >
                {String(STUNDE_VON + i).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {tage.map((tag) => {
            const tagesTermine = daten.termine.filter(
              (t) => format(new Date(t.start), "yyyy-MM-dd") === format(tag, "yyyy-MM-dd"),
            );
            return (
              <div
                key={tag.toISOString()}
                className="relative rounded-lg bg-background/60"
                style={{ height: (STUNDE_BIS - STUNDE_VON) * ZEILE }}
              >
                {Array.from({ length: STUNDE_BIS - STUNDE_VON }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="absolute inset-x-0 border-t border-border/60 transition-colors hover:bg-accent/50"
                    style={{ top: i * ZEILE, height: ZEILE }}
                    onClick={() => {
                      const d = new Date(tag);
                      d.setHours(STUNDE_VON + i, 0, 0, 0);
                      setDialog({ zeitpunkt: d });
                    }}
                    aria-label={`Termin am ${format(tag, "d.M.")} um ${STUNDE_VON + i} Uhr anlegen`}
                  />
                ))}

                {tagesTermine.map((t) => {
                  const s = new Date(t.start);
                  const e = new Date(t.ende);
                  const top = ((s.getHours() - STUNDE_VON) * 60 + s.getMinutes()) * (ZEILE / 60);
                  const hoehe = Math.max(
                    ((e.getTime() - s.getTime()) / 60000) * (ZEILE / 60) - 2,
                    22,
                  );
                  const farbe =
                    daten.behandler.find((b) => b.id === t.practitioner_id)?.farbe ?? "#8FB3A4";
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDialog({ terminId: t.id })}
                      className={`absolute inset-x-0.5 overflow-hidden rounded-md px-2 py-1 text-left text-[0.7rem] leading-tight text-creme transition-opacity hover:opacity-90 ${
                        t.status === "abgehakt" ? "opacity-60" : ""
                      }`}
                      style={{ top, height: hoehe, background: farbe }}
                    >
                      <span className="block font-semibold">{format(s, "HH:mm")}</span>
                      <span className="block truncate">{t.patients?.name ?? "—"}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-[0.68rem] uppercase tracking-[0.14em] text-secondary">
        Termine dieser Woche
      </h2>
      {daten.termine.length === 0 ? (
        <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
          Keine Termine in dieser Woche.
        </p>
      ) : (
        <ul className="grid gap-2">
          {daten.termine.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-card px-4 py-3"
              style={{
                borderLeft: `3px solid ${daten.behandler.find((b) => b.id === t.practitioner_id)?.farbe ?? "#8FB3A4"}`,
              }}
            >
              <span className="w-32 text-sm text-primary">
                {format(new Date(t.start), "EEEEEE, d.M. HH:mm", { locale: de })}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-primary">
                {t.patients?.name ?? "—"} · {t.appointment_types?.name ?? "—"}
                {t.quelle === "online" ? (
                  <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] text-primary">
                    online gebucht
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => void abhaken(t.id, t.status !== "abgehakt")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-primary transition-colors hover:bg-accent"
              >
                {t.status === "abgehakt" ? (
                  <>
                    <X className="size-3.5" aria-hidden="true" /> zurücknehmen
                  </>
                ) : (
                  <>
                    <Check className="size-3.5" aria-hidden="true" /> abhaken
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {dialog ? (
        <TerminDialog
          zeitpunkt={dialog.zeitpunkt}
          termin={daten.termine.find((t) => t.id === dialog.terminId) ?? null}
          behandler={daten.behandler}
          arten={daten.arten}
          patienten={daten.patienten}
          onClose={() => setDialog(null)}
          onGespeichert={() => {
            setDialog(null);
            void router.invalidate();
          }}
        />
      ) : null}
    </div>
  );
}
