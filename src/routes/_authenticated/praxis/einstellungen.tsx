import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/einstellungen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Einstellungen · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Einstellungen"
      beschreibung="Behandler, Behandlungsarten, Gebührenziffern, Öffnungszeiten, Bankverbindung, Mahnstufen und Fragebogen."
      stufe="Stufe 1"
    />
  ),
});
