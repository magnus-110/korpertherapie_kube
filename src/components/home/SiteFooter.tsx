import { Link } from "@tanstack/react-router";
import { Brand } from "./SiteHeader";
import { praxis } from "@/lib/praxis";

const pages = [
  { to: "/therapien", label: "Therapien" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/kontakt", label: "Kontakt & Anfahrt" },
  { to: "/termin", label: "Termin buchen" },
] as const;

const legal = [
  { to: "/impressum", label: "Impressum" },
  { to: "/datenschutz", label: "Datenschutz" },
  { to: "/widerruf", label: "Widerruf" },
  { to: "/sitemap", label: "Sitemap" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-primary pb-10 pt-14 text-sage-tint">
      <div className="mx-auto max-w-[1140px] px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Brand light />
          <nav className="flex flex-col gap-3 font-semibold" aria-label="Footer-Navigation">
            {pages.map((p) => (
              <Link key={p.to} to={p.to} className="hover:text-creme">
                {p.label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col gap-3" aria-label="Rechtliches">
            {legal.map((p) => (
              <Link key={p.to} to={p.to} className="hover:text-creme">
                {p.label}
              </Link>
            ))}
          </nav>
          <address className="not-italic">
            {praxis.name}
            <br />
            {praxis.strasse}
            <br />
            {praxis.ort}
            <br />
            <a href={praxis.telefonHref} className="hover:text-creme">
              {praxis.telefon}
            </a>
          </address>
        </div>
        <div className="mt-9 flex flex-wrap justify-between gap-4 border-t border-sage-tint/20 pt-6 text-sm text-sage-tint/70">
          <p>© {new Date().getFullYear()} {praxis.name}</p>
          <a href={praxis.instagramUrl} className="hover:text-creme">
            Instagram {praxis.instagram}
          </a>
        </div>
      </div>
    </footer>
  );
}
