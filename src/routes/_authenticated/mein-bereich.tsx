import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarDays, FileText, HelpCircle, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { praxis } from "@/lib/praxis";

type Termin = {
  id: string;
  start: string;
  status: string;
  appointment_types: { name: string } | null;
  practitioners: { name: string } | null;
};
type Rechnung = {
  id: string;
  rechnungsnummer: string;
  datum: string;
  betrag: number;
  status: string;
};

export const Route = createFileRoute("/_authenticated/mein-bereich")({
  loader: async () => {
    const [termine, rechnungen] = await Promise.all([
      supabase
        .from("appointments")
        .select("id, start, status, appointment_types(name), practitioners(name)")
        .order("start", { ascending: false }),
      supabase
        .from("invoices")
        .select("id, rechnungsnummer, datum, betrag, status")
        .order("datum", { ascending: false }),
    ]);
    return {
      termine: (termine.data ?? []) as unknown as Termin[],
      rechnungen: (rechnungen.data ?? []) as Rechnung[],
    };
  },
  head: () => ({
    meta: [
      { title: "Mein Bereich · Praxis Kube" },
      { name: "description", content: "Deine Termine und Rechnungen bei der Praxis Kube." },
    ],
  }),
  component: MeinBereich,
});

const statusLabel: Record<string, string> = {
  offen: "offen",
  bezahlt: "bezahlt",
  angemahnt: "angemahnt",
};

function MeinBereich() {
  const { termine, rechnungen } = Route.useLoaderData() as {
    termine: Termin[];
    rechnungen: Rechnung[];
  };
  const navigate = useNavigate();
  const jetzt = Date.now();
  const kommend = termine.filter((t: Termin) => new Date(t.start).getTime() >= jetzt).reverse();
  const vergangen = termine.filter((t: Termin) => new Date(t.start).getTime() < jetzt);


  async function abmelden() {
    await supabase.auth.signOut();
    void navigate({ to: "/", replace: true });
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Mein Bereich" title="Deine Termine und Rechnungen">
        <p>Alles Persönliche an einem Ort.</p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[980px] gap-8 px-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="pill" size="pillSm">
              <Link to="/termin">Neuen Termin buchen</Link>
            </Button>
            <Button variant="pillOutline" size="pillSm" onClick={() => void abmelden()}>
              <LogOut className="size-4" aria-hidden="true" /> Abmelden
            </Button>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl text-primary">
              <CalendarDays className="size-5 text-secondary" aria-hidden="true" /> Termine
            </h2>
            {kommend.length === 0 ? (
              <p className="text-muted-foreground">Aktuell steht kein Termin an.</p>
            ) : (
              <ul className="grid gap-2">
                {kommend.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl bg-creme px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-primary">
                      {format(new Date(t.start), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", {
                        locale: de,
                      })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t.appointment_types?.name ?? "Behandlung"}
                      {t.practitioners?.name ? ` · bei ${t.practitioners.name}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {vergangen.length > 0 ? (
              <>
                <h3 className="mb-3 mt-7 text-[0.68rem] uppercase tracking-[0.14em] text-secondary">
                  Vergangene Termine
                </h3>
                <ul className="grid gap-2">
                  {vergangen.map((t) => (
                    <li key={t.id} className="rounded-xl bg-background/70 px-4 py-2.5 text-sm">
                      <span className="text-primary">
                        {format(new Date(t.start), "d.M.yyyy, HH:mm", { locale: de })}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {t.appointment_types?.name ?? "Behandlung"}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
            <h2 className="mb-5 flex items-center gap-2 font-display text-xl text-primary">
              <FileText className="size-5 text-secondary" aria-hidden="true" /> Rechnungen
            </h2>
            {rechnungen.length === 0 ? (
              <p className="text-muted-foreground">Es liegt keine Rechnung vor.</p>
            ) : (
              <ul className="grid gap-2">
                {rechnungen.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl bg-creme px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-primary">{r.rechnungsnummer}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(r.datum), "d.M.yyyy", { locale: de })}
                    </span>
                    <span className="text-sm text-primary">
                      {Number(r.betrag).toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <span className="ml-auto rounded-full bg-sage/35 px-3 py-0.5 text-xs text-primary">
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 text-sm text-muted-foreground">
              Offene Beträge bitte mit der Rechnungsnummer als Verwendungszweck auf das Praxiskonto
              überweisen. Fragen? {praxis.telefon}
            </p>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-primary">
              <HelpCircle className="size-5 text-secondary" aria-hidden="true" /> Fragebogen
            </h2>
            <p className="text-muted-foreground">
              Drei Tage nach deinem Termin findest du hier einen kurzen Fragebogen. Er wird
              automatisch freigeschaltet.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
