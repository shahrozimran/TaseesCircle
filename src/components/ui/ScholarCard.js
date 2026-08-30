"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function ScholarCard({ name, title, expertise, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-white rounded-2xl shadow-card card-hover p-6 border border-beige-100 text-center"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
        <User size={32} className="text-white" />
      </div>

      <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-1">
        {name}
      </h3>
      <p className="text-gold text-sm font-medium mb-3">{title}</p>

      <p className="text-charcoal-300 text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className="pt-4 border-t border-beige-100">
        <p className="text-xs text-charcoal-200 font-medium uppercase tracking-wide mb-1">Expertise</p>
        <p className="text-sm text-charcoal-400">{expertise}</p>
      </div>
    </motion.div>
  );
}
