import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, sendContactRequest } from "@/lib/contact.functions";

export function ContactForm() {
  const send = useServerFn(sendContactRequest);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefon: String(fd.get("telefon") ?? ""),
      nachricht: String(fd.get("nachricht") ?? ""),
    };

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await send({ data: parsed.data });
      toast.success("Danke! Wir melden uns so bald wie möglich bei dir.");
      form.reset();
    } catch {
      toast.error("Das hat leider nicht geklappt. Bitte ruf uns kurz an.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required maxLength={100} />
        {errors["name"] ? (
          <p className="text-sm text-destructive">{errors["name"]}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required maxLength={255} />
        {errors["email"] ? (
          <p className="text-sm text-destructive">{errors["email"]}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telefon">Telefon (optional)</Label>
        <Input id="telefon" name="telefon" type="tel" autoComplete="tel" maxLength={50} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nachricht">Nachricht</Label>
        <Textarea id="nachricht" name="nachricht" rows={6} required maxLength={2000} />
        {errors["nachricht"] ? (
          <p className="text-sm text-destructive">{errors["nachricht"]}</p>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        Wir melden uns so bald wie möglich bei dir zurück. Bitte sende keine sensiblen
        Gesundheitsdaten über dieses Formular.
      </p>

      <div>
        <Button type="submit" variant="pill" size="pill" disabled={pending}>
          {pending ? "Wird gesendet …" : "Absenden"}
        </Button>
      </div>
    </form>
  );
}
