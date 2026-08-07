import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Menu, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Merkt sich, ob gerade jemand angemeldet ist – für die Beschriftung oben rechts. */
function useAngemeldet() {
  const [angemeldet, setAngemeldet] = useState(false);
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setAngemeldet(Boolean(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setAngemeldet(Boolean(session?.user)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);
  return angemeldet;
}


const links = [
  { to: "/", label: "Startseite" },
  { to: "/therapien", label: "Therapien" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] font-display text-[1.05rem] font-semibold ${
          light ? "border-sage text-sage" : "border-secondary text-secondary"
        }`}
        aria-hidden="true"
      >
        KK
      </span>
      <span className="flex flex-col">
        <span
          className={`font-display text-[1.4rem] font-semibold leading-none ${
            light ? "text-creme" : "text-primary"
          }`}
        >
          Kube
        </span>
        <span
          className={`mt-1.5 text-[0.58rem] font-bold uppercase leading-tight tracking-[0.15em] ${
            light ? "text-sage" : "text-secondary"
          }`}
        >
          Körpertherapie &amp; Psychotherapie
        </span>
      </span>
    </Link>
  );
}

export { Brand };

export function SiteHeader() {
  const angemeldet = useAngemeldet();
  return (

    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 sm:px-8">
        <Brand />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hauptnavigation">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-[0.95rem] font-semibold text-primary transition-colors hover:text-secondary data-[status=active]:text-secondary"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="pill" size="pillSm">
            <Link to="/termin">Termin buchen</Link>
          </Button>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/auth"
                  aria-label={angemeldet ? "Mein Bereich" : "Anmeldung"}
                  className="grid min-h-11 min-w-11 place-items-center rounded-full text-primary/70 transition-colors hover:bg-accent hover:text-secondary"
                >
                  {angemeldet ? (
                    <UserRound className="size-5" aria-hidden="true" />
                  ) : (
                    <Lock className="size-5" aria-hidden="true" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{angemeldet ? "Mein Bereich" : "Anmelden"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>


        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild variant="pill" size="pillSm">
            <Link to="/termin">Termin</Link>
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
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      activeOptions={{ exact: l.to === "/" }}
                      className="text-lg font-semibold text-primary transition-colors hover:text-secondary"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    to="/auth"
                    className="text-lg font-semibold text-primary transition-colors hover:text-secondary"
                  >
                    {angemeldet ? "Mein Bereich" : "Anmelden"}
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Button asChild variant="pill" size="pill" className="mt-2 w-full">
                    <Link to="/termin">Termin buchen</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
