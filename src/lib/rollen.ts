import type { Database } from "@/integrations/supabase/types";

export type Rolle = Database["public"]["Enums"]["app_role"];

export const rollenLabel: Record<Rolle, string> = {
  verwaltung: "Verwaltung",
  behandler: "Behandler",
  patient: "Patientin oder Patient",
};

/** Wo die jeweilige Rolle nach der Anmeldung landet. */
export const startseite: Record<Rolle, string> = {
  verwaltung: "/praxis/uebersicht",
  behandler: "/praxis/heute",
  patient: "/praxis",
};

export type Behandler = {
  id: string;
  name: string;
  kuerzel: string | null;
  farbe: string;
};
