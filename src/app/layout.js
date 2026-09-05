import { Inter, Playfair_Display, Amiri, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/components/i18n/LanguageProvider";
import T from "@/components/i18n/T";
import { getLocale, localizeMetadata } from "@/lib/i18n/server";
import { localeDirection } from "@/lib/i18n/translate.mjs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const urdu = Noto_Naskh_Arabic({ variable: "--font-urdu", subsets: ["arabic"], weight: ["400", "700"], display: "swap" });

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

const baseMetadata = {
  metadataBase: new URL("https://taseescircle.com"),
  title: {
    default: "Ta'sees Circle — Digital Islamic Knowledge & Community Hub",
    template: "%s | Ta'sees Circle",
  },
  description:
    "Ta'sees Circle connects Muslim communities in Pakistan and Canada with authentic Islamic guidance on Rizq e Halal, finance, and societal issues, grounded in Quran & Hadith.",
  keywords: [
    "Ta'sees Circle",
    "Islamic community",
    "Rizq e Halal",
    "Pakistan Muslim community",
    "Canada Muslim community",
    "Quran guidance",
    "Hadith references",
    "Islamic finance",
    "Muhammad Maqbool Ahmed Khan",
  ],
  authors: [{ name: "Muhammad Maqbool Ahmed Khan", url: "https://taseescircle.com/about" }],
  creator: "Muhammad Maqbool Ahmed Khan",
  publisher: "Ta'sees Circle",
  applicationName: "Ta'sees Circle",
  appleWebApp: { capable: true, title: "Ta'sees Circle", statusBarStyle: "default" },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Ta'sees Circle — Digital Islamic Knowledge & Community Hub",
    description:
      "Connecting Muslim communities in Pakistan and Canada through authentic knowledge, online discussions, and Quran & Hadith guidance.",
    url: "https://taseescircle.com",
    siteName: "Ta'sees Circle",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ta'sees Circle — Digital Islamic Knowledge Hub",
    description:
      "Authentic Islamic guidance on Rizq e Halal, finance, and societal challenges for Muslims in Pakistan & Canada.",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://taseescircle.com/#organization",
      name: "Ta'sees Circle",
      url: "https://taseescircle.com",
      logo: "https://taseescircle.com/brand/logo.png",
      foundingDate: "2026-08",
      founder: {
        "@type": "Person",
        name: "Muhammad Maqbool Ahmed Khan",
        jobTitle: "Founder & CEO",
      },
      description:
        "Digital Islamic platform connecting Muslim communities in Pakistan and Canada through authentic Quran and Hadith guidance.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@taseescircle.org",
        contactType: "customer support",
        areaServed: ["PK", "CA"],
        availableLanguage: ["English", "Urdu"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://taseescircle.com/#website",
      url: "https://taseescircle.com",
      name: "Ta'sees Circle",
      publisher: {
        "@id": "https://taseescircle.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://taseescircle.com/discussions?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export async function generateMetadata() { return localizeMetadata(baseMetadata); }

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={localeDirection(locale)}
      className={`${inter.variable} ${playfair.variable} ${amiri.variable} ${urdu.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-beige-50 text-charcoal-500">
        <LanguageProvider initialLocale={locale}>
        {/* Skip-to-content link — keyboard accessibility (H-09) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
        >
          <T>Skip to main content</T>
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
