import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroTermine } from "@/components/home/HeroTermine";

const fachgebiete = ["Osteopathie", "Psychotherapie", "Labordiagnostik", "Sportheilkunde"];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
      {/* Feines Papierkorn – nimmt der Fläche das Digital-Glatte */}
      <svg
        className="pointer-events-none absolute inset-0 size-full opacity-[0.055]"
        aria-hidden="true"
      >
        <filter id="kubeKorn">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} />
        </filter>
        <rect width="100%" height="100%" filter="url(#kubeKorn)" />
      </svg>

      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-8">
        {/* Monogramm als Wasserzeichen */}
        <span
          className="pointer-events-none absolute right-6 top-8 select-none font-display text-[clamp(6rem,14vw,11rem)] leading-none tracking-tight text-primary opacity-[0.045]"
          aria-hidden="true"
        >
          KK
        </span>

        <div className="animate-rise relative border-t border-primary/20 pt-2.5">
          <p className="text-[0.65rem] font-bold uppercase leading-relaxed tracking-[0.19em] text-secondary">
            {fachgebiete.join(" · ")}
          </p>
        </div>

        <div className="relative mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-[1.42fr_0.9fr] lg:gap-14">
          <div>
            <h1
              className="animate-rise font-display text-[clamp(2.2rem,4.8vw,3.5rem)] font-normal leading-[1.08] tracking-tight text-primary"
              style={{ animationDelay: "0.08s" }}
            >
              Tu deinem Körper
              <br />
              etwas Gutes,
            </h1>

            <div
              className="animate-rise my-4 h-px w-[42%] max-w-[280px] bg-primary/25"
              style={{ animationDelay: "0.14s" }}
              aria-hidden="true"
            />

            <p
              className="animate-rise border-l border-secondary/30 pl-4 font-display text-[clamp(1.2rem,2.4vw,1.6rem)] italic leading-snug text-secondary"
              style={{ animationDelay: "0.2s" }}
            >
              damit deine Seele Lust hat,
              <br />
              darin zu wohnen.
            </p>

            <div className="animate-rise mt-9" style={{ animationDelay: "0.28s" }}>
              <Button asChild variant="pillOutline" size="pill">
                <Link to="/therapien">
                  Therapien ansehen <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <p
              className="animate-rise mt-10 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-secondary/70"
              style={{ animationDelay: "0.34s" }}
            >
              Gersthofen · Termine nach Vereinbarung
            </p>
          </div>

          <div className="animate-rise" style={{ animationDelay: "0.22s" }}>
            <HeroTermine />
          </div>
        </div>
      </div>
    </section>
  );
}
