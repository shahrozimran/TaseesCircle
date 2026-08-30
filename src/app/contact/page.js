import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us — Connect with Ta'sees Circle",
  description:
    "Have questions about our online discussions, want to get involved, or need Islamic guidance? Reach out to Ta'sees Circle in Pakistan or Canada.",
  keywords: [
    "Contact Ta'sees Circle",
    "Islamic community support",
    "Pakistan Muslim support",
    "Canada Muslim support",
    "Ask Islamic question",
  ],
  alternates: {
    canonical: "https://taseescircle.com/contact",
  },
  openGraph: {
    title: "Contact Us | Ta'sees Circle",
    description:
      "Reach out to Ta'sees Circle in Pakistan or Canada with questions, comments, or volunteer inquiries.",
    url: "https://taseescircle.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
