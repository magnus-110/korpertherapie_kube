import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import praxisRaum from "@/assets/praxis-raum.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="order-2 lg:order-1">
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
              <Link to="/termin">Termin buchen</Link>
            </Button>
            <Button asChild variant="pillOutline" size="pill">
              <Link to="/therapien">Unsere Therapien</Link>
            </Button>
          </div>
        </div>

        <div className="relative order-1 grid min-h-[320px] place-items-center lg:order-2 lg:min-h-[420px]">
          <div
            className="blob-shape animate-float absolute inset-0 m-auto aspect-square w-[min(430px,90%)] bg-sage opacity-45"
            aria-hidden="true"
          />
          <div
            className="blob-shape animate-float absolute inset-0 m-auto aspect-square w-[min(360px,78%)] bg-secondary opacity-15 [animation-delay:-3s] [animation-duration:11s]"
            aria-hidden="true"
          />
          <div className="relative aspect-square w-[min(330px,74%)] overflow-hidden rounded-full border-8 border-creme shadow-[var(--shadow-soft-lg)]">
            <img
              src={praxisRaum}
              alt="Heller, ruhiger Behandlungsraum der Praxis Kube in Gersthofen"
              width={1024}
              height={1024}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
