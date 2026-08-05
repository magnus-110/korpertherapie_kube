import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurTeam } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/suche")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  head: () => ({ meta: [{ title: "Suche · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Suche"
      beschreibung="Schnell eine Patientin, einen Termin oder eine Notiz finden."
      stufe="Stufe 3"
    />
  ),
});
