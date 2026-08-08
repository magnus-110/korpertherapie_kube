import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { endOfDay, format, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { nurTeam } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";

type Termin = {
  id: string;
  start: string;
  ende: string;
  status: string;
  ist_intern: boolean;
  patient_id: string | null;
  patients: { name: string } | null;
  appointment_types: { name: string } | null;
  practitioners: { name: string; farbe: string } | null;
};

export const Route = createFileRoute("/_authenticated/praxis/heute")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  loader: async () => {
    const jetzt = new Date();
    const { data } = await supabase
      .from("appointments")
      .select(
        "id, start, ende, status, ist_intern, patient_id, patients(name), appointment_types(name), practitioners(name, farbe)",
      )
      .gte("start", startOfDay(jetzt).toISOString())
      .lte("start", endOfDay(jetzt).toISOString())
      .order("start");
    return { termine: (data ?? []) as unknown as Termin[] };
  },
  head: () => ({ meta: [{ title: "Heute · Praxis Kube" }] }),
  component: HeuteSeite,
});


function HeuteSeite() {
  const { termine } = Route.useLoaderData() as { termine: Termin[] };
  const { behandler } = Route.useRouteContext();

  const naechster = termine.find((t) => new Date(t.start) >= new Date()) ?? null;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">
            Guten Tag{behandler ? `, ${behandler.name.split(" ")[0]}` : ""}
          </p>
          <h1 className="font-display text-2xl font-semibold text-primary">Dein Tag</h1>
        </div>
        <Button variant="pill" size="pillSm">
          <CalendarPlus className="size-4" aria-hidden="true" /> Termin
        </Button>
      </div>

      {naechster ? (
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-soft-md)]">
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-sage">Als Nächstes</p>
          <p className="mt-2 font-display text-3xl">{format(new Date(naechster.start), "HH:mm")}</p>
          <p className="mt-1 font-display text-xl">{naechster.patients?.name ?? "Ohne Patient"}</p>
          <p className="mt-1 text-sm text-sage">
            {naechster.appointment_types?.name ?? "Ohne Behandlungsart"}
          </p>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="font-display text-xl text-primary">Heute steht nichts an</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Sobald Termine im Kalender stehen, siehst du hier den nächsten mit allem, was du zur
            Vorbereitung brauchst.
          </p>
        </section>
      )}

      <h2 className="mt-9 mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-secondary">
        {format(new Date(), "EEEE, d. MMMM", { locale: de })}
      </h2>

      {termine.length === 0 ? (
        <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
          Keine Termine eingetragen.
        </p>
      ) : (
        <ul className="grid gap-2">
          {termine.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-4 rounded-xl bg-card px-4 py-3"
              style={{ borderLeft: `3px solid ${t.practitioners?.farbe ?? "#8FB3A4"}` }}
            >
              <span className="w-12 text-sm font-semibold text-primary">
                {format(new Date(t.start), "HH:mm")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-primary">
                {t.patients?.name ?? "—"} · {t.appointment_types?.name ?? "—"}
              </span>
              {t.status === "abgehakt" ? (
                <span className="text-xs text-muted-foreground">erledigt</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
