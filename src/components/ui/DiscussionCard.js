"use client";

import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Clock, Tag } from "lucide-react";

const categoryColors = {
  "Rizq & Livelihood": "bg-gold/10 text-gold border-gold/20",
  "Work & Ethics": "bg-islamic-green/10 text-islamic-green border-islamic-green/20",
  "Islamic Finance": "bg-charcoal-400/10 text-charcoal-500 border-charcoal-300/20",
  "Spiritual Wealth": "bg-beige-400/20 text-beige-600 border-beige-400/30",
  "Digital Economy": "bg-gold/10 text-gold border-gold/20",
  "Zakat & Charity": "bg-islamic-green/10 text-islamic-green border-islamic-green/20",
  "Rizq & Halal Income": "bg-gold/10 text-gold border-gold/20",
  "Family & Identity": "bg-charcoal-400/10 text-charcoal-500 border-charcoal-300/20",
  "Muslim Life in Canada": "bg-islamic-green/10 text-islamic-green border-islamic-green/20",
  "Identity & Community": "bg-beige-400/20 text-beige-600 border-beige-400/30",
};

export default function DiscussionCard({
  title,
  category,
  excerpt,
  quranRef,
  hadithRef,
  tags = [],
  readTime,
  index = 0,
}) {
  const badgeClass =
    categoryColors[category] ||
    "bg-gold/10 text-gold border-gold/20";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-card card-hover border border-beige-100 flex flex-col overflow-hidden group"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-beige-400 w-full" />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Category + Read time */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 flex-wrap">
          <span
            className={`inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium border ${badgeClass}`}
          >
            {category}
          </span>
          {readTime && (
            <span className="flex items-center gap-1 text-[11px] text-charcoal-300">
              <Clock size={11} />
              {readTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg leading-snug mb-2 sm:mb-3 group-hover:text-gold transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
          {excerpt}
        </p>

        {/* Quranic Reference */}
        {quranRef && (
          <div className="rounded-xl bg-gradient-to-br from-charcoal-600 to-charcoal-500 p-4 mb-3 islamic-pattern">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={12} className="text-gold" />
              </div>
              <span className="text-gold text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                Quranic Reference
              </span>
            </div>
            {/* Arabic text */}
            <p dir="rtl" className="text-white/90 text-right font-arabic text-base sm:text-lg leading-loose mb-2">
              {quranRef.arabic}
            </p>
            {/* Translation */}
            <p className="text-white/70 text-[11px] sm:text-xs leading-relaxed italic mb-1.5">
              &ldquo;{quranRef.translation}&rdquo;
            </p>
            {/* Surah reference */}
            <p className="text-gold text-[10px] sm:text-xs font-medium tracking-wide">
              — {quranRef.surah}
            </p>
          </div>
        )}

        {/* Hadith Reference */}
        {hadithRef && (
          <div className="rounded-xl bg-beige-50 border border-beige-200 p-3.5 mb-4">
            <div className="flex items-start gap-2.5 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle size={10} className="text-gold" />
              </div>
              <span className="text-gold text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                Hadith
              </span>
            </div>
            <p className="text-charcoal-400 text-[11px] sm:text-xs leading-relaxed italic mb-1">
              &ldquo;{hadithRef.text}&rdquo;
            </p>
            <p className="text-charcoal-300 text-[10px] font-medium">
              — {hadithRef.source}
            </p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-beige-100">
            <Tag size={11} className="text-charcoal-300 shrink-0" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs text-charcoal-300 bg-beige-100 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
