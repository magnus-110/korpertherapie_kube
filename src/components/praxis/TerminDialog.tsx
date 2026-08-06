import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Behandler = { id: string; name: string; kuerzel: string | null; farbe: string };
type Art = {
  id: string;
  name: string;
  practitioner_id: string | null;
  dauer_minuten: number | null;
};
type Patient = { id: string; name: string };
type Termin = {
  id: string;
  start: string;
  ende: string;
  status: string;
  quelle: string;
  anliegen: string | null;
  patient_id: string;
  type_id: string | null;
  practitioner_id: string | null;
  patients: { name: string } | null;
  appointment_types: { name: string } | null;
};

export function TerminDialog({
  zeitpunkt,
  termin,
  behandler,
  arten,
  patienten,
  onClose,
  onGespeichert,
}: {
  zeitpunkt?: Date | undefined;
  termin: Termin | null;
  behandler: Behandler[];
  arten: Art[];
  patienten: Patient[];
  onClose: () => void;
  onGespeichert: () => void;
}) {
  const [artId, setArtId] = useState<string>(arten[0]?.id ?? "");
  const [patientId, setPatientId] = useState<string>("");
  const [neuerName, setNeuerName] = useState("");
  const [neueEmail, setNeueEmail] = useState("");
  const [datum, setDatum] = useState(format(zeitpunkt ?? new Date(), "yyyy-MM-dd"));
  const [zeit, setZeit] = useState(format(zeitpunkt ?? new Date(), "HH:mm"));
  const [laeuft, setLaeuft] = useState(false);

  const art = arten.find((a) => a.id === artId);

  async function speichern() {
    if (!art) {
      toast.error("Bitte eine Behandlungsart wählen");
      return;
    }
    setLaeuft(true);

    let pid = patientId;
    if (!pid) {
      if (neuerName.trim().length < 2) {
        setLaeuft(false);
        toast.error("Bitte einen Namen eingeben oder eine Person auswählen");
        return;
      }
      const { data, error } = await supabase
        .from("patients")
        .insert({
          name: neuerName.trim(),
          email: neueEmail.trim() || null,
          kontakt: neueEmail.trim() || null,
        })
        .select("id")
        .single();
      if (error || !data) {
        setLaeuft(false);
        toast.error("Patientenakte konnte nicht angelegt werden");
        return;
      }
      pid = data.id;
    }

    const start = new Date(`${datum}T${zeit}:00`);
    const dauer = art.dauer_minuten ?? 60;
    const { error } = await supabase.from("appointments").insert({
      patient_id: pid,
      type_id: art.id,
      practitioner_id: art.practitioner_id,
      start: start.toISOString(),
      ende: new Date(start.getTime() + dauer * 60000).toISOString(),
      status: "geplant",
      quelle: "manuell",
    });

    setLaeuft(false);
    if (error) {
      toast.error("Termin konnte nicht gespeichert werden");
      return;
    }
    toast.success("Termin eingetragen");
    onGespeichert();
  }

  async function absagen() {
    if (!termin) return;
    const { error } = await supabase.from("appointments").delete().eq("id", termin.id);
    if (error) {
      toast.error("Konnte nicht abgesagt werden");
      return;
    }
    toast.success("Termin abgesagt");
    onGespeichert();
  }

  async function statusUmschalten() {
    if (!termin) return;
    const { error } = await supabase
      .from("appointments")
      .update({ status: termin.status === "abgehakt" ? "geplant" : "abgehakt" })
      .eq("id", termin.id);
    if (error) {
      toast.error("Konnte nicht gespeichert werden");
      return;
    }
    onGespeichert();
  }

  return (
    <Dialog open onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary">
            {termin ? "Termin" : "Neuer Termin"}
          </DialogTitle>
        </DialogHeader>

        {termin ? (
          <div className="grid gap-3 text-sm">
            <p className="font-display text-lg text-primary">{termin.patients?.name ?? "—"}</p>
            <p className="text-muted-foreground">{termin.appointment_types?.name ?? "—"}</p>
            <p className="text-primary">
              {format(new Date(termin.start), "EEEE, d. MMMM · HH:mm")} –{" "}
              {format(new Date(termin.ende), "HH:mm")}
            </p>
            <p className="text-xs text-muted-foreground">
              {termin.quelle === "online" ? "Online gebucht" : "Von Hand eingetragen"} ·{" "}
              {termin.status === "abgehakt" ? "stattgefunden" : "geplant"}
            </p>
            {termin.anliegen ? (
              <p className="rounded-lg bg-accent px-3 py-2 text-primary">{termin.anliegen}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="pill" size="pillSm" onClick={() => void statusUmschalten()}>
                {termin.status === "abgehakt" ? "Abhaken zurücknehmen" : "Abhaken"}
              </Button>
              <Button variant="pillOutline" size="pillSm" onClick={() => void absagen()}>
                Absagen
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="art">Behandlungsart</Label>
              <select
                id="art"
                value={artId}
                onChange={(e) => setArtId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {arten.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {art ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {behandler.find((b) => b.id === art.practitioner_id)?.name ?? "—"} ·{" "}
                  {art.dauer_minuten ?? 60} Minuten
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="patient">Patientin oder Patient</Label>
              <select
                id="patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Neu anlegen …</option>
                {patienten.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {patientId ? null : (
              <div className="grid gap-3 rounded-xl bg-card p-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={neuerName}
                    onChange={(e) => setNeuerName(e.target.value)}
                    placeholder="Vor- und Nachname"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="mail">E-Mail (optional)</Label>
                  <Input
                    id="mail"
                    type="email"
                    value={neueEmail}
                    onChange={(e) => setNeueEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="datum">Datum</Label>
                <Input
                  id="datum"
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="zeit">Uhrzeit</Label>
                <Input
                  id="zeit"
                  type="time"
                  step={900}
                  value={zeit}
                  onChange={(e) => setZeit(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <Button
              variant="pill"
              size="pill"
              className="mt-1 w-full"
              disabled={laeuft}
              onClick={() => void speichern()}
            >
              {laeuft ? "Wird gespeichert …" : "Termin eintragen"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
