import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BehandlerLayout } from "@/components/praxis/BehandlerLayout";
import { VerwaltungLayout } from "@/components/praxis/VerwaltungLayout";
import { Abmelden } from "@/components/praxis/Abmelden";

export const Route = createFileRoute("/_authenticated/praxis")({
  component: PraxisShell,
});

function PraxisShell() {
  const { rolle, behandler, user } = Route.useRouteContext();
  const name = behandler?.name ?? user.email ?? "Angemeldet";

  if (rolle === "verwaltung") {
    return (
      <VerwaltungLayout name={name}>
        <Outlet />
      </VerwaltungLayout>
    );
  }

  if (rolle === "behandler") {
    return (
      <BehandlerLayout name={name}>
        <Outlet />
      </BehandlerLayout>
    );
  }

  // Patientinnen und Patienten: eigener Bereich kommt später
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="max-w-md rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-soft-md)]">
        <h1 className="font-display text-2xl text-primary">Dein Bereich entsteht gerade</h1>
        <p className="mt-3 text-muted-foreground">
          Hier kannst du bald deine Termine und Rechnungen einsehen. Melde dich bei Fragen einfach
          in der Praxis.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="text-sm font-semibold text-secondary underline-offset-4 hover:underline"
          >
            Zur Website
          </Link>
          <Abmelden />
        </div>
      </div>
    </div>
  );
}
