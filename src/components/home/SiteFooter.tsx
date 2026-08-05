import { Brand } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="bg-primary pb-10 pt-14 text-sage-tint">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Brand light />
          <nav className="flex flex-wrap gap-6 font-semibold" aria-label="Footer-Navigation">
            <a href="#ansatz" className="hover:text-creme">
              Ansatz
            </a>
            <a href="#therapien" className="hover:text-creme">
              Therapien
            </a>
            <a href="#kontakt" className="hover:text-creme">
              Kontakt
            </a>
          </nav>
          <address className="not-italic">
            Körpertherapie &amp; Psychotherapie Kube
            <br />
            Dieselstraße 16
            <br />
            86368 Gersthofen
          </address>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-4 border-t border-sage-tint/20 pt-6 text-sm text-sage-tint/70">
          <p>© {new Date().getFullYear()} Körpertherapie &amp; Psychotherapie Kube</p>
          <p>Impressum · Datenschutz</p>
        </div>
      </div>
    </footer>
  );
}
