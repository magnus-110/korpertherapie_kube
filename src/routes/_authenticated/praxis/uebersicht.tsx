import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/uebersicht")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  loader: async () => {
    const [offen, patienten, anfragen, behandlungsarten] = await Promise.all([
      supabase.from("invoices").select("betrag").eq("status", "offen"),
      supabase.from("patients").select("id", { count: "exact", head: true }),
      supabase
        .from("contact_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "neu"),
      supabase
        .from("appointment_types")
        .select("id", { count: "exact", head: true })
        .eq("aktiv", true),
    ]);

    const offenSumme = (offen.data ?? []).reduce((s, r) => s + Number(r.betrag), 0);

    return {
      offenAnzahl: offen.data?.length ?? 0,
      offenSumme,
      patienten: patienten.count ?? 0,
      neueAnfragen: anfragen.count ?? 0,
      behandlungsarten: behandlungsarten.count ?? 0,
    };
  },
  head: () => ({ meta: [{ title: "Übersicht · Praxis Kube" }] }),
  component: UebersichtSeite,
});

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function Kennzahl({ label, wert, zusatz }: { label: string; wert: string; zusatz?: string }) {
  return (
    <div className="rounded-xl bg-card p-4">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-secondary">{label}</p>
      <p className="mt-1.5 font-display text-2xl text-primary">{wert}</p>
      {zusatz ? <p className="mt-0.5 text-xs text-muted-foreground">{zusatz}</p> : null}
    </div>
  );
}

function UebersichtSeite() {
  const d = Route.useLoaderData();

  const aufgaben = [
    {
      text: `${d.neueAnfragen} neue Kontaktanfragen`,
      ziel: "/praxis/anfragen",
      aktiv: d.neueAnfragen > 0,
    },
    { text: "Behandlungen abhaken und abrechnen", ziel: "/praxis/rechnungen", aktiv: false },
    { text: "Kontoauszug einlesen und zuordnen", ziel: "/praxis/zahlungen", aktiv: false },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-primary sm:text-3xl">Übersicht</h1>
      <p className="mt-2 text-muted-foreground">Was heute deine Aufmerksamkeit braucht.</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kennzahl
          label="Offen"
          wert={euro.format(d.offenSumme)}
          zusatz={`${d.offenAnzahl} Rechnungen`}
        />
        <Kennzahl label="Patientenakten" wert={String(d.patienten)} />
        <Kennzahl
          label="Behandlungsarten"
          wert={String(d.behandlungsarten)}
          zusatz="online buchbar"
        />
        <Kennzahl label="Neue Anfragen" wert={String(d.neueAnfragen)} />
      </div>

      <h2 className="mb-3 mt-9 text-[0.68rem] uppercase tracking-[0.14em] text-secondary">
        Zu erledigen
      </h2>
      <ul className="grid gap-2">
        {aufgaben.map((a) => (
          <li key={a.text}>
            <Link
              to={a.ziel}
              className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-sm transition-colors ${
                a.aktiv
                  ? "bg-card text-primary hover:bg-accent"
                  : "bg-card/50 text-muted-foreground"
              }`}
            >
              <span>{a.text}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 px-5 py-4 text-sm text-muted-foreground">
        Kennzahlen zu Umsatz, Überfälligem und nicht zugeordneten Zahlungen kommen, sobald
        Rechnungen und Kontoauszüge angebunden sind.
      </p>
    </div>
  );
}
