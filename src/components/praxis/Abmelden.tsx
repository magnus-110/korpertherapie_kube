import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function Abmelden({ kompakt = false }: { kompakt?: boolean }) {
  const navigate = useNavigate();

  async function abmelden() {
    await supabase.auth.signOut();
    toast.success("Abgemeldet");
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <button
      type="button"
      onClick={abmelden}
      className={
        kompakt
          ? "grid min-h-11 min-w-11 place-items-center rounded-full text-sage transition-colors hover:bg-white/10 hover:text-creme"
          : "inline-flex items-center gap-2 text-sm text-sage transition-colors hover:text-creme"
      }
      aria-label="Abmelden"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {kompakt ? null : <span>Abmelden</span>}
    </button>
  );
}
