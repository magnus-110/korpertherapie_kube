import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Abmelden } from "@/components/praxis/Abmelden";

const bereiche = [
  { to: "/praxis/uebersicht", label: "Übersicht" },
  { to: "/praxis/kalender", label: "Kalender" },
  { to: "/praxis/patienten", label: "Patienten" },
  { to: "/praxis/rechnungen", label: "Rechnungen" },
  { to: "/praxis/zahlungen", label: "Zahlungen" },
  { to: "/praxis/mahnungen", label: "Mahnungen" },
  { to: "/praxis/anfragen", label: "Anfragen" },
  { to: "/praxis/newsletter", label: "Newsletter" },
] as const;

export function VerwaltungLayout({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-primary py-6 lg:flex">
        <Link to="/" className="mb-8 px-5">
          <span className="font-display text-lg text-primary-foreground">KK Praxis</span>
          <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.12em] text-sage">
            Verwaltung
          </span>
        </Link>

        <nav className="flex-1" aria-label="Verwaltungsbereiche">
          {bereiche.map((b) => (
            <Link
              key={b.to}
              to={b.to}
              className="block border-l-[3px] border-transparent px-5 py-2.5 text-sm text-sage transition-colors hover:text-creme data-[status=active]:border-sage data-[status=active]:bg-white/10 data-[status=active]:text-creme"
            >
              {b.label}
            </Link>
          ))}
          <Link
            to="/praxis/einstellungen"
            className="mt-3 block border-l-[3px] border-transparent px-5 py-2.5 text-sm text-sage transition-colors hover:text-creme data-[status=active]:border-sage data-[status=active]:bg-white/10 data-[status=active]:text-creme"
          >
            Einstellungen
          </Link>
        </nav>

        <div className="border-t border-white/15 px-5 pt-4">
          <p className="mb-2 truncate text-xs text-sage">{name}</p>
          <Abmelden />
        </div>
      </aside>

      {/* Auf schmalen Bildschirmen wandert die Navigation nach oben */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 bg-primary px-5 py-3 lg:hidden">
          <span className="font-display text-base text-primary-foreground">KK Praxis</span>
          <Abmelden kompakt />
        </header>
        <nav
          className="flex gap-1 overflow-x-auto bg-primary/95 px-3 pb-3 lg:hidden"
          aria-label="Verwaltungsbereiche"
        >
          {[...bereiche, { to: "/praxis/einstellungen", label: "Einstellungen" } as const].map(
            (b) => (
              <Link
                key={b.to}
                to={b.to}
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs text-sage transition-colors data-[status=active]:bg-white/15 data-[status=active]:text-creme"
              >
                {b.label}
              </Link>
            ),
          )}
        </nav>

        <main className="mx-auto w-full max-w-[1140px] flex-1 px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
