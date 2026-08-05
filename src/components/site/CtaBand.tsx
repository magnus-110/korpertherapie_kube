import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { praxis } from "@/lib/praxis";

export function CtaBand({ title, text }: { title: string; text?: string }) {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 shadow-[var(--shadow-soft-md)] sm:px-12">
          <div
            className="blob-shape absolute -bottom-32 -right-20 size-[320px] bg-sage opacity-20"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="max-w-[20ch] text-[clamp(1.6rem,3vw,2.3rem)] text-primary-foreground">
              {title}
            </h2>
            {text ? <p className="mt-4 max-w-[52ch] text-sage-tint">{text}</p> : null}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button asChild variant="pillLight" size="pill">
                <Link to="/termin">Termin buchen</Link>
              </Button>
              <Button asChild variant="pill" size="pill" className="bg-secondary">
                <a href={praxis.telefonHref}>Telefon {praxis.telefon}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
