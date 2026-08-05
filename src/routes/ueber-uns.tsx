import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

const title = "Über uns – Sabrina & Björn Kube | Praxis Gersthofen";
const description =
  "Lerne die Menschen hinter der Praxis kennen: Sabrina Schuster-Kube (Psychotherapie HeilprG, Laboranalytik) und Björn Kube (Osteopathie, Sportheilkunde).";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ueber-uns" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ueber-uns" }],
  }),
  component: UeberUnsPage,
});

const team = [
  {
    name: "Sabrina Schuster-Kube",
    schwerpunkte: "Psychotherapie (HeilprG) · Laboranalytik · Verwaltung",
    text: "Begleitet dich verhaltenstherapeutisch und behält mit fundierter Diagnostik das große Ganze im Blick. Ihr wichtigstes Werkzeug ist die Zeit, sich wirklich in deine Situation hineinzudenken.",
  },
  {
    name: "Björn Kube",
    schwerpunkte: "Osteopathie · Sportheilkunde",
    text: "Löst mit sanften, gezielten Handgriffen Blockaden und bringt Bewegung zurück in deinen Alltag – ruhig, aufmerksam und mit viel Gespür.",
  },
];

function UeberUnsPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Über uns" title="Die Menschen hinter der Praxis">
        <p>
          Wir sind Sabrina und Björn – Praxis- und Lebenspartner. Was uns verbindet, ist die
          Überzeugung, dass Gesundheit mehr ist als die Abwesenheit von Beschwerden. Deshalb
          verbinden wir in unserer Praxis zwei Perspektiven: die körperliche und die seelische.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1140px] gap-5 px-5 sm:px-8 md:grid-cols-2">
          {team.map((p) => (
            <article
              key={p.name}
              className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft-sm)]"
            >
              <h2 className="text-2xl">{p.name}</h2>
              <p className="my-2 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-secondary">
                {p.schwerpunkte}
              </p>
              <p>{p.text}</p>
              <p className="mt-4 text-sm italic text-muted-foreground">
                [Aus- und Weiterbildungen hier ergänzen.]
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-card py-14 sm:py-20">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
          <h2 className="max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.4rem)]">
            Warum Selbstfürsorge dazugehört
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg">
            Ein gesunder Körper und eine gesunde Seele beginnen mit einer freundlichen Haltung dir
            selbst gegenüber. Selbstfürsorge ist für uns kein Luxus, sondern die Grundlage jeder
            Heilung – und ein roter Faden durch alles, was wir tun. Wir möchten dich darin
            bestärken, gut mit dir umzugehen.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
          <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)]">Unsere Praxis</h2>
          <p className="mt-4 max-w-[52ch]">Ein Ort zum Ankommen und Durchatmen.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid aspect-[4/3] place-items-center rounded-3xl bg-sage-tint text-center text-sm font-semibold text-sage-foreground"
              >
                [Praxisfoto {i} ergänzen]
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Fotos: Bernd Schwarz.</p>
        </div>
      </section>

      <CtaBand title="Wir freuen uns darauf, dich kennenzulernen." />
    </SiteLayout>
  );
}
