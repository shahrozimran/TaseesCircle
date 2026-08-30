"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function CountrySpotlight() {
  const countries = [
    {
      name: "Pakistan",
      href: "/pakistan",
      description: "Quran study circles, Zakat distribution, youth tarbiyah, and vibrant community gatherings across Lahore, Islamabad, and Karachi.",
      cities: ["Lahore", "Islamabad", "Karachi"],
      gradient: "from-charcoal-600 via-charcoal-500 to-islamic-green/80",
      emoji: "🇵🇰",
    },
    {
      name: "Canada",
      href: "/canada",
      description: "Weekend Islamic school, youth mentoring, interfaith dialogue, and new Muslim support across Toronto, Vancouver, and Calgary.",
      cities: ["Toronto", "Vancouver", "Calgary"],
      gradient: "from-charcoal-600 via-charcoal-500 to-gold-dark",
      emoji: "🇨🇦",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {countries.map((country, i) => (
        <motion.div
          key={country.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
        >
          <Link href={country.href} className="group block">
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${country.gradient} p-8 md:p-10 min-h-[320px] flex flex-col justify-end islamic-pattern shadow-card group-hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1`}>
              {/* Large Emoji */}
              <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                {country.emoji}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                  {country.name}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-sm">
                  {country.description}
                </p>

                {/* Cities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {country.cities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90"
                    >
                      <MapPin size={10} />
                      {city}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-gold-light font-medium text-sm group-hover:gap-3 transition-all">
                  Explore Community
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
