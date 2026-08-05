CREATE TYPE public.contact_request_status AS ENUM ('neu', 'beantwortet', 'erledigt');

CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  telefon text,
  nachricht text NOT NULL,
  status public.contact_request_status NOT NULL DEFAULT 'neu',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Besucher duerfen Anfragen senden"
  ON public.contact_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Mitarbeiter:innen koennen Anfragen lesen"
  ON public.contact_requests FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Mitarbeiter:innen koennen Anfragen aendern"
  ON public.contact_requests FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Mitarbeiter:innen koennen Anfragen loeschen"
  ON public.contact_requests FOR DELETE TO authenticated
  USING (true);

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();