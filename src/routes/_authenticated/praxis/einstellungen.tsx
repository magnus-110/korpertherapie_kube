import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nurVerwaltung } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Behandler = {
  id: string;
  name: string;
  kuerzel: string | null;
  bezeichnung: string | null;
  farbe: string;
  aktiv: boolean;
};
type Art = {
  id: string;
  name: string;
  kurztext: string | null;
  dauer_minuten: number | null;
  practitioner_id: string | null;
  art_kategorie: "erstbehandlung" | "folgetermin";
  online_buchbar: boolean;
  aktiv: boolean;
};
type Regel = {
  id: string;
  practitioner_id: string;
  wochentag: number;
  von: string;
  bis: string;
  aktiv: boolean;
};
type Daten = { behandler: Behandler[]; arten: Art[]; regeln: Regel[] };

const wochentage = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export const Route = createFileRoute("/_authenticated/praxis/einstellungen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  loader: async () => {
    const [behandler, arten, regeln] = await Promise.all([
      supabase
        .from("practitioners")
        .select("id, name, kuerzel, bezeichnung, farbe, aktiv")
        .order("sortierung"),
      supabase
        .from("appointment_types")
        .select(
          "id, name, kurztext, dauer_minuten, practitioner_id, art_kategorie, online_buchbar, aktiv",
        )
        .order("sortierung"),
      supabase
        .from("availability_rules")
        .select("id, practitioner_id, wochentag, von, bis, aktiv")
        .order("wochentag"),
    ]);
    return {
      behandler: (behandler.data ?? []) as Behandler[],
      arten: (arten.data ?? []) as Art[],
      regeln: (regeln.data ?? []) as Regel[],
    } satisfies Daten;
  },
  head: () => ({ meta: [{ title: "Einstellungen · Praxis Kube" }] }),
  component: EinstellungenSeite,
});

function EinstellungenSeite() {
  const daten = Route.useLoaderData() as Daten;
  const router = useRouter();

  async function erledigt(fehler: unknown, text: string) {
    if (fehler) {
      toast.error("Konnte nicht gespeichert werden");
      return;
    }
    toast.success(text);
    await router.invalidate();
  }

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-primary">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Behandler, Behandlungsarten und Zeiten, die online buchbar sind.
        </p>
      </div>

      <BehandlerBlock behandler={daten.behandler} erledigt={erledigt} />
      <ArtenBlock arten={daten.arten} behandler={daten.behandler} erledigt={erledigt} />
      <ZeitenBlock regeln={daten.regeln} behandler={daten.behandler} erledigt={erledigt} />
    </div>
  );
}

type Fertig = (fehler: unknown, text: string) => Promise<void>;

function Karte({ titel, hinweis, children }: { titel: string; hinweis: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)]">
      <h2 className="font-display text-xl text-primary">{titel}</h2>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">{hinweis}</p>
      {children}
    </section>
  );
}

function BehandlerBlock({ behandler, erledigt }: { behandler: Behandler[]; erledigt: Fertig }) {
  const [name, setName] = useState("");
  const [kuerzel, setKuerzel] = useState("");
  const [farbe, setFarbe] = useState("#3D6B62");

  async function anlegen() {
    if (name.trim().length < 2) {
      toast.error("Bitte einen Namen eingeben");
      return;
    }
    const { error } = await supabase
      .from("practitioners")
      .insert({ name: name.trim(), kuerzel: kuerzel.trim() || null, farbe });
    setName("");
    setKuerzel("");
    await erledigt(error, "Behandler angelegt");
  }

  return (
    <Karte titel="Behandler" hinweis="Wer behandelt in der Praxis – mit Farbe für den Kalender.">
      <ul className="mb-5 grid gap-2">
        {behandler.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-background px-4 py-3">
            <input
              type="color"
              value={b.farbe}
              onChange={(e) =>
                void supabase
                  .from("practitioners")
                  .update({ farbe: e.target.value })
                  .eq("id", b.id)
                  .then(({ error }) => erledigt(error, "Farbe gespeichert"))
              }
              className="size-7 cursor-pointer rounded-full border border-border bg-transparent"
              aria-label={`Farbe von ${b.name}`}
            />
            <span className="min-w-0 flex-1 truncate text-sm text-primary">
              {b.name}
              {b.kuerzel ? ` · ${b.kuerzel}` : ""}
            </span>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={b.aktiv}
                onChange={(e) =>
                  void supabase
                    .from("practitioners")
                    .update({ aktiv: e.target.checked })
                    .eq("id", b.id)
                    .then(({ error }) => erledigt(error, "Gespeichert"))
                }
              />
              aktiv
            </label>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <div>
          <Label htmlFor="b-name">Name</Label>
          <Input id="b-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="b-kuerzel">Kürzel</Label>
          <Input id="b-kuerzel" value={kuerzel} onChange={(e) => setKuerzel(e.target.value)} className="mt-1.5" />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={farbe}
            onChange={(e) => setFarbe(e.target.value)}
            className="size-9 cursor-pointer rounded-full border border-border bg-transparent"
            aria-label="Farbe"
          />
          <Button variant="pill" size="pillSm" onClick={() => void anlegen()}>
            <Plus className="size-4" aria-hidden="true" /> Anlegen
          </Button>
        </div>
      </div>
    </Karte>
  );
}

function ArtenBlock({
  arten,
  behandler,
  erledigt,
}: {
  arten: Art[];
  behandler: Behandler[];
  erledigt: Fertig;
}) {
  const [name, setName] = useState("");
  const [kurztext, setKurztext] = useState("");
  const [dauer, setDauer] = useState("60");
  const [personId, setPersonId] = useState(behandler[0]?.id ?? "");
  const [kategorie, setKategorie] = useState<"erstbehandlung" | "folgetermin">("erstbehandlung");

  async function anlegen() {
    if (name.trim().length < 2) {
      toast.error("Bitte einen Namen eingeben");
      return;
    }
    const { error } = await supabase.from("appointment_types").insert({
      name: name.trim(),
      kurztext: kurztext.trim() || null,
      dauer_minuten: Number(dauer) || 60,
      practitioner_id: personId || null,
      art_kategorie: kategorie,
      online_buchbar: true,
      aktiv: true,
    });
    setName("");
    setKurztext("");
    await erledigt(error, "Behandlungsart angelegt");
  }

  return (
    <Karte
      titel="Behandlungsarten"
      hinweis="Diese Auswahl sehen Besucher im Buchungsassistenten – getrennt nach Erstbehandlung und Folgetermin."
    >
      <ul className="mb-5 grid gap-2">
        {arten.map((a) => (
          <li key={a.id} className="grid gap-2 rounded-xl bg-background px-4 py-3 sm:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">{a.name}</p>
              <p className="text-xs text-muted-foreground">
                {a.art_kategorie === "erstbehandlung" ? "Erstbehandlung" : "Folgetermin"} ·{" "}
                {a.dauer_minuten ?? 60} Min ·{" "}
                {behandler.find((b) => b.id === a.practitioner_id)?.name ?? "ohne Behandler"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={a.online_buchbar}
                  onChange={(e) =>
                    void supabase
                      .from("appointment_types")
                      .update({ online_buchbar: e.target.checked })
                      .eq("id", a.id)
                      .then(({ error }) => erledigt(error, "Gespeichert"))
                  }
                />
                online buchbar
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={a.aktiv}
                  onChange={(e) =>
                    void supabase
                      .from("appointment_types")
                      .update({ aktiv: e.target.checked })
                      .eq("id", a.id)
                      .then(({ error }) => erledigt(error, "Gespeichert"))
                  }
                />
                aktiv
              </label>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="a-name">Name</Label>
          <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="a-kurz">Kurztext</Label>
          <Input id="a-kurz" value={kurztext} onChange={(e) => setKurztext(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="a-dauer">Dauer in Minuten</Label>
          <Input
            id="a-dauer"
            type="number"
            min={15}
            step={15}
            value={dauer}
            onChange={(e) => setDauer(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="a-person">Behandler</Label>
          <select
            id="a-person"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {behandler.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="a-kat">Anlass</Label>
          <select
            id="a-kat"
            value={kategorie}
            onChange={(e) => setKategorie(e.target.value as "erstbehandlung" | "folgetermin")}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="erstbehandlung">Erstbehandlung</option>
            <option value="folgetermin">Folgetermin</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button variant="pill" size="pillSm" onClick={() => void anlegen()}>
            <Plus className="size-4" aria-hidden="true" /> Anlegen
          </Button>
        </div>
      </div>
    </Karte>
  );
}

function ZeitenBlock({
  regeln,
  behandler,
  erledigt,
}: {
  regeln: Regel[];
  behandler: Behandler[];
  erledigt: Fertig;
}) {
  const [personId, setPersonId] = useState(behandler[0]?.id ?? "");
  const [tag, setTag] = useState("1");
  const [von, setVon] = useState("09:00");
  const [bis, setBis] = useState("17:00");

  async function anlegen() {
    if (!personId) {
      toast.error("Bitte einen Behandler wählen");
      return;
    }
    const { error } = await supabase.from("availability_rules").insert({
      practitioner_id: personId,
      wochentag: Number(tag),
      von,
      bis,
      aktiv: true,
    });
    await erledigt(error, "Zeit gespeichert");
  }

  async function loeschen(id: string) {
    const { error } = await supabase.from("availability_rules").delete().eq("id", id);
    await erledigt(error, "Zeit entfernt");
  }

  return (
    <Karte
      titel="Zeiten für Online-Termine"
      hinweis="Innerhalb dieser Zeiten schlägt der Kalender freie Termine vor."
    >
      <ul className="mb-5 grid gap-2">
        {regeln.length === 0 ? (
          <li className="rounded-xl bg-background px-4 py-3 text-sm text-muted-foreground">
            Noch keine Zeiten hinterlegt.
          </li>
        ) : (
          regeln.map((r) => (
            <li key={r.id} className="flex items-center gap-3 rounded-xl bg-background px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm text-primary">
                {behandler.find((b) => b.id === r.practitioner_id)?.name ?? "—"} ·{" "}
                {wochentage[r.wochentag]} · {r.von.slice(0, 5)}–{r.bis.slice(0, 5)}
              </span>
              <button
                type="button"
                onClick={() => void loeschen(r.id)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                aria-label="Zeit entfernen"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px_120px_auto] sm:items-end">
        <div>
          <Label htmlFor="z-person">Behandler</Label>
          <select
            id="z-person"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {behandler.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="z-tag">Wochentag</Label>
          <select
            id="z-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 0].map((t) => (
              <option key={t} value={t}>
                {wochentage[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="z-von">Von</Label>
          <Input id="z-von" type="time" value={von} onChange={(e) => setVon(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="z-bis">Bis</Label>
          <Input id="z-bis" type="time" value={bis} onChange={(e) => setBis(e.target.value)} className="mt-1.5" />
        </div>
        <Button variant="pill" size="pillSm" onClick={() => void anlegen()}>
          <Plus className="size-4" aria-hidden="true" /> Hinzufügen
        </Button>
      </div>
    </Karte>
  );
}
