"use client";

import { MessageCircle } from "lucide-react";

export default function HadithBlock({ text, source, grade, className = "" }) {
  if (!text) return null;

  return (
    <div
      className={`rounded-2xl bg-beige-50 border border-beige-200 p-5 sm:p-6 my-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <MessageCircle size={13} className="text-gold" />
          </div>
          <span className="text-gold text-xs font-semibold uppercase tracking-wider">
            Hadith Reference
          </span>
        </div>
        {grade && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-islamic-green/10 text-islamic-green border border-islamic-green/20">
            {grade}
          </span>
        )}
      </div>

      <p className="text-charcoal-500 text-xs sm:text-sm leading-relaxed italic mb-2.5">
        &ldquo;{text}&rdquo;
      </p>

      {source && (
        <p className="text-charcoal-400 text-xs font-medium text-right">
          — {source}
        </p>
      )}
    </div>
  );
}
