import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/praxis/")({
  beforeLoad: ({ context }) => {
    if (context.rolle === "verwaltung") throw redirect({ to: "/praxis/uebersicht" });
    if (context.rolle === "behandler") throw redirect({ to: "/praxis/heute" });
    throw redirect({ to: "/mein-bereich" });
  },

  component: () => null,
});
