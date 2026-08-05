import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/praxis")({
  head: () => ({
    meta: [
      { title: "Praxis-Übersicht · Kube" },
      { name: "description", content: "Interner Bereich der Praxis Kube." },
    ],
  }),
  component: PraxisDashboard,
});

function PraxisDashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      setRole(data?.role ?? null);
      setLoading(false);
    }

    loadRole();
  }, [user.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    navigate({ to: "/auth", replace: true });
  }

  const isVoll = role === "voll";

  const tiles = [
    {
      title: "Kalender",
      description: "Terminplanung und Behandlungen",
      icon: Calendar,
      visible: true,
    },
    {
      title: "Patient:innen",
      description: "Stammdaten und Notizen",
      icon: Users,
      visible: true,
    },
    {
      title: "Dokumentation",
      description: "Behandlungsverläufe",
      icon: FileText,
      visible: true,
    },
    {
      title: "Abrechnung",
      description: "Rechnungen, Zahlungen, Kontoauszüge",
      icon: CreditCard,
      visible: isVoll,
    },
    {
      title: "Einstellungen",
      description: "Praxis- und Benutzereinstellungen",
      icon: Settings,
      visible: isVoll,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border-2 border-secondary font-display text-sm font-semibold text-secondary">
              KK
            </span>
            <span className="text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em] text-primary">
              Körpertherapie
              <br />& Psychotherapie Kube
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" /> Rolle wird geladen …
                  </span>
                ) : (
                  <>Rolle: {isVoll ? "Vollzugriff" : "Eingeschränkt"}</>
                )}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="pillOutline" size="pillSm">
              <LogOut className="mr-2 size-4" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-5 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-primary">
            Angemeldet als {user.email}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {loading
              ? "Rolle wird geladen …"
              : isVoll
                ? "Sie haben Vollzugriff auf Behandlung, Termine und Abrechnung."
                : "Sie haben Zugriff auf Behandlung und Termine. Abrechnung ist nicht freigeschaltet."}
          </p>
        </div>

        {!loading && !isVoll && (
          <div className="mb-6 rounded-xl border border-border bg-creme p-4 text-sm text-primary">
            Abrechnung und Einstellungen sind nur für Mitarbeiter:innen mit der Rolle „Vollzugriff“ sichtbar.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles
            .filter((t) => t.visible)
            .map((tile) => (
              <Card
                key={tile.title}
                className="group cursor-pointer border-border bg-card shadow-[var(--shadow-soft-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-md)]"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                      <tile.icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Demnächst
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-lg text-primary">{tile.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tile.description}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
