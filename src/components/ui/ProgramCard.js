"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function ProgramCard({ title, description, schedule, icon, index = 0 }) {
  const IconComponent = Icons[icon] || Icons.BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card card-hover p-6 border border-beige-100"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
        <IconComponent size={22} className="text-gold" />
      </div>

      <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-3">
        {title}
      </h3>

      <p className="text-charcoal-300 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {schedule && (
        <div className="flex items-center gap-2 text-xs text-gold font-medium bg-gold/5 px-3 py-2 rounded-lg">
          <Icons.Clock size={13} />
          {schedule}
        </div>
      )}
    </motion.div>
  );
}
