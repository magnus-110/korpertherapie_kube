import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an.").max(100),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an.").max(255),
  telefon: z.string().trim().max(50).optional().or(z.literal("")),
  nachricht: z.string().trim().min(10, "Bitte schreib uns ein paar Worte.").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const sendContactRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("contact_requests").insert({
      name: data.name,
      email: data.email,
      telefon: data.telefon ? data.telefon : null,
      nachricht: data.nachricht,
    });

    if (error) {
      console.error("contact_requests insert failed", error.message);
      throw new Error("Deine Anfrage konnte nicht gesendet werden.");
    }

    return { ok: true };
  });
