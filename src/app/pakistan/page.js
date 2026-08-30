import PakistanClient from "./PakistanClient";

export const metadata = {
  title: "Pakistan Community — Rizq e Halal & Islamic Guidance",
  description:
    "Explore authentic Islamic discussions on earning halal livelihood, job ethics, freelancing, and avoiding riba in Pakistan with Quran & Hadith references.",
  keywords: [
    "Pakistan Islamic community",
    "Rizq e Halal Pakistan",
    "Freelancing Halal Pakistan",
    "Avoiding Riba Pakistan",
    "Islamic workplace ethics",
    "Ta'sees Circle Pakistan",
  ],
  alternates: {
    canonical: "https://taseescircle.com/pakistan",
  },
  openGraph: {
    title: "Pakistan Community — Rizq e Halal & Guidance | Ta'sees Circle",
    description:
      "A digital knowledge hub for Muslims across Pakistan — exploring Rizq e Halal, societal challenges, and Islamic wisdom.",
    url: "https://taseescircle.com/pakistan",
  },
};

export default function PakistanPage() {
  return <PakistanClient />;
}
