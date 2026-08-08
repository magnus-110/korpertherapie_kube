import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurTeam } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/patienten")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  head: () => ({ meta: [{ title: "Patienten · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Patienten"
      beschreibung="Patientenakten mit Suche, Stammdaten, Behandlungsverlauf und Dokumentation."
      stufe="Stufe 3"
    />
  ),
});
