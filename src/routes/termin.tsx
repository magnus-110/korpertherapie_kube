import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, Check, Clock, Loader2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { praxis } from "@/lib/praxis";

const title = "Termin buchen | Praxis Kube Gersthofen";
const description =
  "Buche deinen Termin in der Privatpraxis Kube in Gersthofen online: Behandlung wählen, freie Zeit aussuchen, fertig.";

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
        .select("id, name, kurztext, dauer_minuten, practitioner_id")
        .eq("aktiv", true)
        .eq("online_buchbar", true)
        .order("sortierung"),
      supabase.from("practitioners").select("id, name, bezeichnung").eq("aktiv", true),
    ]);
    return { arten: arten.data ?? [], behandler: behandler.data ?? [] };
  },
  component: TerminSeite,
});

type Slot = { start_zeit: string; end_zeit: string };

function TerminSeite() {
  const { arten, behandler } = Route.useLoaderData();
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
        _bis: format(addDays(heute, 42), "yyyy-MM-dd"),
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

  const nachTagen = useMemo(() => {
    const karte = new Map<string, Slot[]>();
    for (const s of slots ?? []) {
      const tag = format(parseISO(s.start_zeit), "yyyy-MM-dd");
      karte.set(tag, [...(karte.get(tag) ?? []), s]);
    }
    return [...karte.entries()].slice(0, 14);
  }, [slots]);

  async function buchen() {
    if (!artId || !gewaehlt) return;
    setSendet(true);
    setFehler(null);
    const { error } = await supabase.rpc("termin_buchen", {
      _behandlungsart: artId,
      _start: gewaehlt,
      _name: name,
      _email: email,
      _telefon: telefon || null,
      _anliegen: anliegen || null,
    });
    setSendet(false);
    if (error) {
      setFehler(error.message.replace(/^.*?:\s*/, ""));
      return;
    }
    setFertig(true);
  }

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
      <PageHero eyebrow="Termin buchen" title="In zwei Schritten zum Termin">
        <p>
          Wähle zuerst die Behandlung. Danach zeigen wir dir die freien Zeiten der zuständigen
          Person.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          {!art ? (
            <>
              <p className="eyebrow mb-5">Schritt 1 von 2 · Behandlung wählen</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {arten.map((a) => {
                  const person = behandler.find((b) => b.id === a.practitioner_id);
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
                      <p className="mt-4 flex items-center gap-3 text-xs text-secondary">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {a.dauer_minuten ?? 60} Minuten
                        </span>
                        {person ? <span>· bei {person.name}</span> : null}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
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

              <div className="mb-8 rounded-2xl bg-card px-5 py-4">
                <p className="font-display text-lg text-primary">{art.name}</p>
                <p className="mt-1 text-sm text-secondary">
                  {behandler.find((b) => b.id === art.practitioner_id)?.name} ·{" "}
                  {art.dauer_minuten ?? 60} Minuten
                </p>
              </div>

              <p className="eyebrow mb-5">Schritt 2 von 2 · Zeit wählen</p>

              {laedt ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Freie Zeiten werden
                  geladen …
                </p>
              ) : nachTagen.length === 0 ? (
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
                <div className="grid gap-4">
                  {nachTagen.map(([tag, tagesSlots]) => (
                    <div key={tag} className="rounded-2xl bg-card p-5">
                      <p className="mb-3 font-display text-base text-primary">
                        {format(parseISO(tag), "EEEE, d. MMMM", { locale: de })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tagesSlots.map((s) => (
                          <button
                            key={s.start_zeit}
                            type="button"
                            onClick={() => setGewaehlt(s.start_zeit)}
                            className={`rounded-full px-4 py-2 text-sm transition-colors ${
                              gewaehlt === s.start_zeit
                                ? "bg-primary font-semibold text-primary-foreground"
                                : "bg-sage/25 text-primary hover:bg-sage/45"
                            }`}
                          >
                            {format(parseISO(s.start_zeit), "HH:mm")}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                      <Label htmlFor="anliegen">Dein Anliegen (optional)</Label>
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
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
