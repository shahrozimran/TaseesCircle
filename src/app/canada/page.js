import CanadaClient from "./CanadaClient";

export const metadata = {
  title: "Canada Community — Halal Living & Guidance in Canada",
  description:
    "Islamic guidance tailored for Canadian Muslims on halal salary evaluation, riba-free home mortgages, halal investing, workplace rights, and raising Islamic families.",
  keywords: [
    "Canada Muslim community",
    "Halal mortgage Canada",
    "Halal salary Canada",
    "Muslim identity West",
    "Islamic finance Canada",
    "Ta'sees Circle Canada",
  ],
  alternates: {
    canonical: "https://taseescircle.com/canada",
  },
  openGraph: {
    title: "Canada Community — Halal Living & Guidance | Ta'sees Circle",
    description:
      "A digital knowledge hub serving Muslims across Canada with authentic Islamic guidance grounded in Quran & Hadith.",
    url: "https://taseescircle.com/canada",
  },
};

export default function CanadaPage() {
  return <CanadaClient />;
}
