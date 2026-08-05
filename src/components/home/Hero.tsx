import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const fachgebiete = ["Osteopathie", "Psychotherapie", "Labordiagnostik", "Sportheilkunde"];

/** Geschwungene Linien am oberen Rand – Zeichenfläche 1200 × 140. */
const linienOben = [
  {
    d: "M-60 18.0 C55.5 24.6 154.5 32.1 270.0 35.0 C385.5 35.0 484.5 32.5 600.0 25.3 C715.5 25.3 814.5 15.7 930.0 6.9 C1045.5 6.9 1144.5 1.7 1260.0 1.7",
    o: 0.62,
  },
  {
    d: "M-60 41.0 C55.5 52.9 154.5 56.1 270.0 54.5 C385.5 54.5 484.5 48.5 600.0 40.1 C715.5 40.1 814.5 32.0 930.0 26.8 C1045.5 26.8 1144.5 26.1 1260.0 30.3",
    o: 0.53,
  },
  {
    d: "M-60 64.0 C55.5 77.2 154.5 76.3 270.0 71.5 C385.5 71.5 484.5 64.2 600.0 56.9 C715.5 56.9 814.5 51.9 930.0 50.7 C1045.5 50.7 1144.5 53.9 1260.0 60.3",
    o: 0.44,
  },
  {
    d: "M-60 87.0 C55.5 98.0 154.5 94.2 270.0 88.1 C385.5 88.1 484.5 81.6 600.0 76.9 C715.5 76.9 814.5 75.4 930.0 77.7 C1045.5 77.7 1144.5 82.9 1260.0 89.5",
    o: 0.35,
  },
  {
    d: "M-60 110.0 C55.5 116.6 154.5 111.6 270.0 106.1 C385.5 106.1 484.5 101.8 600.0 100.2 C715.5 100.2 814.5 101.7 930.0 105.9 C1045.5 105.9 1144.5 111.4 1260.0 116.4",
    o: 0.26,
  },
];

/** Geschwungene Linien am unteren Rand – Zeichenfläche 1200 × 100. */
const linienUnten = [
  {
    d: "M-60 8.0 C55.5 15.3 154.5 11.2 270.0 6.1 C385.5 6.1 484.5 1.6 600.0 -0.8 C715.5 -0.8 814.5 -0.4 930.0 2.7 C1045.5 2.7 1144.5 7.5 1260.0 12.4",
    o: 0.3,
  },
  {
    d: "M-60 31.0 C55.5 35.8 154.5 29.5 270.0 23.7 C385.5 23.7 484.5 20.3 600.0 20.3 C715.5 20.3 814.5 23.7 930.0 29.5 C1045.5 29.5 1144.5 35.8 1260.0 40.5",
    o: 0.39,
  },
  {
    d: "M-60 54.0 C55.5 53.2 154.5 46.1 270.0 41.5 C385.5 41.5 484.5 40.9 600.0 44.5 C715.5 44.5 814.5 51.2 930.0 58.8 C1045.5 58.8 1144.5 64.8 1260.0 67.4",
    o: 0.48,
  },
  {
    d: "M-60 77.0 C55.5 68.7 154.5 62.9 270.0 61.5 C385.5 61.5 484.5 65.2 600.0 72.6 C715.5 72.6 814.5 81.5 930.0 88.9 C1045.5 88.9 1144.5 92.5 1260.0 91.1",
    o: 0.57,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10">
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

      <svg
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
        className="animate-sway pointer-events-none absolute inset-x-0 top-0 h-[100px] w-[112%] sm:h-[130px] lg:h-[150px]"
        aria-hidden="true"
      >
        <g fill="none" className="stroke-sage" strokeWidth="1">
          {linienOben.map((l) => (
            <path key={l.d} d={l.d} opacity={l.o} />
          ))}
        </g>
      </svg>

      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="animate-sway-slow pointer-events-none absolute inset-x-0 bottom-0 h-[80px] w-[112%] sm:h-[100px] lg:h-[115px]"
        aria-hidden="true"
      >
        <g fill="none" className="stroke-sage" strokeWidth="1">
          {linienUnten.map((l) => (
            <path key={l.d} d={l.d} opacity={l.o} />
          ))}
        </g>
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
