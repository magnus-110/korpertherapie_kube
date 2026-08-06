import { redirect } from "@tanstack/react-router";
import { startseite, type Rolle } from "@/lib/rollen";

/** Schützt Seiten, die ausschließlich der Verwaltung offenstehen. */
export function nurVerwaltung(rolle: Rolle) {
  if (rolle !== "verwaltung") {
    throw redirect({ to: startseite[rolle] });
  }
}

/** Schützt Seiten, die dem Praxisteam offenstehen. */
export function nurTeam(rolle: Rolle) {
  if (rolle !== "verwaltung" && rolle !== "behandler") {
    throw redirect({ to: "/praxis" });
  }
}
