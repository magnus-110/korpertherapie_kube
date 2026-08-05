import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type ZoneId = "psychotherapie" | "osteopathie" | "labor" | "sportheilkunde";

type Zone = {
  id: ZoneId;
  kicker: string;
  title: string;
  text: string;
  /** Position des Punktes in Prozent der Grafik */
  x: number;
  y: number;
  /** Mittelpunkt und Radius des Leuchtens in SVG-Koordinaten */
  gx: number;
  gy: number;
  gr: number;
};

/** Konturen der Figur (SVG-Koordinaten, Zeichenfläche 400 × 580). */
const TORSO =
  "M150 134 C150 124 160 117 174 115 L226 115 C240 117 250 124 250 134 C248 172 240 214 237 252 C236 282 242 306 245 328 C230 339 170 339 155 328 C158 306 164 282 163 252 C160 214 152 172 150 134 Z";
const ARM_LINKS = "M154 136 C134 156 126 202 124 252 C123 280 128 302 133 320";
const ARM_RECHTS = "M246 136 C266 156 274 202 276 252 C277 280 272 302 267 320";
const BEIN_LINKS = "M185 330 C181 380 179 442 181 500 C182 515 182 522 182 528";
const BEIN_RECHTS = "M215 330 C219 380 221 442 219 500 C218 515 218 522 218 528";

const zones: Zone[] = [
  {
    id: "psychotherapie",
    kicker: "Kopf & Psyche",
    title: "Psychotherapie",
    text: "Bei Grübeln, Schlafproblemen, Erschöpfung oder Krisen – Raum, um zu sortieren.",
    x: 50,
    y: 12.8,
    gx: 200,
    gy: 74,
    gr: 74,
  },
  {
    id: "osteopathie",
    kicker: "Rücken & Wirbelsäule",
    title: "Osteopathie",
    text: "Blockaden sanft lösen, Beweglichkeit zurückgewinnen – mit den Händen, ohne Eile.",
    x: 50,
    y: 33.1,
    gx: 200,
    gy: 192,
    gr: 92,
  },
  {
    id: "labor",
    kicker: "Stoffwechsel & Mitte",
    title: "Labor & Nährstoffe",
    text: "Fundierte Diagnostik statt Raten: Wir schauen nach, was deinem Körper wirklich fehlt.",
    x: 50,
    y: 51.4,
    gx: 200,
    gy: 298,
    gr: 82,
  },
  {
    id: "sportheilkunde",
    kicker: "Beine & Bewegung",
    title: "Sportheilkunde",
    text: "Bewegung gezielt als Therapie – zurück zu Kraft, Ausdauer und Belastbarkeit.",
    x: 45,
    y: 76.2,
    gx: 180,
    gy: 442,
    gr: 78,
  },
];

/** Schwebende Punkte, die langsam nach oben ziehen. */
const particles = [
  { cx: 108, cy: 470, r: 3.4, delay: "0s", dur: "13s" },
  { cx: 300, cy: 500, r: 2.6, delay: "-4s", dur: "16s" },
  { cx: 84, cy: 300, r: 2.2, delay: "-8s", dur: "15s" },
  { cx: 322, cy: 330, r: 3.8, delay: "-2s", dur: "18s" },
  { cx: 132, cy: 150, r: 2.4, delay: "-11s", dur: "14s" },
  { cx: 286, cy: 130, r: 3, delay: "-6s", dur: "17s" },
];

export function BodyMap() {
  const [active, setActive] = useState<ZoneId | null>(null);
  const current = zones.find((z) => z.id === active) ?? null;

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-[420px]" onMouseLeave={() => setActive(null)}>
        {/* Weiche Hintergrundformen – greifen die Bildsprache der Praxis auf */}
        <div
          className="blob-shape animate-float absolute inset-0 m-auto aspect-square w-[70%] bg-sage opacity-25"
          aria-hidden="true"
        />
        <div
          className="blob-shape animate-float absolute inset-0 m-auto aspect-square w-[54%] bg-secondary opacity-10 [animation-delay:-3s] [animation-duration:11s]"
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 400 580"
          className="relative w-full"
          role="img"
          aria-label="Schematische Körperdarstellung mit vier Therapiebereichen"
        >
          <defs>
            <linearGradient id="kubeBodyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--color-secondary)" }} />
              <stop offset="55%" style={{ stopColor: "var(--color-sage)" }} />
              <stop offset="100%" style={{ stopColor: "var(--color-sage)", stopOpacity: 0.72 }} />
            </linearGradient>
            <radialGradient id="kubeZoneGlow">
              <stop offset="0%" style={{ stopColor: "var(--color-creme)", stopOpacity: 0.95 }} />
              <stop offset="40%" style={{ stopColor: "var(--color-sage)", stopOpacity: 0.55 }} />
              <stop offset="100%" style={{ stopColor: "var(--color-sage)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {/* Ruhig pulsierende Ringe – der Atemrhythmus der Seite */}
          <g aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx="200"
                cy="300"
                r={118 + i * 34}
                fill="none"
                className="animate-aura stroke-sage"
                strokeWidth="1.5"
                style={{ animationDelay: `${i * -2.6}s` }}
              />
            ))}
          </g>

          {/* Schwebende Partikel */}
          <g aria-hidden="true">
            {particles.map((p, i) => (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                className="animate-drift fill-secondary"
                style={{ animationDelay: p.delay, animationDuration: p.dur }}
              />
            ))}
          </g>

          {/* Leuchten des aktiven Bereichs */}
          <circle
            cx={current?.gx ?? 200}
            cy={current?.gy ?? 300}
            r={current?.gr ?? 80}
            fill="url(#kubeZoneGlow)"
            className="transition-opacity duration-500 ease-out"
            style={{ opacity: current ? 1 : 0 }}
            aria-hidden="true"
          />

          {/* Die Figur selbst – atmet langsam */}
          <g
            className="animate-breathe"
            style={{ transformOrigin: "200px 330px", transformBox: "view-box" }}
            aria-hidden="true"
          >
            {/* Deckkraft liegt auf der Gruppe, damit Überlappungen nicht nachdunkeln */}
            <g opacity="0.4">
              <g fill="url(#kubeBodyFill)">
                <circle cx="200" cy="74" r="32" />
                <path d={TORSO} />
              </g>
              <g fill="none" stroke="url(#kubeBodyFill)" strokeLinecap="round">
                <path d="M200 100 L200 120" strokeWidth="24" />
                <path d={ARM_LINKS} strokeWidth="22" />
                <path d={ARM_RECHTS} strokeWidth="22" />
                <path d={BEIN_LINKS} strokeWidth="30" />
                <path d={BEIN_RECHTS} strokeWidth="30" />
              </g>
            </g>

            {/* Konturlinie, die sich beim Laden aufbaut */}
            <g
              fill="none"
              className="animate-draw stroke-primary"
              strokeLinecap="round"
              strokeWidth="2"
              strokeOpacity="0.3"
              pathLength={1}
            >
              <circle cx="200" cy="74" r="32" pathLength={1} />
              <path d={TORSO} pathLength={1} style={{ animationDelay: "0.15s" }} />
            </g>

            {/* Die Achse – verbindet die vier Bereiche */}
            <path
              d="M200 120 L200 328"
              fill="none"
              className="stroke-primary"
              strokeOpacity="0.26"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />
          </g>
        </svg>

        {/* Anklickbare Bereiche */}
        {zones.map((z) => {
          const isActive = active === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onMouseEnter={() => setActive(z.id)}
              onFocus={() => setActive(z.id)}
              onClick={() => setActive(isActive ? null : z.id)}
              aria-pressed={isActive}
              className="absolute grid min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            >
              <span className="sr-only">
                {z.kicker} – {z.title}
              </span>
              <span
                className={`absolute size-11 rounded-full bg-sage transition-all duration-500 ${
                  isActive ? "scale-100 opacity-40" : "animate-halo scale-75 opacity-0"
                }`}
                aria-hidden="true"
              />
              <span
                className={`relative block rounded-full border-2 border-creme transition-all duration-300 ${
                  isActive
                    ? "size-5 bg-primary shadow-[var(--shadow-soft-md)]"
                    : "size-3.5 bg-primary/85"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      {/* Infofeld – feste Höhe, damit beim Wechsel nichts springt */}
      <div className="mx-auto mt-6 min-h-[132px] w-full max-w-[420px] rounded-3xl bg-card/80 p-6 shadow-[var(--shadow-soft-sm)] backdrop-blur-sm">
        {current ? (
          <div key={current.id} className="animate-fade-up">
            <p className="eyebrow mb-2">{current.kicker}</p>
            <h3 className="text-xl">{current.title}</h3>
            <p className="mt-1.5 text-[0.95rem]">{current.text}</p>
            <Link
              to="/therapien"
              hash={current.id}
              className="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] font-bold text-secondary underline-offset-4 hover:underline"
            >
              Mehr dazu <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="flex h-full min-h-[84px] flex-col justify-center">
            <p className="eyebrow mb-2">Wo drückt es?</p>
            <p className="text-[0.98rem]">
              Wähle einen der vier Punkte – wir zeigen dir, womit wir dort helfen können.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
