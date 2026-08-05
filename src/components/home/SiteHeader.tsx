import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const links = [
  { href: "#ansatz", label: "Ansatz" },
  { href: "#therapien", label: "Therapien" },
  { href: "#team", label: "Über uns" },
  { href: "#kontakt", label: "Kontakt" },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span
        className={`grid size-11 place-items-center rounded-full border-2 font-display text-base font-semibold ${
          light ? "border-sage text-sage" : "border-secondary text-secondary"
        }`}
        aria-hidden="true"
      >
        KK
      </span>
      <span
        className={`text-[0.78rem] font-bold uppercase leading-tight tracking-[0.1em] ${
          light ? "text-creme" : "text-primary"
        }`}
      >
        Körpertherapie
        <br />& Psychotherapie Kube
      </span>
    </Link>
  );
}

export { Brand };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 sm:px-8">
        <Brand />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hauptnavigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.95rem] font-semibold text-primary transition-colors hover:text-secondary"
            >
              {l.label}
            </a>
          ))}
          <Button asChild variant="pill" size="pillSm">
            <a href="#kontakt">Termin buchen</a>
          </Button>
          <Button asChild variant="pillOutline" size="pillSm">
            <Link to="/auth">Intern</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="pillOutline" size="pillSm">
            <Link to="/auth">Intern</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menü öffnen"
                className="min-h-11 min-w-11 text-primary"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-creme">
              <SheetTitle className="font-display text-xl text-primary">Menü</SheetTitle>
              <nav className="mt-8 flex flex-col gap-5" aria-label="Mobile Navigation">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-lg font-semibold text-primary transition-colors hover:text-secondary"
                  >
                    {l.label}
                  </a>
                ))}
                <Button asChild variant="pill" size="pill" className="mt-2 w-full">
                  <a href="#kontakt">Termin buchen</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
