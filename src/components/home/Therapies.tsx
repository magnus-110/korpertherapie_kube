import { Activity, Brain, FlaskConical, Hand } from "lucide-react";

const therapies = [
  {
    icon: Hand,
    title: "Osteopathie",
    by: "Manuelle Medizin",
    text: "Mit den Händen Spannungen aufspüren und lösen. Wir behandeln Bewegungsapparat, Faszien und innere Rhythmen – sanft und gezielt.",
  },
  {
    icon: Brain,
    title: "Psychotherapie",
    by: "Heilpraktiker für Psychotherapie",
    text: "Ein geschützter Raum für Belastungen, Ängste und Lebensfragen. Gespräche, die entlasten und neue Wege sichtbar machen.",
  },
  {
    icon: FlaskConical,
    title: "Laboruntersuchungen",
    by: "Naturheilkunde",
    text: "Vitalstoffe, Hormone, Darmgesundheit: fundierte Diagnostik als Grundlage für eine individuelle, natürliche Therapie.",
  },
  {
    icon: Activity,
    title: "Sportheilkunde",
    by: "Bewegung & Prävention",
    text: "Beschwerden nach Belastung behandeln und vorbeugen. Für Freizeitsport, Wiedereinstieg und mehr Beweglichkeit im Alltag.",
  },
];

export function Therapies() {
  return (
    <section id="therapien" className="bg-card py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="mb-10 max-w-[60ch] lg:mb-14">
          <p className="eyebrow mb-4">Unsere Therapien</p>
          <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Vier Wege, die sich gegenseitig ergänzen.
          </h2>
          <p className="mt-4 text-foreground">
            Je nach Anliegen kombinieren wir körperliche und seelische Behandlung – damit Ursache
            und Wirkung zusammen betrachtet werden.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {therapies.map(({ icon: Icon, title, by, text }) => (
            <article
              key={title}
              className="rounded-3xl bg-background p-8 shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft-md)]"
            >
              <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl">{title}</h3>
              <p className="my-2 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-secondary">
                {by}
              </p>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
