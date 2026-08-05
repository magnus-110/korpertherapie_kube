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
    <section id="kalender" className="scroll-mt-24 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="max-w-[60ch]">
          <p className="eyebrow mb-4">Termin</p>
          <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.6rem)]">
            Wann passt es dir am besten?
          </h2>
          <p className="mt-5 text-lg">
            Such dir direkt hier einen Wunschtag aus. Wir prüfen die Verfügbarkeit und melden uns
            persönlich bei dir zurück.
          </p>
        </div>

        <ol className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-base font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              <span className="pt-1.5 font-semibold text-primary">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl bg-card p-4 shadow-[var(--shadow-soft-md)] sm:mt-12 sm:p-8 lg:p-10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={de}
            weekStartsOn={1}
            showOutsideDays={false}
            disabled={{ before: new Date() }}
            className="pointer-events-auto w-full bg-transparent p-0 [--cell-size:3rem]"
            classNames={{
              root: "w-full",
              months: "relative flex w-full flex-col",
              month: "flex w-full flex-col gap-5",
              month_caption:
                "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
              caption_label: "select-none font-display text-xl font-semibold text-primary sm:text-2xl",
              weekdays: "flex w-full gap-1.5",
              weekday:
                "flex-1 select-none text-center text-[0.7rem] font-bold uppercase tracking-[0.12em] text-secondary sm:text-xs",
              week: "mt-1.5 flex w-full gap-1.5",
              day: "group/day relative aspect-auto h-14 flex-1 p-0 text-center sm:h-[4.5rem] lg:h-24",
              day_button:
                "aspect-auto size-full rounded-2xl text-base font-normal sm:text-lg lg:text-xl",
              today: "rounded-2xl bg-accent text-accent-foreground",
            }}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-sage-tint p-6 text-sage-foreground sm:p-7">
          {date ? (
            <p className="text-lg">
              Dein Wunschtag: <strong>{format(date, "EEEE, d. MMMM yyyy", { locale: de })}</strong>
            </p>
          ) : (
            <p className="text-lg">
              Wähle einen Tag – die freien Uhrzeiten besprechen wir persönlich mit dir.
            </p>
          )}
          <Button variant="pill" size="pill" disabled={!date} onClick={weiter}>
            Weiter zur Anfrage <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <p className="text-[0.98rem]">Lieber direkt sprechen? Wir rufen auch gern zurück.</p>
          <Button asChild variant="pillOutline" size="pill">
            <a href={praxis.telefonHref}>
              <Phone className="size-4" aria-hidden="true" /> {praxis.telefon}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
