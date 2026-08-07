import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Check, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { praxis } from "@/lib/praxis";

type Props = {
  offen: boolean;
  onOpenChange: (offen: boolean) => void;
  artId: string;
  artName: string;
  personName: string;
  dauer: number;
  start: string;
  onGebucht: () => void;
};

const MAX = { name: 100, email: 255, text: 1000, kurz: 60 };

/**
 * Buchungsabschluss im Pop-up: erst Anmeldung oder Registrierung,
 * dann Anliegen und verbindliche Buchung. Ohne Weiterleitung.
 */
export function BuchungsDialog({
  offen,
  onOpenChange,
  artId,
  artName,
  personName,
  dauer,
  start,
  onGebucht,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [pruefeSitzung, setPruefeSitzung] = useState(true);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [fertig, setFertig] = useState(false);

  // Anmeldung
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");

  // Registrierung
  const [name, setName] = useState("");
  const [telefon, setTelefon] = useState("");
  const [geburtsdatum, setGeburtsdatum] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");

  // Buchung
  const [anliegen, setAnliegen] = useState("");
  const [zustimmung, setZustimmung] = useState(false);

  useEffect(() => {
    let weg = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (weg) return;
      setUser(data.user ?? null);
      setPruefeSitzung(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      weg = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function anmelden() {
    setFehler(null);
    setLaedt(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: passwort,
    });
    setLaedt(false);
    if (error) {
      setFehler("E-Mail oder Passwort stimmt nicht.");
      return;
    }
    setPasswort("");
  }

  async function registrieren() {
    setFehler(null);
    if (!name.trim() || !email.trim() || passwort.length < 8) {
      setFehler("Bitte Name, E-Mail und ein Passwort mit mindestens 8 Zeichen angeben.");
      return;
    }
    setLaedt(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: passwort,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          rolle: "patient",
          name: name.trim().slice(0, MAX.name),
          telefon: telefon.trim().slice(0, MAX.kurz),
          geburtsdatum: geburtsdatum || null,
          strasse: strasse.trim().slice(0, MAX.name),
          plz: plz.trim().slice(0, 10),
          ort: ort.trim().slice(0, MAX.name),
        },
      },
    });
    setLaedt(false);
    if (error) {
      setFehler(
        error.message.toLowerCase().includes("registered")
          ? "Für diese E-Mail gibt es schon ein Konto. Bitte melde dich an."
          : error.message,
      );
      return;
    }
    setPasswort("");
  }

  async function buchen() {
    setFehler(null);
    setLaedt(true);
    const { error } = await supabase.rpc("termin_buchen_konto", {
      _behandlungsart: artId,
      _start: start,
      _anliegen: anliegen.slice(0, MAX.text),
    });
    setLaedt(false);
    if (error) {
      setFehler(error.message.replace(/^.*?:\s*/, ""));
      return;
    }
    setFertig(true);
  }

  const zeit = format(parseISO(start), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de });

  return (
    <Dialog
      open={offen}
      onOpenChange={(o) => {
        if (!o && fertig) onGebucht();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary">{artName}</DialogTitle>
          <DialogDescription>
            {personName} · {dauer} Minuten
            <span className="mt-1 block font-semibold text-secondary">{zeit}</span>
          </DialogDescription>
        </DialogHeader>

        {fertig ? (
          <div className="py-4">
            <div className="mb-4 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-5" aria-hidden="true" />
            </div>
            <p className="font-display text-lg text-primary">Termin gebucht</p>
            <p className="mt-2 text-[0.95rem] text-muted-foreground">
              Du bekommst eine Bestätigung per E-Mail. Fragen? {praxis.telefon}
            </p>
            <Button
              variant="pill"
              size="pill"
              className="mt-5 w-full"
              onClick={() => {
                onGebucht();
                onOpenChange(false);
              }}
            >
              Schließen
            </Button>
          </div>
        ) : pruefeSitzung ? (
          <p className="flex items-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Einen Moment …
          </p>
        ) : user ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bd-anliegen">Dein Anliegen</Label>
              <Textarea
                id="bd-anliegen"
                rows={3}
                maxLength={MAX.text}
                value={anliegen}
                onChange={(e) => setAnliegen(e.target.value)}
                className="mt-1.5"
                placeholder="Was führt dich zu uns?"
              />
            </div>

            <label className="flex items-start gap-3 text-[0.9rem]">
              <input
                type="checkbox"
                checked={zustimmung}
                onChange={(e) => setZustimmung(e.target.checked)}
                className="mt-1 size-4"
              />
              <span>
                Ich habe die{" "}
                <a href="/datenschutz" className="text-secondary underline underline-offset-4">
                  Datenschutzerklärung
                </a>{" "}
                gelesen und bin einverstanden. *
              </span>
            </label>

            {fehler ? (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {fehler}
              </p>
            ) : null}

            <Button
              variant="pill"
              size="pill"
              className="w-full"
              disabled={laedt || !zustimmung}
              onClick={() => void buchen()}
            >
              {laedt ? "Wird gebucht …" : "Verbindlich buchen"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Angemeldet als {user.email}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="anmelden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="anmelden">Anmelden</TabsTrigger>
              <TabsTrigger value="konto">Konto anlegen</TabsTrigger>
            </TabsList>

            <TabsContent value="anmelden" className="space-y-4 pt-4">
              <div>
                <Label htmlFor="bd-email">E-Mail</Label>
                <Input
                  id="bd-email"
                  type="email"
                  autoComplete="email"
                  maxLength={MAX.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="bd-passwort">Passwort</Label>
                <Input
                  id="bd-passwort"
                  type="password"
                  autoComplete="current-password"
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              {fehler ? (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {fehler}
                </p>
              ) : null}
              <Button
                variant="pill"
                size="pill"
                className="w-full"
                disabled={laedt}
                onClick={() => void anmelden()}
              >
                {laedt ? "Anmelden …" : "Anmelden und weiter"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Passwort vergessen? Ruf uns an: {praxis.telefon}
              </p>
            </TabsContent>

            <TabsContent value="konto" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="bd-name">Name *</Label>
                  <Input
                    id="bd-name"
                    autoComplete="name"
                    maxLength={MAX.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-email2">E-Mail *</Label>
                  <Input
                    id="bd-email2"
                    type="email"
                    autoComplete="email"
                    maxLength={MAX.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-passwort2">Passwort *</Label>
                  <Input
                    id="bd-passwort2"
                    type="password"
                    autoComplete="new-password"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className="mt-1.5"
                    placeholder="mind. 8 Zeichen"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-telefon">Telefon</Label>
                  <Input
                    id="bd-telefon"
                    type="tel"
                    autoComplete="tel"
                    maxLength={MAX.kurz}
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-geb">Geburtsdatum</Label>
                  <Input
                    id="bd-geb"
                    type="date"
                    value={geburtsdatum}
                    onChange={(e) => setGeburtsdatum(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bd-strasse">Straße und Hausnummer</Label>
                  <Input
                    id="bd-strasse"
                    autoComplete="street-address"
                    maxLength={MAX.name}
                    value={strasse}
                    onChange={(e) => setStrasse(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-plz">PLZ</Label>
                  <Input
                    id="bd-plz"
                    autoComplete="postal-code"
                    maxLength={10}
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bd-ort">Ort</Label>
                  <Input
                    id="bd-ort"
                    autoComplete="address-level2"
                    maxLength={MAX.name}
                    value={ort}
                    onChange={(e) => setOrt(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              {fehler ? (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {fehler}
                </p>
              ) : null}
              <Button
                variant="pill"
                size="pill"
                className="w-full"
                disabled={laedt}
                onClick={() => void registrieren()}
              >
                {laedt ? "Konto wird angelegt …" : "Konto anlegen und weiter"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
