import { createFileRoute } from "@tanstack/react-router";
import { Car, Clock, Mail, MapPin, Phone, Train } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { praxis } from "@/lib/praxis";

const title = "Kontakt & Anfahrt | Praxis Kube Gersthofen";
const description = `So erreichst du uns: ${praxis.strasse}, ${praxis.ort}. Telefon ${praxis.telefon}, E-Mail ${praxis.email} – oder schreib uns direkt über das Kontaktformular.`;

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/kontakt" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
  component: KontaktPage,
});

const infos = [
  { icon: MapPin, label: "Adresse", value: `${praxis.strasse}, ${praxis.ort}` },
  { icon: Phone, label: "Telefon", value: praxis.telefon, href: praxis.telefonHref },
  { icon: Mail, label: "E-Mail", value: praxis.email, href: `mailto:${praxis.email}` },
  { icon: Clock, label: "Termine", value: "Nach Vereinbarung, Montag bis Freitag" },
];

const faq = [
  {
    q: "Muss ich privat versichert sein?",
    a: "Nein. Unsere Leistungen sind Privatleistungen – du kannst sie auch als gesetzlich versicherte Person in Anspruch nehmen und selbst bezahlen. Ob deine Zusatzversicherung etwas erstattet, klärst du am besten vorab mit ihr.",
  },
  {
    q: "Was kostet eine Behandlung?",
    a: "Die Kosten richten sich nach Art und Dauer der Behandlung. Sag uns kurz Bescheid, worum es geht – wir nennen dir vorab transparent den Preis.",
  },
  {
    q: "Wie lange dauert ein Termin?",
    a: "Erstgespräche planen wir bewusst großzügig. Folgetermine sind in der Regel kürzer. Den genauen Zeitrahmen besprechen wir bei der Terminvergabe.",
  },
  {
    q: "Was passiert beim ersten Termin?",
    a: "Zuerst ein ausführliches Gespräch, dann eine gründliche Untersuchung. Danach besprechen wir gemeinsam, welcher Weg für dich passt.",
  },
  {
    q: "Kann ich einen Termin absagen?",
    a: "Ja, bitte möglichst frühzeitig telefonisch oder per E-Mail, damit wir die Zeit anderweitig vergeben können.",
  },
];

function KontaktPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Kontakt & Anfahrt" title="So erreichst du uns">
        <p>
          Ruf uns an, schreib uns eine E-Mail oder nutze das Formular – wir melden uns so bald wie
          möglich bei dir zurück.
        </p>
      </PageHero>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-[1140px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Kontakt</h2>
            <ul className="mt-7 grid gap-5">
              {infos.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-tint text-secondary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.78rem] font-bold uppercase tracking-[0.1em] text-secondary">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="block text-[1.08rem] font-semibold text-primary hover:text-secondary"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="block text-[1.08rem] font-semibold text-primary">
                        {value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-12 text-xl">Anfahrt</h3>
            <ul className="mt-5 grid gap-4">
              <li className="flex items-start gap-4">
                <Car className="mt-1 size-5 shrink-0 text-secondary" aria-hidden="true" />
                <span>Mit dem Auto: Parkmöglichkeiten befinden sich in unmittelbarer Nähe.</span>
              </li>
              <li className="flex items-start gap-4">
                <Train className="mt-1 size-5 shrink-0 text-secondary" aria-hidden="true" />
                <span>
                  Mit Bus &amp; Bahn: gut erreichbar aus Augsburg und Umgebung. [Haltestelle
                  ergänzen.]
                </span>
              </li>
            </ul>

            <div className="mt-7 overflow-hidden rounded-3xl">
              <iframe
                title={`Karte: Anfahrt zur Praxis in ${praxis.ort}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=10.86%2C48.42%2C10.92%2C48.45&layer=mapnik&marker=48.4356%2C10.8895`}
                className="h-[300px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft-sm)]">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Schreib uns</h2>
            <p className="mb-7 mt-3">
              Erzähl uns kurz, worum es geht – wir melden uns persönlich bei dir.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-card py-14 sm:py-20">
        <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="mt-7 max-w-[70ch]">
            {faq.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-lg font-semibold text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}
