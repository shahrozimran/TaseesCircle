"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  overlay = true,
  height = "h-screen",
  align = "center",
}) {
  return (
    <section
      className={`relative ${height} flex items-center overflow-hidden`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : {}
      }
    >
      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-600/80 via-charcoal-600/60 to-charcoal-600/80" />
      )}

      {/* Fallback Background (when no image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-charcoal-600" />
      )}

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className={`section-container relative z-10 ${align === "center" ? "text-center" : "text-left"}`}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`max-w-4xl ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gold-light text-sm sm:text-base uppercase tracking-[0.2em] font-medium mb-4"
            >
              {subtitle}
            </motion.p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
            {title}
          </h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          {(primaryCTA || secondaryCTA) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`flex flex-wrap gap-4 ${align === "center" ? "justify-center" : ""}`}
            >
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-xl hover:scale-[1.03] transition-all text-sm sm:text-base"
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all text-sm sm:text-base"
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {height === "h-screen" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
