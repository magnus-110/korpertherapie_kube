import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-card py-14 sm:py-20">
      <div
        className="blob-shape absolute -right-24 -top-28 size-[380px] bg-sage opacity-25"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1140px] px-5 sm:px-8">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.2rem)] font-semibold tracking-tight">
          {title}
        </h1>
        {children ? <div className="mt-5 max-w-[58ch] text-lg">{children}</div> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3.5">{actions}</div> : null}
      </div>
    </section>
  );
}
