import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Behandler, Rolle } from "@/lib/rollen";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }

    // Rolle und – falls vorhanden – der zugehörige Behandler-Datensatz.
    const [rollenAntwort, behandlerAntwort] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", data.user.id).limit(1),
      supabase
        .from("practitioners")
        .select("id, name, kuerzel, farbe")
        .eq("user_id", data.user.id)
        .maybeSingle(),
    ]);

    const rolle: Rolle = rollenAntwort.data?.[0]?.role ?? "patient";
    const behandler: Behandler | null = behandlerAntwort.data ?? null;

    return { user: data.user, rolle, behandler };
  },
  component: () => <Outlet />,
});
