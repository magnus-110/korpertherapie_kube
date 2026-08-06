import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, Check, Clock, Loader2, Phone, Sparkles, Repeat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { WochenKalender, type Slot } from "@/components/site/WochenKalender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { praxis } from "@/lib/praxis";

const title = "Termin buchen | Praxis Kube Gersthofen";
const description =
  "Buche deinen Termin in der Privatpraxis Kube in Gersthofen online: Erstbehandlung oder Folgetermin wählen, Behandlung aussuchen, freie Zeit im Kalender anklicken.";

type Kategorie = "erstbehandlung" | "folgetermin";

export const Route = createFileRoute("/termin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/termin" }],
  }),
  loader: async () => {
    const [arten, behandler] = await Promise.all([
      supabase
        .from("appointment_types")
        .select("id, name, kurztext, dauer_minuten, practitioner_id, art_kategorie")
        .eq("aktiv", true)
        .eq("online_buchbar", true)
        .order("sortierung"),
      supabase.from("practitioners").select("id, name, bezeichnung").eq("aktiv", true),
    ]);
    return { arten: arten.data ?? [], behandler: behandler.data ?? [] };
  },
  component: TerminSeite,
});

function TerminSeite() {
  const { arten, behandler } = Route.useLoaderData();
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

  if (fertig && art) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Geschafft" title="Dein Termin steht">
          <p>Wir haben deine Buchung erhalten und melden uns bei Fragen unter {email}.</p>
        </PageHero>
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-[640px] px-5 sm:px-8">
            <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft-md)]">
              <div className="mb-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-6" aria-hidden="true" />
              </div>
              <p className="font-display text-2xl text-primary">{art.name}</p>
              <p className="mt-2 text-lg text-secondary">
                {gewaehlt
                  ? format(parseISO(gewaehlt), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de })
                  : null}
              </p>
              <p className="mt-6 text-[0.95rem]">
                Du musst nichts weiter tun. Falls du den Termin nicht wahrnehmen kannst, gib uns
                bitte rechtzeitig Bescheid – telefonisch unter {praxis.telefon}.
              </p>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Termin buchen" title="In drei Schritten zum Termin">
        <p>
          Erst sagst du uns, ob du neu bei uns bist. Dann wählst du die Behandlung – und zum Schluss
          suchst du dir im Kalender eine freie Zeit aus.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[980px] px-5 sm:px-8">
          <ol className="mb-8 flex flex-wrap gap-2" aria-label="Fortschritt">
            {["Anlass", "Behandlung", "Termin im Kalender"].map((label, i) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                  schritt === i + 1
                    ? "bg-primary font-semibold text-primary-foreground"
                    : schritt > i + 1
                      ? "bg-sage/35 text-primary"
                      : "bg-card text-muted-foreground"
                }`}
                aria-current={schritt === i + 1 ? "step" : undefined}
              >
                <span className="text-xs">{i + 1}</span> {label}
              </li>
            ))}
          </ol>

          {schritt === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  {
                    wert: "erstbehandlung" as const,
                    icon: Sparkles,
                    titel: "Erstbehandlung",
                    text: "Du kommst zum ersten Mal zu uns. Wir nehmen uns extra Zeit für deine Geschichte.",
                  },
                  {
                    wert: "folgetermin" as const,
                    icon: Repeat,
                    titel: "Folgetermin",
                    text: "Du warst schon bei uns und möchtest die Behandlung fortsetzen.",
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
                  className="rounded-3xl bg-card p-7 text-left shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-md)]"
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

          {schritt === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setKategorie(null)}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden="true" /> Zurück
              </button>

              {passende.length === 0 ? (
                <div className="rounded-2xl bg-card p-6">
                  <p className="text-primary">
                    Für diesen Anlass ist gerade keine Behandlung online buchbar.
                  </p>
                  <Button asChild variant="pill" size="pill" className="mt-4">
                    <a href={praxis.telefonHref}>
                      <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
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
                        className="rounded-2xl bg-card p-6 text-left shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-md)]"
                      >
                        <p className="font-display text-lg text-primary">{a.name}</p>
                        {a.kurztext ? (
                          <p className="mt-2 text-[0.92rem] text-muted-foreground">{a.kurztext}</p>
                        ) : null}
                        <p className="mt-4 flex flex-wrap items-center gap-3 text-xs text-secondary">
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

          {schritt === 3 && art ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setArtId(null);
                  setGewaehlt(null);
                }}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden="true" /> Andere Behandlung wählen
              </button>

              <div className="mb-6 rounded-2xl bg-card px-5 py-4">
                <p className="font-display text-lg text-primary">{art.name}</p>
                <p className="mt-1 text-sm text-secondary">
                  {person?.name ?? "Praxis Kube"} · {art.dauer_minuten ?? 60} Minuten
                </p>
              </div>

              {laedt ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Freie Zeiten werden
                  geladen …
                </p>
              ) : (slots ?? []).length === 0 ? (
                <div className="rounded-2xl bg-card p-6">
                  <p className="text-primary">
                    Für diese Behandlung sind gerade keine Zeiten online buchbar.
                  </p>
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
                />
              )}

              {gewaehlt ? (
                <div className="mt-8 rounded-3xl bg-creme p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
                  <p className="eyebrow mb-1">Gewählt</p>
                  <p className="mb-6 font-display text-xl text-primary">
                    {format(parseISO(gewaehlt), "EEEE, d. MMMM 'um' HH:mm 'Uhr'", { locale: de })}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5"
                        autoComplete="email"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="telefon">Telefon</Label>
                      <Input
                        id="telefon"
                        type="tel"
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                        className="mt-1.5"
                        autoComplete="tel"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="anliegen">Dein Anliegen</Label>
                      <Textarea
                        id="anliegen"
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
      </section>
    </SiteLayout>
  );
}
