import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { Approach } from "@/components/home/Approach";
import { Therapies } from "@/components/home/Therapies";
import { QuoteBand } from "@/components/home/QuoteBand";
import { Contact } from "@/components/home/Contact";
import { SiteFooter } from "@/components/home/SiteFooter";

const title = "Körpertherapie & Psychotherapie Kube · Gersthofen";
const description =
  "Privatpraxis in Gersthofen für Osteopathie, Psychotherapie, Naturheilkunde und Sportheilkunde – ganzheitlich, mit Zeit und auf Augenhöhe.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "Körpertherapie und Psychotherapie Kube",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Dieselstraße 16",
            postalCode: "86368",
            addressLocality: "Gersthofen",
            addressCountry: "DE",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Approach />
        <Therapies />
        <QuoteBand />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
