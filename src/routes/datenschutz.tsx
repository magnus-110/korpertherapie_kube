import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { praxis } from "@/lib/praxis";

const title = "Datenschutzerklärung | Praxis Kube Gersthofen";
const description = `Informationen zum Umgang mit personenbezogenen Daten auf der Website der Praxis ${praxis.name}.`;

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/datenschutz" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/datenschutz" }],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Rechtliches" title="Datenschutzerklärung">
        <p>
          Der Schutz deiner Daten ist uns wichtig – besonders im Gesundheitsbereich. Hier erfährst
          du, welche Daten wir verarbeiten und warum.
        </p>
      </PageHero>
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[70ch] gap-8 px-5 sm:px-8">
          <div>
            <h2 className="text-xl">1. Verantwortliche Stelle</h2>
            <address className="mt-3 not-italic">
              {praxis.name}
              <br />
              {praxis.strasse}, {praxis.ort}
              <br />
              Telefon: {praxis.telefon} · E-Mail: {praxis.email}
            </address>
          </div>
          <div>
            <h2 className="text-xl">2. Zugriffsdaten</h2>
            <p className="mt-3">
              Beim Aufruf dieser Website werden technisch notwendige Daten (z. B. IP-Adresse,
              Zeitpunkt, aufgerufene Seite) verarbeitet, um die Auslieferung und Sicherheit der
              Website zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </div>
          <div>
            <h2 className="text-xl">3. Kontaktformular</h2>
            <p className="mt-3">
              Wenn du uns über das Kontaktformular schreibst, speichern wir deinen Namen, deine
              E-Mail-Adresse, optional deine Telefonnummer und deine Nachricht, um die Anfrage zu
              bearbeiten (Art. 6 Abs. 1 lit. b und f DSGVO). Bitte sende über das Formular keine
              Gesundheitsdaten – dafür nutzen wir das persönliche Gespräch.
            </p>
          </div>
          <div>
            <h2 className="text-xl">4. Auftragsverarbeitung / Hosting</h2>
            <p className="mt-3">
              Website-Hosting und Datenbank werden von Dienstleistern im Auftrag betrieben. [Namen
              und Sitz der Anbieter sowie Angaben zum Auftragsverarbeitungsvertrag hier ergänzen.]
            </p>
          </div>
          <div>
            <h2 className="text-xl">5. Kartendarstellung</h2>
            <p className="mt-3">
              Auf der Kontaktseite binden wir eine Karte von OpenStreetMap ein. Dabei wird deine
              IP-Adresse an den Kartenanbieter übertragen.
            </p>
          </div>
          <div>
            <h2 className="text-xl">6. Patientendaten</h2>
            <p className="mt-3">
              Behandlungsdaten verarbeiten wir ausschließlich im geschützten, passwortgesicherten
              Praxisbereich – niemals öffentlich auf dieser Website. Rechtsgrundlage sind Art. 9
              Abs. 2 lit. h DSGVO sowie die gesetzlichen Aufbewahrungsfristen.
            </p>
          </div>
          <div>
            <h2 className="text-xl">7. Deine Rechte</h2>
            <p className="mt-3">
              Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
              Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Außerdem kannst du dich bei
              einer Datenschutz-Aufsichtsbehörde beschweren.
            </p>
          </div>
          <div>
            <h2 className="text-xl">8. Speicherdauer</h2>
            <p className="mt-3">
              Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck
              erforderlich ist oder gesetzliche Aufbewahrungsfristen es vorschreiben.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            [Diese Datenschutzerklärung ist ein Entwurf und sollte vor Veröffentlichung rechtlich
            geprüft werden.]
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
