export function QuoteBand() {
  return (
    <section className="relative overflow-hidden bg-secondary py-14 sm:py-20 lg:py-24">
      <div
        className="blob-shape absolute -bottom-40 -right-16 size-[420px] bg-sage opacity-20"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-8">
        <p className="max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,2.7rem)] font-medium leading-snug text-secondary-foreground">
          „Heilung braucht Zeit, Zuwendung und Vertrauen."
        </p>
        <p className="mt-5 max-w-[50ch] text-lg text-sage-tint">
          Deshalb nehmen wir uns für jede Behandlung so viel Raum, wie sie braucht – ohne
          Wartezimmer-Hektik und ohne Standardprogramm.
        </p>
      </div>
    </section>
  );
}
