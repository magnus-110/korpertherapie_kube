import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, ClipboardList, HelpCircle, NotebookPen, PenLine } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nurTeam } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Episode = {
  id: string;
  titel: string;
  anliegen: string | null;
  status: string;
  start_datum: string;
  patients: { id: string; name: string } | null;
};
type Doku = {
  id: string;
  appointment_id: string;
  befund: string | null;
  behandlung: string | null;
  plan: string | null;
};
type Termin = {
  id: string;
  start: string;
  status: string;
  appointment_types: { name: string } | null;
  practitioners: { name: string } | null;
};
type Fragebogen = {
  id: string;
  appointment_id: string;
  faellig_ab: string;
  status: string;
};
type Rechnung = {
  id: string;
  rechnungsnummer: string;
  datum: string;
  betrag: number;
  status: string;
};

export const Route = createFileRoute(
  "/_authenticated/praxis/patienten/$patientId/episode/$episodeId",
)({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  loader: async ({ params }) => {
    const [episode, termine, dokus, fragebogen, rechnungen] = await Promise.all([
      supabase
        .from("treatment_episodes")
        .select("id, titel, anliegen, status, start_datum, patients(id, name)")
        .eq("id", params.episodeId)
        .maybeSingle(),
      supabase
        .from("appointments")
        .select("id, start, status, appointment_types(name), practitioners(name)")
        .eq("episode_id", params.episodeId)
        .order("start", { ascending: false }),
      supabase
        .from("session_notes")
        .select("id, appointment_id, befund, behandlung, plan")
        .eq("episode_id", params.episodeId),
      supabase
        .from("questionnaires")
        .select("id, appointment_id, faellig_ab, status")
        .eq("episode_id", params.episodeId),
      supabase
        .from("invoices")
        .select("id, rechnungsnummer, datum, betrag, status")
        .eq("episode_id", params.episodeId)
        .order("datum", { ascending: false }),
    ]);
    const offeneTermine = await supabase
      .from("appointments")
      .select("id, start, status, appointment_types(name), practitioners(name)")
      .eq("patient_id", params.patientId)
      .is("episode_id", null)
      .order("start", { ascending: false });
    return {
      episode: (episode.data ?? null) as unknown as Episode | null,
      termine: (termine.data ?? []) as unknown as Termin[],
      ohneEpisode: (offeneTermine.data ?? []) as unknown as Termin[],
      dokus: (dokus.data ?? []) as Doku[],
      fragebogen: (fragebogen.data ?? []) as Fragebogen[],
      rechnungen: (rechnungen.data ?? []) as Rechnung[],
    };
  },
  head: () => ({ meta: [{ title: "Behandlungsepisode · Praxis Kube" }] }),
  errorComponent: () => (
    <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
      Die Episode konnte nicht geladen werden.
    </p>
  ),
  notFoundComponent: () => (
    <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
      Diese Episode gibt es nicht.
    </p>
  ),
  component: EpisodeSeite,
});

const reiter = ["verlauf", "body", "anamnese", "rechnungen"] as const;
const reiterLabel: Record<(typeof reiter)[number], string> = {
  verlauf: "Verlauf",
  body: "Body Chart",
  anamnese: "Anamnese",
  rechnungen: "Rechnungen",
};

function EpisodeSeite() {
  const { episode, termine, ohneEpisode, dokus, fragebogen, rechnungen } =
    Route.useLoaderData() as {
      episode: Episode | null;
      termine: Termin[];
      ohneEpisode: Termin[];
      dokus: Doku[];
      fragebogen: Fragebogen[];
      rechnungen: Rechnung[];
    };
  const { patientId, episodeId } = Route.useParams();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof reiter)[number]>("verlauf");
  const [dialogTermin, setDialogTermin] = useState<Termin | null>(null);

  if (!episode) {
    return (
      <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
        Diese Episode gibt es nicht.
      </p>
    );
  }

  const dokuZu = (terminId: string) => dokus.find((d) => d.appointment_id === terminId) ?? null;
  const letzte = termine.find(
    (t) => new Date(t.start).getTime() < Date.now() && dokuZu(t.id) !== null,
  );
  const letzteDoku = letzte ? dokuZu(letzte.id) : null;

  async function terminZuordnen(terminId: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ episode_id: episodeId })
      .eq("id", terminId);
    if (error) {
      toast.error("Konnte nicht zugeordnet werden");
      return;
    }
    await supabase.from("questionnaires").update({ episode_id: episodeId }).eq("appointment_id", terminId);
    toast.success("Termin der Episode zugeordnet");
    await router.invalidate();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link
          to="/praxis/patienten/$patientId"
          params={{ patientId }}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {episode.patients?.name ?? "Akte"}
        </Link>
        <h1 className="font-display text-2xl font-semibold text-primary">{episode.titel}</h1>
        {episode.anliegen ? (
          <p className="mt-1 text-sm text-muted-foreground">{episode.anliegen}</p>
        ) : null}
      </div>

      <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-soft-md)]">
        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-sage">Letzte Sitzung</p>
        {letzte && letzteDoku ? (
          <>
            <p className="mt-2 font-display text-xl">
              {format(new Date(letzte.start), "EEEE, d. MMMM yyyy", { locale: de })}
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-sage">
              {letzteDoku.befund ? (
                <div>
                  <dt className="text-primary-foreground">Befund</dt>
                  <dd>{letzteDoku.befund}</dd>
                </div>
              ) : null}
              {letzteDoku.behandlung ? (
                <div>
                  <dt className="text-primary-foreground">Behandlung</dt>
                  <dd>{letzteDoku.behandlung}</dd>
                </div>
              ) : null}
              {letzteDoku.plan ? (
                <div>
                  <dt className="text-primary-foreground">Plan</dt>
                  <dd>{letzteDoku.plan}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : (
          <p className="mt-2 text-sm text-sage">
            Noch keine Dokumentation vorhanden. Nach dem Termin hier festhalten, was war.
          </p>
        )}
      </section>

      <nav className="flex flex-wrap gap-2">
        {reiter.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setTab(r)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === r
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-primary"
            }`}
          >
            {reiterLabel[r]}
          </button>
        ))}
      </nav>

      {tab === "verlauf" ? (
        <section className="grid gap-4">
          {termine.length === 0 ? (
            <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
              Dieser Episode ist noch kein Termin zugeordnet.
            </p>
          ) : (
            <ul className="grid gap-2">
              {termine.map((t) => {
                const d = dokuZu(t.id);
                const f = fragebogen.find((q) => q.appointment_id === t.id);
                return (
                  <li key={t.id} className="rounded-2xl bg-card px-5 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-primary">
                        {format(new Date(t.start), "d.M.yyyy, HH:mm", { locale: de })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t.appointment_types?.name ?? "Behandlung"}
                      </span>
                      {f ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage/35 px-3 py-0.5 text-xs text-primary">
                          <HelpCircle className="size-3" aria-hidden="true" /> Fragebogen{" "}
                          {f.status === "beantwortet"
                            ? "beantwortet"
                            : new Date(f.faellig_ab).getTime() <= Date.now()
                              ? "offen"
                              : `ab ${format(new Date(f.faellig_ab), "d.M.", { locale: de })}`}
                        </span>
                      ) : null}
                      <Button
                        variant="pillOutline"
                        size="pillSm"
                        className="ml-auto"
                        onClick={() => setDialogTermin(t)}
                      >
                        <PenLine className="size-4" aria-hidden="true" />
                        {d ? "Doku ändern" : "Dokumentation"}
                      </Button>
                    </div>
                    {d ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {[d.befund, d.behandlung, d.plan].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          {ohneEpisode.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Termine dieser Patientin oder dieses Patienten ohne Episode:
              </p>
              <ul className="grid gap-2">
                {ohneEpisode.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-primary">
                      {format(new Date(t.start), "d.M.yyyy, HH:mm", { locale: de })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {t.appointment_types?.name ?? "Behandlung"}
                    </span>
                    <Button
                      variant="pillOutline"
                      size="pillSm"
                      className="ml-auto"
                      onClick={() => void terminZuordnen(t.id)}
                    >
                      Zu dieser Episode
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "body" ? (
        <Platzhalter
          icon={<ClipboardList className="size-5 text-secondary" aria-hidden="true" />}
          titel="Body Chart"
          text="Hier entsteht die Zeichenfläche für den Körperbefund – mit dem Tablet direkt hineinmalen. Die Vorlage kommt später."
        />
      ) : null}

      {tab === "anamnese" ? (
        <Platzhalter
          icon={<NotebookPen className="size-5 text-secondary" aria-hidden="true" />}
          titel="Anamnesebogen"
          text="Der Anamnesebogen wird hier eingebunden, sobald die Fragen feststehen."
        />
      ) : null}

      {tab === "rechnungen" ? (
        <section className="rounded-2xl bg-card px-5 py-4">
          {rechnungen.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Dieser Episode ist noch keine Rechnung zugeordnet.
            </p>
          ) : (
            <ul className="grid gap-2">
              {rechnungen.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-primary">{r.rechnungsnummer}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(r.datum), "d.M.yyyy", { locale: de })}
                  </span>
                  <span className="text-sm text-primary">
                    {Number(r.betrag).toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <DokuDialog
        termin={dialogTermin}
        doku={dialogTermin ? dokuZu(dialogTermin.id) : null}
        episodeId={episodeId}
        onClose={() => setDialogTermin(null)}
        onGespeichert={async () => {
          setDialogTermin(null);
          await router.invalidate();
        }}
      />
    </div>
  );
}

function Platzhalter({
  icon,
  titel,
  text,
}: {
  icon: React.ReactNode;
  titel: string;
  text: string;
}) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="font-display text-xl text-primary">{titel}</p>
      <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">{text}</p>
    </section>
  );
}

function DokuDialog({
  termin,
  doku,
  episodeId,
  onClose,
  onGespeichert,
}: {
  termin: Termin | null;
  doku: Doku | null;
  episodeId: string;
  onClose: () => void;
  onGespeichert: () => Promise<void>;
}) {
  const [befund, setBefund] = useState("");
  const [behandlung, setBehandlung] = useState("");
  const [plan, setPlan] = useState("");
  const [geladen, setGeladen] = useState<string | null>(null);

  if (termin && geladen !== termin.id) {
    setGeladen(termin.id);
    setBefund(doku?.befund ?? "");
    setBehandlung(doku?.behandlung ?? "");
    setPlan(doku?.plan ?? "");
  }

  async function speichern() {
    if (!termin) return;
    const { data: nutzer } = await supabase.auth.getUser();
    const { error } = await supabase.from("session_notes").upsert(
      {
        appointment_id: termin.id,
        episode_id: episodeId,
        befund: befund.trim() || null,
        behandlung: behandlung.trim() || null,
        plan: plan.trim() || null,
        verfasst_von: nutzer.user?.id ?? null,
      },
      { onConflict: "appointment_id" },
    );
    if (error) {
      toast.error("Konnte nicht gespeichert werden");
      return;
    }
    toast.success("Dokumentation gespeichert");
    await onGespeichert();
  }

  return (
    <Dialog open={termin !== null} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dokumentation</DialogTitle>
          <DialogDescription>
            {termin
              ? format(new Date(termin.start), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
              : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="d-befund">Befund</Label>
            <textarea
              id="d-befund"
              rows={3}
              value={befund}
              onChange={(e) => setBefund(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="d-behandlung">Behandlung</Label>
            <textarea
              id="d-behandlung"
              rows={3}
              value={behandlung}
              onChange={(e) => setBehandlung(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="d-plan">Plan / Hausaufgabe</Label>
            <Input
              id="d-plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <Button variant="pill" size="pillSm" onClick={() => void speichern()}>
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
