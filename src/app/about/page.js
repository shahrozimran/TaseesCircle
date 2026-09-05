import { localizeMetadata } from "@/lib/i18n/server";
import AboutClient from "./AboutClient";

const baseMetadata = {
  title: "About Us — Founder & Mission",
  description:
    "Founded in August 2026 by Muhammad Maqbool Ahmed Khan, Ta'sees Circle introduces an authentic Islamic lifestyle model for Muslims in Pakistan, Canada, and worldwide.",
  keywords: [
    "About Ta'sees Circle",
    "Muhammad Maqbool Ahmed Khan",
    "Founder Ta'sees Circle",
    "Islamic model living",
    "Rizq e Halal platform",
    "Pakistan Canada Muslim platform",
  ],
  alternates: {
    canonical: "https://taseescircle.com/about",
  },
  openGraph: {
    title: "About Us — Founder & Mission | Ta'sees Circle",
    description:
      "Founded in August 2026 by Muhammad Maqbool Ahmed Khan, Ta'sees Circle introduces an authentic Islamic lifestyle model for Muslims in Pakistan and Canada.",
    url: "https://taseescircle.com/about",
  },
};

const jsonLdAbout = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Ta'sees Circle",
  description:
    "Founded in August 2026 by Muhammad Maqbool Ahmed Khan, Ta'sees Circle introduces an authentic Islamic lifestyle model for Muslims in Pakistan, Canada, and worldwide.",
  url: "https://taseescircle.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "Ta'sees Circle",
    foundingDate: "2026-08",
    founder: {
      "@type": "Person",
      name: "Muhammad Maqbool Ahmed Khan",
      jobTitle: "Founder & CEO",
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />
      <AboutClient />
    </>
  );
}

export async function generateMetadata() { return localizeMetadata(baseMetadata); }
