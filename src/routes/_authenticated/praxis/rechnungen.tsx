import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/rechnungen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Rechnungen · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Rechnungen"
      beschreibung="Rechnungen aus abgehakten Terminen erzeugen, ansehen und versenden."
      stufe="Stufe 6"
    />
  ),
});
