import type { ReactNode } from "react";

/** Fertig gestaltete Seite ohne Inhalt – zeigt, was hier später steht. */
export function Platzhalter({
  titel,
  beschreibung,
  stufe,
  children,
}: {
  titel: string;
  beschreibung: string;
  stufe?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-primary sm:text-3xl">{titel}</h1>
      <p className="mt-2 max-w-[62ch] text-muted-foreground">{beschreibung}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Dieser Bereich wird gerade gebaut.
          {stufe ? <> Geplant für {stufe}.</> : null}
        </p>
      </div>

      {children}
    </div>
  );
}
