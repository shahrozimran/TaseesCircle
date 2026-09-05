"use client";
import T from "@/components/i18n/T";


import { motion } from "framer-motion";

export default function SectionHeader({ label, title, description, align = "center", light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-start"}`}
    >
      {label && (
        <span className="inline-block text-gold text-sm uppercase tracking-[0.2em] font-medium mb-3">
          <T>{label}</T>
        </span>
      )}
      <h2 className={`font-heading font-bold ${light ? "text-white" : "text-charcoal-600"} mb-4`}>
        <T>{title}</T>
      </h2>

      {/* Decorative Divider */}
      <div className={`flex items-center gap-3 my-5 ${align === "center" ? "justify-center" : ""}`}>
        <div className={`h-px w-12 ${light ? "bg-white/30" : "bg-beige-400"}`} />
        <div className="w-2 h-2 rotate-45 border border-gold bg-gold/20" />
        <div className={`h-px w-12 ${light ? "bg-white/30" : "bg-beige-400"}`} />
      </div>

      {description && (
        <p className={`text-lg max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : ""} ${light ? "text-white/70" : "text-charcoal-300"}`}>
          <T>{description}</T>
        </p>
      )}
    </motion.div>
  );
}
