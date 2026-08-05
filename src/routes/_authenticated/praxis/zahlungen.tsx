import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/zahlungen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Zahlungen · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Zahlungen"
      beschreibung="Kontoauszug hochladen, Zahlungen automatisch zuordnen, Reste von Hand klären."
      stufe="Stufe 8"
    />
  ),
});
