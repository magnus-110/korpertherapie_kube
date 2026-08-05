import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { praxis } from "@/lib/praxis";

const title = "Widerrufsbelehrung | Praxis Kube Gersthofen";
const description =
  "Widerrufsrecht bei online vereinbarten Behandlungsverträgen mit der Praxis Kube in Gersthofen.";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/widerruf" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/widerruf" }],
  }),
  component: WiderrufPage,
});

function WiderrufPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Rechtliches" title="Widerrufsbelehrung" />
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[70ch] gap-8 px-5 sm:px-8">
          <div>
            <h2 className="text-xl">Widerrufsrecht</h2>
            <p className="mt-3">
              Du hast das Recht, einen ausschließlich über Fernkommunikationsmittel geschlossenen
              Vertrag binnen vierzehn Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt
              mit dem Tag des Vertragsschlusses.
            </p>
          </div>
          <div>
            <h2 className="text-xl">Ausübung des Widerrufs</h2>
            <p className="mt-3">
              Um dein Widerrufsrecht auszuüben, informiere uns mittels einer eindeutigen Erklärung
              (z. B. Brief oder E-Mail):
            </p>
            <address className="mt-3 not-italic">
              {praxis.name}
              <br />
              {praxis.strasse}, {praxis.ort}
              <br />
              E-Mail: {praxis.email}
            </address>
            <p className="mt-3">
              Zur Wahrung der Frist genügt es, dass du die Mitteilung vor Ablauf der Frist absendest.
            </p>
          </div>
          <div>
            <h2 className="text-xl">Folgen des Widerrufs</h2>
            <p className="mt-3">
              Im Fall eines wirksamen Widerrufs erstatten wir bereits erhaltene Zahlungen
              unverzüglich zurück. Hast du ausdrücklich verlangt, dass die Behandlung schon während
              der Widerrufsfrist beginnt, schuldest du einen angemessenen Betrag für die bis dahin
              erbrachten Leistungen.
            </p>
          </div>
          <div>
            <h2 className="text-xl">Terminabsagen</h2>
            <p className="mt-3">
              Unabhängig vom Widerrufsrecht bitten wir dich, vereinbarte Termine möglichst
              frühzeitig abzusagen, damit wir die Zeit anderweitig vergeben können.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            [Dieser Text ist ein Entwurf und sollte vor Veröffentlichung rechtlich geprüft werden.]
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
