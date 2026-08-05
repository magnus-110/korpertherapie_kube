import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Search, Users } from "lucide-react";
import { Abmelden } from "@/components/praxis/Abmelden";

const punkte = [
  { to: "/praxis/heute", label: "Heute", icon: Home },
  { to: "/praxis/kalender", label: "Kalender", icon: CalendarDays },
  { to: "/praxis/patienten", label: "Patienten", icon: Users },
  { to: "/praxis/suche", label: "Suche", icon: Search },
] as const;

/** Reduzierte Ansicht für das Behandlungstablet: vier Punkte, große Flächen. */
export function BehandlerLayout({ name, children }: { name: string; children: ReactNode }) {
  const heute = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-4 sm:px-8">
        <span className="font-display text-lg text-primary">{heute}</span>
        <span className="truncate text-sm text-muted-foreground">{name}</span>
      </header>

      <main className="mx-auto w-full max-w-[820px] flex-1 px-5 py-6 pb-28 sm:px-8">
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card"
        aria-label="Hauptbereiche"
      >
        {punkte.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-[0.7rem] text-secondary transition-colors data-[status=active]:bg-accent data-[status=active]:font-semibold data-[status=active]:text-primary"
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center px-4">
          <Abmelden kompakt />
        </div>
      </nav>
    </div>
  );
}
