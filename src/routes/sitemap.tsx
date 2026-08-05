import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

const title = "Sitemap | Praxis Kube Gersthofen";
const description = "Alle Seiten der Website der Praxis Kube in Gersthofen auf einen Blick.";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sitemap" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/sitemap" }],
  }),
  component: SitemapPage,
});

const groups = [
  {
    heading: "Hauptseiten",
    links: [
      { to: "/", label: "Startseite" },
      { to: "/therapien", label: "Therapien" },
      { to: "/ueber-uns", label: "Über uns" },
      { to: "/kontakt", label: "Kontakt & Anfahrt" },
      { to: "/termin", label: "Termin buchen" },
    ],
  },
  {
    heading: "Rechtliches",
    links: [
      { to: "/impressum", label: "Impressum" },
      { to: "/datenschutz", label: "Datenschutz" },
      { to: "/widerruf", label: "Widerruf" },
    ],
  },
  {
    heading: "Intern",
    links: [{ to: "/auth", label: "Anmeldung Praxisteam" }],
  },
] as const;

function SitemapPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Übersicht" title="Sitemap" />
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1140px] gap-10 px-5 sm:px-8 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.heading}>
              <h2 className="text-xl">{g.heading}</h2>
              <ul className="mt-4 grid gap-3">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="font-semibold text-primary hover:text-secondary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
