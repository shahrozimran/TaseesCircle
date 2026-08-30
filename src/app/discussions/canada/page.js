import CanadaDiscussionsClient from "./CanadaDiscussionsClient";

export const metadata = {
  title: "Canada Discussions — Halal Living & Guidance in Canada",
  description:
    "Explore in-depth Islamic guidance tailored for Muslims in Canada — halal salary evaluation, riba-free home mortgages, halal investing, and workplace rights.",
  keywords: [
    "Canada Islamic discussions",
    "Halal mortgage Canada",
    "Halal salary Canada",
    "Muslim identity Canada",
    "Islamic finance Canada",
    "Ta'sees Circle",
  ],
  alternates: {
    canonical: "https://taseescircle.com/discussions/canada",
  },
  openGraph: {
    title: "Canada Knowledge Discussions | Ta'sees Circle",
    description:
      "Explore in-depth Islamic discussions tailored for Canadian Muslims grounded in Quran & Hadith.",
    url: "https://taseescircle.com/discussions/canada",
  },
};

export default function CanadaDiscussionsPage() {
  return <CanadaDiscussionsClient />;
}
