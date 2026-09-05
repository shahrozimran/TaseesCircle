import { localizeMetadata } from "@/lib/i18n/server";
import ResourcesClient from "./ResourcesClient";

const baseMetadata = {
  title: "Resources & Learning — Islamic Educational Materials",
  description:
    "Access curated Islamic learning materials, Quran study guides, Hadith collections, and authentic literature from Ta'sees Circle.",
  keywords: [
    "Islamic learning materials",
    "Quran study guides",
    "Hadith collections",
    "Islamic literature",
    "Ta'sees Circle resources",
  ],
  alternates: {
    canonical: "https://taseescircle.com/resources",
  },
  openGraph: {
    title: "Resources & Learning | Ta'sees Circle",
    description:
      "Access curated Islamic learning materials, Quran study guides, and Hadith collections.",
    url: "https://taseescircle.com/resources",
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}

export async function generateMetadata() { return localizeMetadata(baseMetadata); }
