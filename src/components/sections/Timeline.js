"use client";
import T from "@/components/i18n/T";


import { motion } from "framer-motion";

export default function Timeline({ milestones }) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute start-4 sm:start-6 md:start-1/2 top-0 bottom-0 w-0.5 bg-beige-300 md:-translate-x-px rtl:md:translate-x-px" />

      <div className="space-y-8 sm:space-y-12">
        {milestones.map((milestone, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex items-start gap-4 sm:gap-8 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Dot */}
            <div className="absolute start-4 sm:start-6 md:left-1/2 w-4 h-4 rounded-full bg-gold border-4 border-beige-50 -translate-x-1/2 rtl:translate-x-1/2 z-10 shadow-md top-1" />

            {/* Content */}
            <div className={`ms-9 sm:ms-16 md:ms-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-end md:pe-8" : "md:text-start md:ps-8"}`}>
              <span className="inline-block px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-gold/10 text-gold mb-2">
                <T>{milestone.year}</T>
              </span>
              <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2">
                <T>{milestone.title}</T>
              </h3>
              <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                <T>{milestone.description}</T>
              </p>
            </div>

            {/* Spacer for alternating desktop */}
            <div className="hidden md:block md:w-[calc(50%-2rem)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
