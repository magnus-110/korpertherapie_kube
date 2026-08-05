import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const fachgebiete = ["Osteopathie", "Psychotherapie", "Labordiagnostik", "Sportheilkunde"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10">
      {/* Grosses, dezentes KK-Zeichen im Hintergrund */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sand opacity-50"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" className="h-auto w-[min(88vw,560px)]">
          <circle cx="200" cy="200" r="196" stroke="currentColor" strokeWidth="1" />
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize="180"
            fontWeight="300"
            letterSpacing="-4"
            className="font-display"
          >
            KK
          </text>
        </svg>
      </div>

      {/* Feines Papierkorn */}
      <svg
        className="pointer-events-none absolute inset-0 size-full opacity-[0.05]"
        aria-hidden="true"
      >
        <filter id="kubeKorn">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} />
        </filter>
        <rect width="100%" height="100%" filter="url(#kubeKorn)" />
      </svg>

      <div className="relative mx-auto max-w-[1140px] px-5 py-14 text-center sm:px-8 sm:py-16 lg:py-20">
        <p className="animate-rise text-[0.65rem] font-bold uppercase leading-relaxed tracking-[0.19em] text-secondary">
          {fachgebiete.join(" · ")}
        </p>

        <h1
          className="animate-rise mx-auto mt-8 max-w-[19ch] font-display text-[clamp(1.9rem,4.6vw,3.3rem)] font-normal leading-[1.16] tracking-tight text-primary sm:mt-10"
          style={{ animationDelay: "0.08s" }}
        >
          Tu deinem Körper etwas Gutes,{" "}
          <span className="italic text-secondary">
            damit deine Seele Lust hat, darin zu wohnen.
          </span>
        </h1>

        <div
          className="animate-rise mt-9 flex flex-wrap justify-center gap-3.5 sm:mt-11"
          style={{ animationDelay: "0.18s" }}
        >
          <Button asChild variant="pill" size="pill">
            <Link to="/termin">
              <CalendarDays className="size-4" aria-hidden="true" /> Termin buchen
            </Link>
          </Button>
          <Button asChild variant="pillOutline" size="pill">
            <Link to="/therapien">
              Therapien <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div
          className="animate-rise mx-auto mt-12 h-px w-full max-w-[340px] bg-primary/18 sm:mt-14"
          style={{ animationDelay: "0.26s" }}
          aria-hidden="true"
        />

        <p
          className="animate-rise mt-5 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-secondary/75"
          style={{ animationDelay: "0.3s" }}
        >
          Gersthofen · Termine nach Vereinbarung
        </p>
      </div>
    </section>
  );
}
