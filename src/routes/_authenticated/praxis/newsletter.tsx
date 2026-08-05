import { createFileRoute } from "@tanstack/react-router";
import { Platzhalter } from "@/components/praxis/Platzhalter";
import { nurVerwaltung } from "@/lib/praxis-guard";

export const Route = createFileRoute("/_authenticated/praxis/newsletter")({
  beforeLoad: ({ context }) => nurVerwaltung(context.rolle),
  head: () => ({ meta: [{ title: "Newsletter · Praxis Kube" }] }),
  component: () => (
    <Platzhalter
      titel="Newsletter"
      beschreibung="Anmeldungen mit Bestätigung per Link, Versand nur bei gültiger Einwilligung."
      stufe="Stufe 10"
    />
  ),
});
