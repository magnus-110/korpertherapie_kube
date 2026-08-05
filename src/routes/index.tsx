import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Brain, FlaskConical, Hand } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CtaBand } from "@/components/site/CtaBand";
import { Hero } from "@/components/home/Hero";
import { BookingTeaser } from "@/components/home/BookingTeaser";
import { Approach } from "@/components/home/Approach";
import { Button } from "@/components/ui/button";
import { praxis } from "@/lib/praxis";
import praxisRaum from "@/assets/praxis-raum.jpg";

const title = "Körpertherapie und Psychotherapie Kube · Gersthofen";
const description =
  "Privatpraxis in Gersthofen für Osteopathie, Psychotherapie, Labordiagnostik und Sportheilkunde – ganzheitlich, mit Zeit und auf Augenhöhe.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: praxis.name,
          telephone: praxis.telefon,
          address: {
            "@type": "PostalAddress",
            streetAddress: praxis.strasse,
            postalCode: "86368",
            addressLocality: "Gersthofen",
            addressCountry: "DE",
          },
        }),
      },
    ],
  }),
  component: Index,
});

const teaser = [
  {
    icon: Hand,
    title: "Osteopathie",
    text: "Blockaden sanft lösen, Beweglichkeit zurückgewinnen.",
    hash: "osteopathie",
  },
  {
    icon: Brain,
    title: "Psychotherapie",
    text: "Halt bei Stress, Grübeln, Schlafproblemen und Krisen.",
    hash: "psychotherapie",
  },
  {
    icon: FlaskConical,
    title: "Labor & Nährstoffanalyse",
    text: "Fundierte Diagnostik statt Raten.",
    hash: "labor",
  },
  {
    icon: Activity,
    title: "Sportheilkunde",
    text: "Bewegung gezielt als Therapie.",
    hash: "sportheilkunde",
  },
];

function Index() {
  return (
    <SiteLayout>
      <Hero />

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h2 className="max-w-[22ch] text-[clamp(1.8rem,3.6vw,2.6rem)]">
              Schön, dass du da bist.
            </h2>
            <p className="mt-5 max-w-[62ch] text-lg">
              Bei uns stehst du im Mittelpunkt – mit deiner Geschichte, deinen Beschwerden und
              deinen Zielen. Wir nehmen uns Zeit, verstehen gemeinsam mit dir die Ursachen deiner
              Symptome und verbinden bewährte medizinische Erkenntnisse mit ganzheitlichen Methoden.
              In einer ruhigen, vertrauensvollen Atmosphäre, in der du dich sicher und gut
              aufgehoben fühlst.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border-8 border-creme shadow-[var(--shadow-soft-lg)]">
            <img
              src={praxisRaum}
              alt="Heller, ruhiger Behandlungsraum der Praxis Kube in Gersthofen"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-[4/3] size-full object-cover"
            />
          </div>
        </div>
      </section>

      <Approach />

      <BookingTeaser />

      <section className="bg-card py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
          <div className="mb-10 max-w-[60ch]">
            <p className="eyebrow mb-4">Therapien</p>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">Wobei wir dich begleiten</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {teaser.map(({ icon: Icon, title: t, text, hash }) => (
              <Link
                key={t}
                to="/therapien"
                hash={hash}
                className="rounded-3xl bg-background p-8 shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft-md)]"
              >
                <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl">{t}</h3>
                <p className="mt-2">{text}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="pillOutline" size="pill">
              <Link to="/therapien">
                Alle Therapien ansehen <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
          <p className="eyebrow mb-4">Über uns</p>
          <h2 className="max-w-[22ch] text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Zwei Menschen, ein gemeinsamer Weg
          </h2>
          <p className="mt-5 max-w-[58ch] text-lg">
            Als Praxis- und Lebenspartner verbinden wir zwei Blickwinkel auf Gesundheit – den
            körperlichen und den seelischen.
          </p>
          <div className="mt-8">
            <Button asChild variant="pillOutline" size="pill">
              <Link to="/ueber-uns">
                Lerne uns kennen <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary py-14 sm:py-20 lg:py-24">
        <div
          className="blob-shape absolute -bottom-40 -right-16 size-[420px] bg-sage opacity-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1140px] px-5 sm:px-8">
          <p className="max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-medium leading-snug text-secondary-foreground">
            „Gesundheit ist kein Zustand, sondern ein Gleichgewicht."
          </p>
          <p className="mt-5 max-w-[50ch] text-lg text-sage-tint">
            Wir helfen dir, es zu finden – mit Fachwissen, Zeit und einem ehrlichen Miteinander.
          </p>
        </div>
      </section>

      <CtaBand
        title="Bereit für den ersten Schritt?"
        text="Buche deinen Termin online oder ruf uns einfach an – wir freuen uns auf dich."
      />
    </SiteLayout>
  );
}
