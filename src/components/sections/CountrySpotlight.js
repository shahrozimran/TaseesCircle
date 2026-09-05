"use client";
import T from "@/components/i18n/T";


import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Hash } from "lucide-react";

export default function CountrySpotlight() {
  const countries = [
    {
      name: "Pakistan",
      href: "/discussions/pakistan",
      description: "Online knowledge blogs on Rizq e Halal, Islamic finance, business ethics, and societal issues — guided by Quran and Hadith, for Muslims across Pakistan.",
      topics: ["Rizq e Halal", "Halal Business", "Fiqh Q&A"],
      gradient: "from-charcoal-600 via-charcoal-500 to-islamic-green/80",
      emoji: "🇵🇰",
    },
    {
      name: "Canada",
      href: "/discussions/canada",
      description: "Online discussions on halal income in Canada, riba-free mortgages, Muslim identity in the West, and raising Islamic families — all grounded in Quran & Sunnah.",
      topics: ["Halal Income", "Riba-Free Living", "Muslim Identity"],
      gradient: "from-charcoal-600 via-charcoal-500 to-gold-dark",
      emoji: "🇨🇦",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
      {countries.map((country, i) => (
        <motion.div
          key={country.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
        >
          <Link href={country.href} className="group block">
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${country.gradient} p-6 sm:p-8 md:p-10 min-h-[260px] sm:min-h-[300px] flex flex-col justify-end islamic-pattern shadow-card group-hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1`}>
              {/* Large Emoji */}
              <div className="absolute top-4 end-4 sm:top-6 sm:end-6 text-4xl sm:text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                <T>{country.emoji}</T>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 sm:mb-3">
                  <T>{country.name}</T>
                </h3>

                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 max-w-sm">
                  <T>{country.description}</T>
                </p>

                {/* Topic badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                  {country.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-white/10 text-white/90"
                    >
                      <Hash size={9} />
                      <T>{topic}</T>
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-gold-light font-medium text-xs sm:text-sm group-hover:gap-3 transition-all"><T>
                  Read Discussions
                  </T><ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
