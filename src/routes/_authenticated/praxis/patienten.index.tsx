import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { nurTeam } from "@/lib/praxis-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Patient = {
  id: string;
  name: string;
  email: string | null;
  telefon: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/praxis/patienten/")({
  beforeLoad: ({ context }) => nurTeam(context.rolle),
  loader: async () => {
    const { data } = await supabase
      .from("patients")
      .select("id, name, email, telefon, created_at")
      .order("name");
    return { patienten: (data ?? []) as Patient[] };
  },
  head: () => ({ meta: [{ title: "Patienten · Praxis Kube" }] }),
  component: PatientenSeite,
});

function PatientenSeite() {
  const { patienten } = Route.useLoaderData() as { patienten: Patient[] };
  const router = useRouter();
  const [suche, setSuche] = useState("");
  const [neu, setNeu] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");

  const gefiltert = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (!q) return patienten;
    return patienten.filter((p) =>
      [p.name, p.email ?? "", p.telefon ?? ""].some((f) => f.toLowerCase().includes(q)),
    );
  }, [patienten, suche]);

  async function anlegen() {
    if (name.trim().length < 2) {
      toast.error("Bitte einen Namen eingeben");
      return;
    }
    const { error } = await supabase.from("patients").insert({
      name: name.trim(),
      email: email.trim() || null,
      kontakt: email.trim() || telefon.trim() || null,
      telefon: telefon.trim() || null,
    });
    if (error) {
      toast.error("Konnte nicht angelegt werden");
      return;
    }
    setName("");
    setEmail("");
    setTelefon("");
    setNeu(false);
    toast.success("Patientin oder Patient angelegt");
    await router.invalidate();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-primary">Patienten</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Akten, Behandlungsepisoden und Dokumentation.
          </p>
        </div>
        <Button variant="pill" size="pillSm" onClick={() => setNeu((v) => !v)}>
          <Plus className="size-4" aria-hidden="true" /> Neu anlegen
        </Button>
      </div>

      {neu ? (
        <section className="grid gap-3 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft-sm)] sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
          <div>
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="p-mail">E-Mail</Label>
            <Input id="p-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="p-tel">Telefon</Label>
            <Input id="p-tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="mt-1.5" />
          </div>
          <Button variant="pill" size="pillSm" onClick={() => void anlegen()}>
            Speichern
          </Button>
        </section>
      ) : null}

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Name, E-Mail oder Telefon suchen"
          className="pl-9"
          aria-label="Patienten suchen"
        />
      </div>

      {gefiltert.length === 0 ? (
        <p className="rounded-2xl bg-card px-5 py-4 text-sm text-muted-foreground">
          Keine Einträge gefunden.
        </p>
      ) : (
        <ul className="grid gap-2">
          {gefiltert.map((p) => (
            <li key={p.id}>
              <Link
                to="/praxis/patienten/$patientId"
                params={{ patientId: p.id }}
                className="flex flex-wrap items-center gap-3 rounded-xl bg-card px-4 py-3 transition-colors hover:bg-accent"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">
                  {p.name}
                </span>
                <span className="text-xs text-muted-foreground">{p.email ?? "—"}</span>
                <span className="text-xs text-muted-foreground">{p.telefon ?? ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
