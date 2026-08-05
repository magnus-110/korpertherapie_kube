import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/anfragen")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Anfragen · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Anfragen"
      beschreibung="Nachrichten aus dem Kontaktformular der Website."
      stufe="Stufe 2"
    />
  ),
});
