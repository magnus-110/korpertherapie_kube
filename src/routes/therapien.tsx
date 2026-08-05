import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

const title = "Therapien – Osteopathie, Psychotherapie & mehr | Praxis Kube";
const description =
  "Osteopathie, Psychotherapie nach HeilprG, Labor- und Nährstoffanalyse, Sportheilkunde sowie ergänzende Verfahren in der Privatpraxis Kube in Gersthofen.";

export const Route = createFileRoute("/therapien")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/therapien" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/therapien" }],
  }),
  component: TherapienPage,
});

const jumps = [
  { hash: "osteopathie", label: "Osteopathie" },
  { hash: "psychotherapie", label: "Psychotherapie" },
  { hash: "labor", label: "Labor & Nährstoffe" },
  { hash: "sportheilkunde", label: "Sportheilkunde" },
  { hash: "ergaenzend", label: "Ergänzende Therapien" },
];

function Section({
  id,
  heading,
  children,
  alt = false,
}: {
  id: string;
  heading: string;
  children: ReactNode;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 sm:py-20 ${alt ? "bg-card" : ""}`}>
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)]">{heading}</h2>
        <div className="mt-6 grid max-w-[70ch] gap-6">{children}</div>
      </div>
    </section>
  );
}

function Block({ title: t, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xl">{t}</h3>
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 pl-5">
      {items.map((i) => (
        <li key={i} className="list-disc">
          {i}
        </li>
      ))}
    </ul>
  );
}

function Behandler({ label, name }: { label: string; name: string }) {
  return (
    <p className="text-[0.9rem] font-bold uppercase tracking-[0.1em] text-secondary">
      {label}: {name}
    </p>
  );
}

function TherapienPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Therapien" title="Behandlungen, die den ganzen Menschen sehen">
        <p>
          Von sanfter manueller Therapie bis zur seelischen Begleitung – hier findest du alles,
          wobei wir dich unterstützen.
        </p>
        <nav className="mt-7 flex flex-wrap gap-2.5" aria-label="Abschnitte auf dieser Seite">
          {jumps.map((j) => (
            <a
              key={j.hash}
              href={`#${j.hash}`}
              className="rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary shadow-[var(--shadow-soft-sm)] transition-colors hover:text-secondary"
            >
              {j.label}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section id="osteopathie" heading="Osteopathie">
        <Block title="Was ist das?">
          <p>
            Eine sanfte, rein manuelle Behandlung: Mit den Händen spüren wir Spannungen und
            Bewegungseinschränkungen auf, lösen sie behutsam und regen die Selbstregulation deines
            Körpers an.
          </p>
        </Block>
        <Block title="Wobei sie helfen kann">
          <List
            items={[
              "Rücken-, Nacken- und Gelenkbeschwerden",
              "Spannungskopfschmerzen und Verspannungen",
              "Beschwerden nach Verletzungen oder Fehlbelastung",
              "funktionelle Beschwerden ohne klaren Befund",
            ]}
          />
        </Block>
        <Block title="So läuft es ab">
          <p>
            Wir beginnen mit einem ausführlichen Gespräch und einer gründlichen Untersuchung. Darauf
            abgestimmt behandeln wir – und besprechen mit dir, was du selbst zwischen den Terminen
            tun kannst.
          </p>
        </Block>
        <Behandler label="Behandler" name="Björn Kube" />
      </Section>

      <Section id="psychotherapie" heading="Psychotherapie (HeilprG)" alt>
        <Block title="Was ist das?">
          <p>
            Eine verhaltenstherapeutisch orientierte Begleitung. Gemeinsam erkennen wir belastende
            Denk- und Verhaltensmuster und entwickeln neue, hilfreiche Strategien – Schritt für
            Schritt.
          </p>
        </Block>
        <p>
          <strong>Ein weit verbreiteter Irrtum:</strong> Psychotherapie ist nicht nur etwas für
          schwere Krisen. Sie kann in vielen Lebenslagen helfen – oft gerade dann, wenn man das
          Gefühl hat, „es ist ja nicht so schlimm".
        </p>
        <Block title="Wobei sie helfen kann">
          <List
            items={[
              "Stress und Überforderung",
              "Grübeln und kreisende Gedanken",
              "Schlafprobleme",
              "Ängste und Unsicherheit",
              "Konflikte in Beruf und Beziehung",
            ]}
          />
        </Block>
        <p className="rounded-3xl bg-sage-tint p-6 text-sage-foreground">
          <strong>Gut zu wissen:</strong> Die Behandlung erfolgt nach dem Heilpraktikergesetz
          (HeilprG) und ist eine reine Privatleistung. Eine Abrechnung über die gesetzliche
          Krankenkasse ist nicht möglich.
        </p>
        <Behandler label="Behandlerin" name="Sabrina Schuster-Kube" />
      </Section>

      <Section id="labor" heading="Laboruntersuchungen & Nährstoffanalyse">
        <Block title="Was ist das?">
          <p>
            Gezielte Labordiagnostik und eine Analyse deiner Nährstoffversorgung – die fundierte
            Basis, um Beschwerden zu verstehen, statt zu raten.
          </p>
        </Block>
        <Block title="Wozu es dient">
          <List
            items={[
              "versteckte Nährstofflücken sichtbar machen",
              "Ursachen von Müdigkeit, Erschöpfung oder Unwohlsein eingrenzen",
              "eine gezielte, individuelle Empfehlung statt Pauschallösung",
            ]}
          />
        </Block>
        <Block title="So läuft es ab">
          <p>
            Probenentnahme in der Praxis, sorgfältige Auswertung und ein gemeinsames Gespräch, in
            dem wir die Ergebnisse verständlich einordnen und die nächsten Schritte festlegen.
          </p>
        </Block>
      </Section>

      <Section id="sportheilkunde" heading="Sportheilkunde" alt>
        <Block title="Was ist das?">
          <p>Bewegung gezielt als Therapie eingesetzt – abgestimmt auf deinen Körper und dein Ziel.</p>
        </Block>
        <Block title="Wobei sie helfen kann">
          <List
            items={[
              "Vorbeugen von Beschwerden (Prävention)",
              "Regeneration nach Verletzung oder Belastung",
              "Aufbau von Kraft, Stabilität und Beweglichkeit",
            ]}
          />
        </Block>
        <Block title="So läuft es ab">
          <p>
            Nach einer kurzen Einschätzung deiner Belastbarkeit stellen wir gemeinsam einen Plan
            zusammen, der zu deinem Alltag passt.
          </p>
        </Block>
      </Section>

      <Section id="ergaenzend" heading="Ergänzende Therapien">
        <p>Diese Verfahren setzen wir begleitend ein, wenn sie zu deiner Behandlung passen:</p>
        <List
          items={[
            "Neuraltherapie – gezielte Behandlung mit feinen Injektionen zur Schmerz- und Regulationstherapie.",
            "Medizinisches Taping – elastische Tapes, die Muskeln und Gelenke unterstützen, ohne die Bewegung einzuschränken.",
            "Pflanzenheilkunde – bewährte pflanzliche Mittel als sanfte Begleitung.",
            "Pflanzenbasierte Ernährung & Nahrungsergänzung – Ernährung als tragender Baustein deiner Gesundheit.",
          ]}
        />
      </Section>

      <CtaBand
        title="Nicht sicher, was zu dir passt?"
        text="Ruf uns an – wir beraten dich gern und finden gemeinsam den passenden Weg."
      />
    </SiteLayout>
  );
}
