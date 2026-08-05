import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/mahnungen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Mahnungen · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Mahnungen"
      beschreibung="Überfällige Rechnungen, gestufte Erinnerungen ohne Mahngebühren."
      stufe="Stufe 9"
    />
  ),
});
