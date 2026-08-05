import { Clock, HeartHandshake, Sprout } from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Zeit & Ruhe",
    text: "Ausführliche Termine ohne Hektik. Raum, um wirklich zuzuhören und gemeinsam zu verstehen, was dir guttut.",
  },
  {
    icon: Sprout,
    title: "Ganzheitlich",
    text: "Körper, Seele und Alltag gehören zusammen. Wir schauen auf Zusammenhänge statt nur auf einzelne Symptome.",
  },
  {
    icon: HeartHandshake,
    title: "Auf Augenhöhe",
    text: "Du entscheidest mit. Wir erklären jeden Schritt verständlich und begleiten dich in deinem Tempo.",
  },
];

export function Approach() {
  return (
    <section id="ansatz" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="mb-10 max-w-[60ch] lg:mb-14">
          <p className="eyebrow mb-4">So arbeiten wir</p>
          <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Der Mensch im Mittelpunkt – nicht das Symptom.
          </h2>
          <p className="mt-4 text-foreground">
            Wir nehmen uns Zeit, um zu verstehen, was wirklich hinter deinen Beschwerden steckt.
            Körper und Seele gehören für uns zusammen – und genauso behandeln wir sie.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft-sm)]">
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
