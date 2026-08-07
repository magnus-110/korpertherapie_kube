import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { startseite, type Rolle } from "@/lib/rollen";


export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Anmelden · Praxis Kube" },
      { name: "description", content: "Interner Bereich der Praxis Kube." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate({ from: "/auth" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /** Nach dem Login je nach Rolle in den passenden Bereich. */
  async function weiter(userId: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .limit(1);
    const rolle: Rolle = data?.[0]?.role ?? "patient";
    navigate({ to: startseite[rolle], replace: true });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        void weiter(data.user.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error || !data.user) {
      toast.error("Anmeldung fehlgeschlagen", {
        description: "E-Mail oder Passwort ist nicht korrekt. Bitte versuchen Sie es erneut.",
      });
      return;
    }

    await weiter(data.user.id);
  }


  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-md pt-12 sm:pt-20">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border-2 border-secondary font-display text-base font-semibold text-secondary">
              KK
            </span>
            <span className="text-[0.78rem] font-bold uppercase leading-tight tracking-[0.1em] text-primary">
              Körpertherapie
              <br />& Psychotherapie Kube
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft-md)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
              <Lock className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-primary">Anmelden</h1>
              <p className="text-sm text-muted-foreground">
                Für Patient:innen und das Praxisteam.
              </p>

            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@praxis-kube.de"
                className="bg-creme"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-creme"
              />
            </div>

            <Button type="submit" variant="pill" size="pill" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Anmelden …
                </>
              ) : (
                "Anmelden"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-primary">
              Zurück zur Startseite
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Noch kein Konto? Es entsteht automatisch bei deiner ersten Terminbuchung.
        </p>

      </div>
    </div>
  );
}
