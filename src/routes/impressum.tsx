import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { praxis } from "@/lib/praxis";

const title = "Impressum | Praxis Kube Gersthofen";
const description = `Impressum und Anbieterkennzeichnung der Praxis ${praxis.name} in Gersthofen.`;

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/impressum" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/impressum" }],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Rechtliches" title="Impressum" />
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[70ch] gap-8 px-5 sm:px-8">
          <div>
            <h2 className="text-xl">Angaben gemäß § 5 DDG</h2>
            <address className="mt-3 not-italic">
              {praxis.name}
              <br />
              {praxis.strasse}
              <br />
              {praxis.ort}
              <br />
              Deutschland
            </address>
          </div>
          <div>
            <h2 className="text-xl">Kontakt</h2>
            <p className="mt-3">
              Telefon: {praxis.telefon}
              <br />
              E-Mail: {praxis.email}
            </p>
          </div>
          <div>
            <h2 className="text-xl">Vertreten durch</h2>
            <p className="mt-3">Sabrina Schuster-Kube, Björn Kube</p>
          </div>
          <div>
            <h2 className="text-xl">Berufsrechtliche Angaben</h2>
            <p className="mt-3">
              [Berufsbezeichnung, zuständige Aufsichtsbehörde (Gesundheitsamt), berufsrechtliche
              Regelungen (Heilpraktikergesetz) und ggf. Umsatzsteuer-Identifikationsnummer hier
              ergänzen.]
            </p>
          </div>
          <div>
            <h2 className="text-xl">Redaktionell verantwortlich</h2>
            <p className="mt-3">
              [Name und Anschrift der verantwortlichen Person hier ergänzen.]
            </p>
          </div>
          <div>
            <h2 className="text-xl">Streitschlichtung</h2>
            <p className="mt-3">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
          <div>
            <h2 className="text-xl">Bildnachweise</h2>
            <p className="mt-3">Praxisfotos: Bernd Schwarz. [Weitere Nachweise ergänzen.]</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
