import { useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, Check, Clock, Loader2, Phone, Sparkles, Repeat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WochenKalender, type Slot } from "@/components/site/WochenKalender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { praxis } from "@/lib/praxis";

type Kategorie = "erstbehandlung" | "folgetermin";

export type Art = {
  id: string;
  name: string;
  kurztext: string | null;
  dauer_minuten: number | null;
  practitioner_id: string | null;
  art_kategorie: Kategorie;
};
export type Person = { id: string; name: string; bezeichnung: string | null };

/**
 * Buchungsassistent mit fester Containerhöhe: Anlass, Behandlung, Kalender.
 * Wird sowohl auf der Startseite (kompakt) als auch auf /termin genutzt.
 */
export function BuchungsWizard({ kompakt = false }: { kompakt?: boolean }) {
  const [arten, setArten] = useState<Art[]>([]);
  const [behandler, setBehandler] = useState<Person[]>([]);
  const [stammLaedt, setStammLaedt] = useState(true);

  const [kategorie, setKategorie] = useState<Kategorie | null>(null);
  const [artId, setArtId] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const [fertig, setFertig] = useState(false);
  const [laedt, setLaedt] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [anliegen, setAnliegen] = useState("");
  const [zustimmung, setZustimmung] = useState(false);

  useEffect(() => {
    let abgebrochen = false;
    void (async () => {
      const [a, b] = await Promise.all([
        supabase
          .from("appointment_types")
          .select("id, name, kurztext, dauer_minuten, practitioner_id, art_kategorie")
          .eq("aktiv", true)
          .eq("online_buchbar", true)
          .order("sortierung"),
        supabase.from("practitioners").select("id, name, bezeichnung").eq("aktiv", true),
      ]);
      if (abgebrochen) return;
      setArten((a.data ?? []) as Art[]);
      setBehandler((b.data ?? []) as Person[]);
      setStammLaedt(false);
    })();
    return () => {
      abgebrochen = true;
    };
  }, []);

  const art = arten.find((a) => a.id === artId) ?? null;
  const person = behandler.find((b) => b.id === art?.practitioner_id) ?? null;

  const passende = useMemo(
    () => arten.filter((a) => (kategorie ? a.art_kategorie === kategorie : true)),
    [arten, kategorie],
  );

  useEffect(() => {
    if (!artId) return;
    let abgebrochen = false;
    setLaedt(true);
    setSlots(null);
    const heute = new Date();
    void supabase
      .rpc("freie_zeiten", {
        _behandlungsart: artId,
        _von: format(heute, "yyyy-MM-dd"),
        _bis: format(addDays(heute, 90), "yyyy-MM-dd"),
      })
      .then(({ data }) => {
        if (!abgebrochen) {
          setSlots((data as Slot[] | null) ?? []);
          setLaedt(false);
        }
      });
    return () => {
      abgebrochen = true;
    };
  }, [artId]);

  async function buchen() {
    if (!artId || !gewaehlt) return;
    setSendet(true);
    setFehler(null);
    const { error } = await supabase.rpc("termin_buchen", {
      _behandlungsart: artId,
      _start: gewaehlt,
      _name: name,
      _email: email,
      _telefon: telefon,
      _anliegen: anliegen,
    });
    setSendet(false);
    if (error) {
      setFehler(error.message.replace(/^.*?:\s*/, ""));
      return;
    }
    setFertig(true);
  }

  const schritt = !kategorie ? 1 : !art ? 2 : 3;

  return (
    <div
      className="flex flex-col rounded-[2rem] bg-card p-5 shadow-[var(--shadow-soft-md)] sm:p-7"
      style={{ height: kompakt ? "clamp(560px, 78vh, 700px)" : "clamp(620px, 82vh, 780px)" }}
    >
      {fertig && art ? (
        <div className="flex flex-1 flex-col items-start justify-center">
          <div className="mb-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-6" aria-hidden="true" />
          </div>
          <p className="eyebrow mb-2">Termin gebucht</p>
          <p className="font-display text-2xl text-primary">{art.name}</p>
          <p className="mt-2 text-lg text-secondary">
            {gewaehlt
              ? format(parseISO(gewaehlt), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
              : null}
          </p>
          <p className="mt-6 text-[0.95rem]">
            Du bekommst eine Bestätigung per E-Mail. Fragen? {praxis.telefon}
          </p>
        </div>
      ) : (
        <>
          <ol className="mb-5 flex shrink-0 flex-wrap gap-2" aria-label="Fortschritt">
            {["Anlass", "Behandlung", "Wunschzeit"].map((label, i) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8rem] ${
                  schritt === i + 1
                    ? "bg-primary font-semibold text-primary-foreground"
                    : schritt > i + 1
                      ? "bg-sage/35 text-primary"
                      : "bg-creme text-muted-foreground"
                }`}
                aria-current={schritt === i + 1 ? "step" : undefined}
              >
                <span className="text-xs">{i + 1}</span> {label}
              </li>
            ))}
          </ol>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {stammLaedt ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Einen Moment …
              </p>
            ) : null}

            {!stammLaedt && schritt === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    {
                      wert: "erstbehandlung" as const,
                      icon: Sparkles,
                      titel: "Erstbehandlung",
                      text: "Erster Termin bei uns.",
                    },
                    {
                      wert: "folgetermin" as const,
                      icon: Repeat,
                      titel: "Folgetermin",
                      text: "Du warst schon da.",
                    },
                  ] satisfies {
                    wert: Kategorie;
                    icon: typeof Sparkles;
                    titel: string;
                    text: string;
                  }[]
                ).map(({ wert, icon: Icon, titel, text }) => (
                  <button
                    key={wert}
                    type="button"
                    onClick={() => {
                      setKategorie(wert);
                      setArtId(null);
                      setGewaehlt(null);
                    }}
                    className="rounded-3xl bg-creme p-6 text-left shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-md)]"
                  >
                    <span className="mb-4 grid size-11 place-items-center rounded-full bg-sage/30 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="font-display text-xl text-primary">{titel}</p>
                    <p className="mt-2 text-[0.95rem] text-muted-foreground">{text}</p>
                  </button>
                ))}
              </div>
            ) : null}

            {!stammLaedt && schritt === 2 ? (
              <>
                <button
                  type="button"
                  onClick={() => setKategorie(null)}
                  className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Zurück
                </button>

                {passende.length === 0 ? (
                  <div className="rounded-2xl bg-creme p-6">
                    <p className="text-primary">
                      Dafür ist online nichts frei. Ruf uns gerne an.
                    </p>
                    <Button asChild variant="pill" size="pill" className="mt-4">
                      <a href={praxis.telefonHref}>
                        <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${kompakt ? "" : "sm:grid-cols-2"}`}>
                    {passende.map((a) => {
                      const wer = behandler.find((b) => b.id === a.practitioner_id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setArtId(a.id);
                            setGewaehlt(null);
                          }}
                          className="rounded-2xl bg-creme p-5 text-left shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-md)]"
                        >
                          <p className="font-display text-lg text-primary">{a.name}</p>
                          {a.kurztext ? (
                            <p className="mt-2 text-[0.92rem] text-muted-foreground">{a.kurztext}</p>
                          ) : null}
                          <p className="mt-3 flex flex-wrap items-center gap-3 text-xs text-secondary">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="size-3.5" aria-hidden="true" />
                              {a.dauer_minuten ?? 60} Minuten
                            </span>
                            {wer ? <span>· bei {wer.name}</span> : null}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}

            {!stammLaedt && schritt === 3 && art ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setArtId(null);
                    setGewaehlt(null);
                  }}
                  className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Andere Behandlung
                </button>

                <div className="mb-4 rounded-2xl bg-creme px-5 py-3">
                  <p className="font-display text-lg text-primary">{art.name}</p>
                  <p className="mt-0.5 text-sm text-secondary">
                    {person?.name ?? "Praxis Kube"} · {art.dauer_minuten ?? 60} Minuten
                  </p>
                </div>

                {laedt ? (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Freie Zeiten
                    werden geladen …
                  </p>
                ) : (slots ?? []).length === 0 ? (
                  <div className="rounded-2xl bg-creme p-6">
                    <p className="text-primary">Gerade ist alles belegt. Ruf uns gerne an.</p>
                    <Button asChild variant="pill" size="pill" className="mt-4">
                      <a href={praxis.telefonHref}>
                        <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
                      </a>
                    </Button>
                  </div>
                ) : (
                  <WochenKalender
                    slots={slots ?? []}
                    spalte={person?.name ?? "Freie Zeiten"}
                    gewaehlt={gewaehlt}
                    onWaehlen={setGewaehlt}
                    kompakt={kompakt}
                  />
                )}

                {gewaehlt ? (
                  <div className="mt-6 rounded-3xl bg-creme p-5 sm:p-6">
                    <p className="eyebrow mb-1">Deine Zeit</p>
                    <p className="mb-5 font-display text-xl text-primary">
                      {format(parseISO(gewaehlt), "EEEE, d. MMMM 'um' HH:mm 'Uhr'", { locale: de })}
                    </p>

                    <div className={`grid gap-4 ${kompakt ? "" : "sm:grid-cols-2"}`}>
                      <div>
                        <Label htmlFor="bw-name">Name *</Label>
                        <Input
                          id="bw-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1.5"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bw-email">E-Mail *</Label>
                        <Input
                          id="bw-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1.5"
                          autoComplete="email"
                        />
                      </div>
                      <div className={kompakt ? "" : "sm:col-span-2"}>
                        <Label htmlFor="bw-telefon">Telefon</Label>
                        <Input
                          id="bw-telefon"
                          type="tel"
                          value={telefon}
                          onChange={(e) => setTelefon(e.target.value)}
                          className="mt-1.5"
                          autoComplete="tel"
                        />
                      </div>
                      <div className={kompakt ? "" : "sm:col-span-2"}>
                        <Label htmlFor="bw-anliegen">Dein Anliegen</Label>
                        <Textarea
                          id="bw-anliegen"
                          value={anliegen}
                          onChange={(e) => setAnliegen(e.target.value)}
                          rows={3}
                          className="mt-1.5"
                          placeholder="Was führt dich zu uns?"
                        />
                      </div>
                    </div>

                    <label className="mt-5 flex items-start gap-3 text-[0.9rem]">
                      <input
                        type="checkbox"
                        checked={zustimmung}
                        onChange={(e) => setZustimmung(e.target.checked)}
                        className="mt-1 size-4"
                      />
                      <span>
                        Ich habe die{" "}
                        <a
                          href="/datenschutz"
                          className="text-secondary underline underline-offset-4"
                        >
                          Datenschutzerklärung
                        </a>{" "}
                        gelesen und bin mit der Verarbeitung meiner Angaben zur Terminvereinbarung
                        einverstanden. *
                      </span>
                    </label>

                    {fehler ? (
                      <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {fehler}
                      </p>
                    ) : null}

                    <Button
                      variant="pill"
                      size="pill"
                      className="mt-6 w-full sm:w-auto"
                      disabled={sendet || !zustimmung || !name.trim() || !email.trim()}
                      onClick={() => void buchen()}
                    >
                      {sendet ? "Wird gebucht …" : "Verbindlich buchen"}
                    </Button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
