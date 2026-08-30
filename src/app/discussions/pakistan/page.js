import PakistanDiscussionsClient from "./PakistanDiscussionsClient";

export const metadata = {
  title: "Pakistan Discussions — Rizq e Halal & Knowledge Hub",
  description:
    "Explore in-depth Islamic knowledge discussions tailored for Pakistan — earning halal income, workplace ethics, avoiding riba, freelancing, and Zakat.",
  keywords: [
    "Pakistan Islamic discussions",
    "Rizq e Halal Pakistan",
    "Workplace Fiqh Pakistan",
    "Avoiding Riba Pakistan",
    "Islamic finance Pakistan",
    "Ta'sees Circle",
  ],
  alternates: {
    canonical: "https://taseescircle.com/discussions/pakistan",
  },
  openGraph: {
    title: "Pakistan Knowledge Discussions | Ta'sees Circle",
    description:
      "Explore in-depth Islamic discussions tailored for Pakistan grounded in Quran & Hadith.",
    url: "https://taseescircle.com/discussions/pakistan",
  },
};

export default function PakistanDiscussionsPage() {
  return <PakistanDiscussionsClient />;
}
