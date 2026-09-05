"use client";
import T from "@/components/i18n/T";


import { BookOpen } from "lucide-react";

export default function QuranBlock({ arabic, translation, surah, className = "" }) {
  if (!arabic && !translation) return null;

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600 p-5 sm:p-6 text-white islamic-pattern shadow-md border border-gold/20 my-6 ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-gold" />
        </div>
        <span className="text-gold text-xs font-semibold uppercase tracking-wider"><T>
          Quranic Reference
        </T></span>
      </div>

      {/* Arabic Verse */}
      {arabic && (
        <p
          dir="rtl" lang="ar" translate="no"
          className="text-white/95 text-right font-arabic text-lg sm:text-xl md:text-2xl leading-loose sm:leading-loose mb-3"
        >
          {arabic}
        </p>
      )}

      {/* Translation */}
      {translation && (
        <p className="text-white/80 text-xs sm:text-sm leading-relaxed italic mb-2">
          &ldquo;<T>{translation}</T>&rdquo;
        </p>
      )}

      {/* Surah Citation */}
      {surah && (
        <p className="text-gold text-xs font-medium text-end tracking-wide">
          — <T>{surah}</T>
        </p>
      )}
    </div>
  );
}
