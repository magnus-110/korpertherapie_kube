import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BodyMap } from "@/components/home/BodyMap";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1140px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div className="order-1">
          <p className="eyebrow mb-4">
            Privatpraxis für Osteopathie, Naturheilkunde &amp; Psychotherapie · Gersthofen
          </p>
          <h1 className="max-w-[16ch] text-[clamp(2.1rem,5.2vw,4rem)] font-semibold tracking-tight">
            Tu deinem Körper etwas Gutes, damit deine Seele Lust hat, darin zu wohnen.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-primary">
            Wir schauen auf den ganzen Menschen – mit Zeit, Fachwissen und einem offenen Ohr. Für
            mehr Gesundheit, innere Balance und Wohlbefinden.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button asChild variant="pill" size="pill">
              <Link to="/termin">
                <CalendarDays className="size-4" aria-hidden="true" /> Termin buchen
              </Link>
            </Button>
            <Button asChild variant="pillOutline" size="pill">
              <a href="#kalender">Freien Tag finden</a>
            </Button>
          </div>
        </div>

        <div className="order-2">
          <BodyMap />
        </div>
      </div>
    </section>
  );
}
