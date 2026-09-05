import { localizeMetadata } from "@/lib/i18n/server";
import DiscussionsLandingClient from "./DiscussionsLandingClient";

const baseMetadata = {
  title: "Islamic Knowledge Discussions & Community Hubs",
  description:
    "Explore in-depth Islamic knowledge discussions, Quranic insights, and Hadith guidance tailored for Muslim communities in Pakistan and Canada.",
  keywords: [
    "Islamic discussions",
    "Pakistan Islamic knowledge",
    "Canada Muslim community",
    "Rizq e Halal",
    "Islamic finance",
    "Ta'sees Circle",
  ],
  alternates: {
    canonical: "https://taseescircle.com/discussions",
  },
  openGraph: {
    title: "Islamic Knowledge Discussions & Community Hubs | Ta'sees Circle",
    description:
      "Select a regional community hub (Pakistan or Canada) to explore Islamic knowledge discussions grounded in Quran & Hadith.",
    url: "https://taseescircle.com/discussions",
  },
};

export default function DiscussionsLandingPage() {
  return <DiscussionsLandingClient />;
}

export async function generateMetadata() { return localizeMetadata(baseMetadata); }
