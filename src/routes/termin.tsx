import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { BuchungsWizard } from "@/components/site/BuchungsWizard";

const title = "Termin buchen | Praxis Kube Gersthofen";
const description =
  "Finde deine Zeit in der Privatpraxis Kube in Gersthofen: freie Termine live im Kalender sehen und in wenigen Klicks verbindlich sichern.";

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
  component: TerminSeite,
});

function TerminSeite() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Termin buchen" title="Zeit für dich – ein Platz wartet schon">
        <p>
          Kein Warten in der Leitung, kein Hin und Her: Du siehst die freien Zeiten direkt im
          Kalender und sicherst dir die, die zu deinem Leben passt.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[980px] px-5 sm:px-8">
          <BuchungsWizard />
        </div>
      </section>
    </SiteLayout>
  );
}
