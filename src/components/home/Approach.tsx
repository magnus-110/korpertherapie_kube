import { Clock, HeartHandshake, Sprout } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Zeit & Ruhe",
    text: "Ausführliche Termine ohne Hektik. Raum, um wirklich zuzuhören.",
  },
  {
    icon: Sprout,
    title: "Ganzheitlich",
    text: "Körper und Seele gehören zusammen. Wir betrachten beides.",
  },
  {
    icon: HeartHandshake,
    title: "Auf Augenhöhe",
    text: "Verständlich erklärt, gemeinsam entschieden. Du gehst deinen Weg, wir gehen ihn mit.",
  },
];

export function Approach() {
  return (
    <section id="ansatz" className="bg-card py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="mb-10 max-w-[60ch] lg:mb-14">
          <p className="eyebrow mb-4">Unser Ansatz</p>
          <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Der Mensch im Mittelpunkt – nicht das Symptom.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-background p-8 shadow-[var(--shadow-soft-sm)]">
              <div className="mb-5 grid size-13 place-items-center rounded-full bg-sage-tint text-secondary">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2.5 text-xl">{title}</h3>
              <p className="text-[0.98rem]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
