import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { de } from "date-fns/locale";
import { format, isValid, parseISO, startOfDay } from "date-fns";
import { Mail, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { praxis } from "@/lib/praxis";

const title = "Termin buchen | Praxis Kube Gersthofen";
const description =
  "Wähle einen Wunschtermin in der Privatpraxis Kube in Gersthofen oder erreiche uns telefonisch und per E-Mail.";

type TerminSearch = { tag?: string | undefined };

/** Nimmt einen Tag im Format 2026-08-12 aus der Adresszeile entgegen. */
function leseTag(wert: unknown): string | undefined {
  if (typeof wert !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(wert)) return undefined;
  const d = parseISO(wert);
  if (!isValid(d) || d < startOfDay(new Date())) return undefined;
  return wert;
}

export const Route = createFileRoute("/termin")({
  validateSearch: (search: Record<string, unknown>): TerminSearch => ({
    tag: leseTag(search["tag"]),
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/termin" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/termin" }],
  }),
  component: TerminPage,
});

const steps = [
  "Wunschtermin wählen",
  "Anliegen kurz beschreiben",
  "Bestätigung per E-Mail erhalten",
];

function TerminPage() {
  const { tag } = Route.useSearch();
  const [date, setDate] = useState<Date | undefined>(() => (tag ? parseISO(tag) : undefined));

  return (
    <SiteLayout>
      <PageHero eyebrow="Termin buchen" title="Dein Termin – unkompliziert vereinbart">
        <p>
          Wähle einen Wunschtag aus. Wir prüfen die Verfügbarkeit und bestätigen dir den Termin
          persönlich. Lieber direkt sprechen? Ruf uns einfach an.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1140px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">In drei Schritten</h2>
            <ol className="mt-7 grid gap-5">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-semibold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-2 text-lg font-semibold text-primary">{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-3xl bg-card p-8 shadow-[var(--shadow-soft-sm)]">
              <h3 className="text-xl">Lieber persönlich?</h3>
              <p className="mt-3">Wir sind telefonisch für dich da und rufen auch gern zurück.</p>
              <div className="mt-6 flex flex-wrap gap-3.5">
                <Button asChild variant="pill" size="pill">
                  <a href={praxis.telefonHref}>
                    <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
                  </a>
                </Button>
                <Button asChild variant="pillOutline" size="pill">
                  <a href={`mailto:${praxis.email}`}>
                    <Mail className="size-4" aria-hidden="true" /> E-Mail schreiben
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)] sm:p-8">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Wunschtag wählen</h2>
            <div className="mt-6 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                {...(date ? { defaultMonth: date } : {})}
                locale={de}
                weekStartsOn={1}
                disabled={{ before: new Date() }}
                className="pointer-events-auto rounded-2xl bg-background p-3"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-sage-tint p-6 text-sage-foreground">
              {date ? (
                <p>
                  Gewählter Tag:{" "}
                  <strong>{format(date, "EEEE, d. MMMM yyyy", { locale: de })}</strong>. Die Anzeige
                  freier Uhrzeiten und die verbindliche Online-Buchung folgen in Kürze – bis dahin
                  melde dich bitte kurz telefonisch oder per E-Mail mit diesem Wunschtermin.
                </p>
              ) : (
                <p>
                  Wähle einen Tag aus, um deinen Wunschtermin vorzumerken. Die verbindliche
                  Online-Buchung mit freien Uhrzeiten folgt in Kürze.
                </p>
              )}
            </div>

            <div className="mt-6">
              <Button asChild variant="pill" size="pill" disabled={!date}>
                <a
                  href={`mailto:${praxis.email}?subject=${encodeURIComponent("Terminanfrage")}&body=${encodeURIComponent(
                    date
                      ? `Hallo, ich hätte gern einen Termin am ${format(date, "d. MMMM yyyy", { locale: de })}.`
                      : "Hallo, ich hätte gern einen Termin.",
                  )}`}
                >
                  Terminwunsch senden
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
