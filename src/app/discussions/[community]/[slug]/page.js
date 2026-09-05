import { getLocale } from "@/lib/i18n/server";
import { BRAND_SOCIAL_IMAGE } from "@/lib/brand";
import { translateText } from "@/lib/i18n/translate.mjs";

import T from "@/components/i18n/T";
import { pakistanBlogContent, pakistanDiscussions } from "@/data/pakistan";
import { canadaBlogContent, canadaDiscussions } from "@/data/canada";
import QuranBlock from "@/components/ui/QuranBlock";
import HadithBlock from "@/components/ui/HadithBlock";
import DiscussionCard from "@/components/ui/DiscussionCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Tag,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export async function generateMetadata({ params }) {
  const locale = await getLocale();
  const t = (text) => translateText(text, locale);
  const { community, slug } = await params;
  const blogMap = community === "canada" ? canadaBlogContent : pakistanBlogContent;
  const article = blogMap[slug];

  if (!article) {
    return { title: t("Discussion Not Found — Ta'sees Circle") };
  }

  const canonicalUrl = `https://taseescircle.com/discussions/${community}/${slug}`;

  return {
    title: t(article.title),
    description: t(article.intro).slice(0, 160),
    keywords: [
      article.category,
      ...(article.tags || []),
      "Ta'sees Circle",
      "Quran reference",
      "Hadith guidance",
      community === "canada" ? "Canada Muslims" : "Pakistan Muslims",
    ],
    authors: [{ name: article.author || "Muhammad Maqbool Ahmed Khan" }],
    publisher: "Ta'sees Circle",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      images: [BRAND_SOCIAL_IMAGE],
      title: t(article.title),
      description: t(article.intro).slice(0, 160),
      url: canonicalUrl,
      siteName: "Ta'sees Circle",
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author || "Muhammad Maqbool Ahmed Khan"],
    },
    twitter: {
      images: [BRAND_SOCIAL_IMAGE],
      card: "summary_large_image",
      title: t(article.title),
      description: t(article.intro).slice(0, 160),
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const locale = await getLocale();
  const t = (text) => translateText(text, locale);
  const { community, slug } = await params;

  // ── Community resolver — fixes H-01 (ReferenceError 500) ──────────────────
  const COMMUNITY_MAP = {
    pakistan: { name: "Pakistan", hubUrl: "/discussions/pakistan" },
    canada:   { name: "Canada",   hubUrl: "/discussions/canada"   },
  };

  const communityMeta = COMMUNITY_MAP[community];
  if (!communityMeta) notFound();

  const communityName   = communityMeta.name;
  const communityHubUrl = communityMeta.hubUrl;
  // ──────────────────────────────────────────────────────────────────────────

  const blogMap = community === "canada" ? canadaBlogContent : pakistanBlogContent;
  const discussionsList = community === "canada" ? canadaDiscussions : pakistanDiscussions;
  const article = blogMap[slug];

  if (!article) {
    notFound();
  }


  // Related discussions
  const relatedSlugs = article.relatedSlugs || [];
  const relatedArticles = discussionsList.filter((d) =>
    relatedSlugs.includes(d.slug)
  );

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t(article.title),
    description: t(article.intro),
    articleSection: article.category,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: article.author || "Muhammad Maqbool Ahmed Khan",
    },
    publisher: {
      "@type": "Organization",
      name: "Ta'sees Circle",
      url: "https://taseescircle.com",
      logo: "https://taseescircle.com/brand/logo.png",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://taseescircle.com/discussions/${community}/${slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-beige-50 pt-24 sm:pt-28 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-beige-200 py-3.5 mb-8">
        <div className="section-container flex items-center gap-2 text-xs sm:text-sm text-charcoal-300 overflow-x-auto whitespace-nowrap">
          <Link href="/discussions" className="hover:text-gold transition-colors"><T>
            Discussions
          </T></Link>
          <ChevronRight size={14} className="shrink-0 text-charcoal-200" />
          <Link href={communityHubUrl} className="hover:text-gold transition-colors font-medium text-charcoal-500">
            <T>{communityName} Hub
          </T></Link>
          <ChevronRight size={14} className="shrink-0 text-charcoal-200" />
          <span className="text-charcoal-400 font-semibold truncate max-w-[200px] sm:max-w-md">
            <T>{article.title}</T>
          </span>
        </div>
      </div>

      <div className="section-container">
        {/* Back Link */}
        <Link
          href={communityHubUrl}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gold hover:text-gold-dark transition-colors mb-6"
        >
          <ArrowLeft size={16} /><T message="Back to {community} Discussions" values={{ community: <T>{communityName}</T> }} /></Link>

        {/* Main Grid: Left Article (2/3) + Right Sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Article Main Body (8 Cols) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-card border border-beige-100">
            {/* Category & Meta */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4 border-b border-beige-100 pb-4">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20">
                <T>{article.category}</T>
              </span>
              <div className="flex items-center gap-4 text-xs text-charcoal-300">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-gold" />
                  <T>{article.readTime}</T>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold" />
                  <T>{article.publishDate}</T>
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="font-heading font-bold text-charcoal-600 text-2xl sm:text-3xl md:text-4xl leading-tight mb-3">
              <T>{article.title}</T>
            </h1>
            {article.subtitle && (
              <p className="text-charcoal-400 text-sm sm:text-base leading-relaxed mb-6 font-medium italic border-s-2 border-gold ps-4 py-1">
                <T>{article.subtitle}</T>
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-beige-50 border border-beige-200 mb-8">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-charcoal-600">
                  <T>{article.author}</T>
                </p>
                <p className="text-[11px] text-charcoal-300">
                  <T>{article.authorTitle}</T>
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div className="prose max-w-none text-charcoal-500 text-sm sm:text-base leading-relaxed mb-8 space-y-4">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-gold first-letter:float-left first-letter:me-2">
                <T>{article.intro}</T>
              </p>
            </div>

            {/* Sections Loop */}
            <div className="space-y-8">
              {article.sections.map((sec, idx) => (
                <div key={idx} className="pt-4 border-t border-beige-100">
                  <h2 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl md:text-2xl mb-3">
                    <T>{sec.heading}</T>
                  </h2>
                  <p className="text-charcoal-400 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4">
                    <T>{sec.content}</T>
                  </p>

                  {/* Quranic Reference Card if present */}
                  {sec.quranRef && (
                    <QuranBlock
                      arabic={sec.quranRef.arabic}
                      translation={sec.quranRef.translation}
                      surah={sec.quranRef.surah}
                    />
                  )}

                  {/* Hadith Reference Card if present */}
                  {sec.hadithRef && (
                    <HadithBlock
                      text={sec.hadithRef.text}
                      source={sec.hadithRef.source}
                      grade={sec.hadithRef.grade}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Conclusion */}
            {article.conclusion && (
              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-beige-50 to-beige-100 border border-beige-200">
                <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2 flex items-center gap-2">
                  <BookOpen size={18} className="text-gold" /><T>
                  Key Takeaway & Conclusion
                </T></h3>
                <p className="text-charcoal-500 text-xs sm:text-sm leading-relaxed">
                  <T>{article.conclusion}</T>
                </p>
              </div>
            )}

            {/* Scholarly Disclaimer */}
            <div className="mt-8 p-4 rounded-xl bg-islamic-green/5 border border-islamic-green/20 flex items-start gap-3">
              <ShieldCheck size={20} className="text-islamic-green shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-charcoal-400 leading-relaxed">
                <strong><T>Scholarly Verification Note:</T></strong><T> All Quranic verses and Hadith references in this discussion have been verified against primary Islamic sources. This content is provided for educational purposes. For personal rulings regarding your specific financial or career situation, please consult a qualified Islamic scholar.
              </T></p>
            </div>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-beige-100 flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-charcoal-300" />
                <span className="text-xs text-charcoal-300 font-medium me-1"><T>Tags:</T></span>
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-beige-100 text-charcoal-400 px-3 py-1 rounded-full border border-beige-200"
                  >
                    #<T>{t}</T>
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-beige-100">
              <h3 className="font-heading font-bold text-charcoal-600 text-base mb-3 pb-2 border-b border-beige-100 flex items-center gap-2">
                <BookOpen size={16} className="text-gold" /><T>
                In This Discussion
              </T></h3>
              <ul className="space-y-2 text-xs sm:text-sm text-charcoal-400">
                {article.sections.map((sec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span className="leading-snug hover:text-gold transition-colors">
                      <T>{sec.heading}</T>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Join Discussion Circle CTA */}
            <div className="bg-gradient-to-br from-charcoal-600 to-charcoal-500 text-white rounded-2xl p-6 islamic-pattern shadow-card">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mb-3">
                <MessageSquare size={20} className="text-gold" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2"><T>
                Have Questions?
              </T></h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4"><T message="Join our online discussion circles to ask qualified scholars questions about {category} and Islamic living." values={{ category: <T>{article.category.toLowerCase()}</T> }} /></p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-gold text-white font-medium text-xs rounded-xl hover:shadow-lg transition-all"
              ><T>
                Join Online Circle
              </T></Link>
            </div>

            {/* Related Discussions */}
            {relatedArticles.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-charcoal-600 text-base px-1"><T>
                  Related Discussions
                </T></h3>
                {relatedArticles.map((rel) => (
                  <DiscussionCard key={rel.slug} {...rel} community={community} />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
