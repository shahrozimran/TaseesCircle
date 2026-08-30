import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Ta'sees Circle — Uniting Hearts, Building Communities",
    template: "%s | Ta'sees Circle",
  },
  description:
    "Ta'sees Circle is an Islamic community engagement platform connecting Muslim communities in Pakistan and Canada through education, programs, and shared values.",
  keywords: [
    "Islamic community",
    "Muslim engagement",
    "Ta'sees Circle",
    "Pakistan",
    "Canada",
    "Quran",
    "Islamic education",
  ],
  openGraph: {
    title: "Ta'sees Circle — Uniting Hearts, Building Communities",
    description:
      "Connecting Muslim communities in Pakistan and Canada through education, programs, and shared values.",
    type: "website",
    locale: "en_US",
    siteName: "Ta'sees Circle",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-beige-50 text-charcoal-500">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
