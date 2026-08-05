import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurTeam } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/kalender")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  head: () => ({ meta: [{ title: "Kalender · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Kalender"
      beschreibung="Wochen- und Tagesansicht für beide Behandler. Termine anlegen, verschieben, abhaken und Zeiten sperren."
      stufe="Stufe 2"
    />
  ),
});
