import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const infos = [
  { icon: MapPin, label: "Praxis", value: "Dieselstraße 16, 86368 Gersthofen" },
  { icon: Phone, label: "Telefon", value: "Nach Vereinbarung" },
  { icon: Mail, label: "E-Mail", value: "praxis@koerpertherapie-kube.de" },
  { icon: Clock, label: "Termine", value: "Montag bis Freitag, nach Absprache" },
];

export function Contact() {
  return (
    <section id="kontakt" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow mb-4">Kontakt</p>
          <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Wir freuen uns, dich kennenzulernen.
          </h2>
          <p className="mt-4 max-w-[50ch]">
            Schreib uns kurz, worum es geht – wir melden uns zeitnah und finden gemeinsam einen
            passenden Termin.
          </p>

          <ul className="mt-8 grid gap-5">
            {infos.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-tint text-secondary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[0.78rem] font-bold uppercase tracking-[0.1em] text-secondary">
                    {label}
                  </span>
                  <span className="block text-[1.08rem] font-semibold text-primary">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-primary p-10 shadow-[var(--shadow-soft-md)]">
          <h3 className="text-2xl text-primary-foreground">Termin buchen</h3>
          <p className="mb-7 mt-4 text-sage-tint">
            Die Online-Terminbuchung öffnet in Kürze. Bis dahin erreichst du uns direkt per E-Mail –
            wir antworten persönlich.
          </p>
          <Button asChild variant="pillLight" size="pill">
            <a href="mailto:praxis@koerpertherapie-kube.de">Anfrage senden</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
