"use client";

import { motion } from "framer-motion";

export default function Timeline({ milestones }) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-beige-300 md:-translate-x-px" />

      <div className="space-y-12">
        {milestones.map((milestone, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex items-start gap-8 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Dot */}
            <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-gold border-4 border-beige-50 -translate-x-1/2 z-10 shadow-md" />

            {/* Content */}
            <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold mb-2">
                {milestone.year}
              </span>
              <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-2">
                {milestone.title}
              </h3>
              <p className="text-charcoal-300 text-sm leading-relaxed">
                {milestone.description}
              </p>
            </div>

            {/* Spacer for alternating */}
            <div className="hidden md:block md:w-[calc(50%-2rem)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
