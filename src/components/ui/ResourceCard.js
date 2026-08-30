"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function ResourceCard({ title, description, type, author, icon, index = 0 }) {
  const IconComponent = Icons[icon] || Icons.FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white rounded-2xl shadow-card card-hover p-6 border border-beige-100 flex flex-col"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
          <IconComponent size={18} className="text-charcoal-400 group-hover:text-gold transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-charcoal-600 text-base leading-snug mb-1">
            {title}
          </h3>
          {author && (
            <p className="text-xs text-gold font-medium">by {author}</p>
          )}
        </div>
      </div>

      <p className="text-charcoal-300 text-sm leading-relaxed flex-1 mb-4">
        {description}
      </p>

      <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-charcoal-400">
        {type}
      </span>
    </motion.div>
  );
}
