import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { praxis } from "@/lib/praxis";

const steps = [
  "Wunschtag im Kalender wählen",
  "Anliegen kurz beschreiben",
  "Bestätigung per E-Mail erhalten",
];

export function BookingTeaser() {
  const [date, setDate] = useState<Date | undefined>();
  const navigate = useNavigate();

  function weiter() {
    if (!date) return;
    void navigate({ to: "/termin", search: { tag: format(date, "yyyy-MM-dd") } });
  }

  return (
    <section id="kalender" className="scroll-mt-24 bg-card py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <p className="eyebrow mb-4">Termin</p>
          <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Wann passt es dir am besten?
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg">
            Such dir direkt hier einen Wunschtag aus. Wir prüfen die Verfügbarkeit und melden uns
            persönlich bei dir zurück.
          </p>

          <ol className="mt-8 grid gap-4">
            {steps.map((s, i) => (
              <li key={s} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-base font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="pt-1.5 font-semibold text-primary">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mt-9">
            <p className="text-[0.98rem]">Lieber direkt sprechen? Wir rufen auch gern zurück.</p>
            <Button asChild variant="pillOutline" size="pill" className="mt-3.5">
              <a href={praxis.telefonHref}>
                <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl bg-background p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={de}
              weekStartsOn={1}
              disabled={{ before: new Date() }}
              className="pointer-events-auto rounded-2xl p-0"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-sage-tint p-5 text-sage-foreground">
            {date ? (
              <p>
                Dein Wunschtag:{" "}
                <strong>{format(date, "EEEE, d. MMMM yyyy", { locale: de })}</strong>
              </p>
            ) : (
              <p>Wähle einen Tag – die freien Uhrzeiten besprechen wir persönlich mit dir.</p>
            )}
          </div>

          <Button
            variant="pill"
            size="pill"
            className="mt-5 w-full"
            disabled={!date}
            onClick={weiter}
          >
            Weiter zur Anfrage <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
