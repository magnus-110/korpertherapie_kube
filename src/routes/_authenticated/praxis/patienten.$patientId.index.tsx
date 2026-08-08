import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, FileText, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nurTeam } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Patient = {
  id: string;
  name: string;
  email: string | null;
  telefon: string | null;
  geburtsdatum: string | null;
  strasse: string | null;
  plz: string | null;
  ort: string | null;
  notizen: string | null;
};
type Episode = {
  id: string;
  titel: string;
  anliegen: string | null;
  status: string;
  start_datum: string;
  ende_datum: string | null;
};
type Rechnung = {
  id: string;
  rechnungsnummer: string;
  datum: string;
  betrag: number;
  status: string;
};

export const Route = createFileRoute("/_authenticated/praxis/patienten/$patientId/")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  loader: async ({ params }) => {
    const [patient, episoden, rechnungen] = await Promise.all([
      supabase
        .from("patients")
        .select("id, name, email, telefon, geburtsdatum, strasse, plz, ort, notizen")
        .eq("id", params.patientId)
        .maybeSingle(),
      supabase
        .from("treatment_episodes")
        .select("id, titel, anliegen, status, start_datum, ende_datum")
        .eq("patient_id", params.patientId)
        .order("start_datum", { ascending: false }),
      supabase
        .from("invoices")
        .select("id, rechnungsnummer, datum, betrag, status")
        .eq("patient_id", params.patientId)
        .order("datum", { ascending: false }),
    ]);
    return {
      patient: (patient.data ?? null) as Patient | null,
      episoden: (episoden.data ?? []) as Episode[],
      rechnungen: (rechnungen.data ?? []) as Rechnung[],
    };
  },
  head: () => ({ meta: [{ title: "Patientenakte · Praxis Kube" }] }),
  errorComponent: () => (
    <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
      Die Akte konnte nicht geladen werden.
    </p>
  ),
  notFoundComponent: () => (
    <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
      Diese Akte gibt es nicht.
    </p>
  ),
  component: PatientSeite,
});

function PatientSeite() {
  const { patient, episoden, rechnungen } = Route.useLoaderData() as {
    patient: Patient | null;
    episoden: Episode[];
    rechnungen: Rechnung[];
  };
  const { patientId } = Route.useParams();
  const router = useRouter();
  const [form, setForm] = useState<Patient | null>(patient);
  const [titel, setTitel] = useState("");
  const [anliegen, setAnliegen] = useState("");

  if (!patient || !form) {
    return (
      <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
        Diese Akte gibt es nicht.
      </p>
    );
  }

  async function speichern() {
    if (!form) return;
    const { error } = await supabase
      .from("patients")
      .update({
        name: form.name.trim(),
        email: form.email?.trim() || null,
        telefon: form.telefon?.trim() || null,
        geburtsdatum: form.geburtsdatum || null,
        strasse: form.strasse?.trim() || null,
        plz: form.plz?.trim() || null,
        ort: form.ort?.trim() || null,
        notizen: form.notizen?.trim() || null,
      })
      .eq("id", patientId);
    if (error) {
      toast.error("Konnte nicht gespeichert werden");
      return;
    }
    toast.success("Stammdaten gespeichert");
    await router.invalidate();
  }

  async function episodeAnlegen() {
    if (titel.trim().length < 2) {
      toast.error("Bitte einen Titel eingeben");
      return;
    }
    const { data, error } = await supabase
      .from("treatment_episodes")
      .insert({
        patient_id: patientId,
        titel: titel.trim(),
        anliegen: anliegen.trim() || null,
      })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Episode konnte nicht angelegt werden");
      return;
    }
    await supabase.from("episode_documents").insert([
      { episode_id: data.id, art: "body_chart" as const },
      { episode_id: data.id, art: "anamnese" as const },
    ]);
    setTitel("");
    setAnliegen("");
    toast.success("Behandlungsepisode angelegt");
    await router.invalidate();
  }

  function feld(key: keyof Patient, label: string, type = "text") {
    return (
      <div>
        <Label htmlFor={`f-${key}`}>{label}</Label>
        <Input
          id={`f-${key}`}
          type={type}
          value={(form?.[key] as string | null) ?? ""}
          onChange={(e) => setForm((f) => (f ? { ...f, [key]: e.target.value } : f))}
          className="mt-1.5"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <Link
          to="/praxis/patienten"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Alle Patienten
        </Link>
        <h1 className="font-display text-2xl font-semibold text-primary">{patient.name}</h1>
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)]">
        <h2 className="mb-5 font-display text-xl text-primary">Stammdaten</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {feld("name", "Name")}
          {feld("email", "E-Mail", "email")}
          {feld("telefon", "Telefon")}
          {feld("geburtsdatum", "Geburtsdatum", "date")}
          {feld("strasse", "Straße")}
          {feld("plz", "PLZ")}
          {feld("ort", "Ort")}
        </div>
        <div className="mt-3">
          <Label htmlFor="f-notizen">Notizen</Label>
          <textarea
            id="f-notizen"
            value={form.notizen ?? ""}
            onChange={(e) => setForm((f) => (f ? { ...f, notizen: e.target.value } : f))}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button variant="pill" size="pillSm" className="mt-4" onClick={() => void speichern()}>
          Speichern
        </Button>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)]">
        <h2 className="font-display text-xl text-primary">Behandlungsepisoden</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Ein Anliegen, ein Verlauf: Body Chart, Anamnese, Termine und Dokumentation.
        </p>

        {episoden.length === 0 ? (
          <p className="mb-5 rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground">
            Noch keine Episode angelegt.
          </p>
        ) : (
          <ul className="mb-5 grid gap-2">
            {episoden.map((e) => (
              <li key={e.id}>
                <Link
                  to="/praxis/patienten/$patientId/episode/$episodeId"
                  params={{ patientId, episodeId: e.id }}
                  className="flex flex-wrap items-center gap-3 rounded-xl bg-background px-4 py-3 transition-colors hover:bg-accent"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">
                    {e.titel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    seit {format(new Date(e.start_datum), "d.M.yyyy", { locale: de })}
                  </span>
                  <span className="rounded-full bg-sage/35 px-3 py-0.5 text-xs text-primary">
                    {e.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <Label htmlFor="e-titel">Titel</Label>
            <Input
              id="e-titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder="z. B. Rückenbeschwerden"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="e-anliegen">Anliegen</Label>
            <Input
              id="e-anliegen"
              value={anliegen}
              onChange={(e) => setAnliegen(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button variant="pill" size="pillSm" onClick={() => void episodeAnlegen()}>
            <FolderPlus className="size-4" aria-hidden="true" /> Episode
          </Button>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)]">
        <h2 className="mb-5 flex items-center gap-2 font-display text-xl text-primary">
          <FileText className="size-5 text-secondary" aria-hidden="true" /> Rechnungen
        </h2>
        {rechnungen.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Rechnung.</p>
        ) : (
          <ul className="grid gap-2">
            {rechnungen.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-background px-4 py-3">
                <span className="text-sm font-semibold text-primary">{r.rechnungsnummer}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(r.datum), "d.M.yyyy", { locale: de })}
                </span>
                <span className="text-sm text-primary">
                  {Number(r.betrag).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
