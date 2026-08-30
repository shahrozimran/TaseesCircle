"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

export default function EventCard({ title, date, location, description, type, index = 0 }) {
  const typeColors = {
    Celebration: "bg-gold/10 text-gold",
    Workshop: "bg-islamic-green/10 text-islamic-green",
    "Community Service": "bg-beige-400/20 text-beige-600",
    Competition: "bg-charcoal-400/10 text-charcoal-400",
    Fundraiser: "bg-gold/10 text-gold",
    Education: "bg-islamic-green/10 text-islamic-green",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-card card-hover p-6 border border-beige-100 flex flex-col"
    >
      {/* Type Badge */}
      <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-medium mb-4 ${typeColors[type] || "bg-beige-200 text-charcoal-400"}`}>
        {type}
      </span>

      <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-3 leading-snug">
        {title}
      </h3>

      <p className="text-charcoal-300 text-sm leading-relaxed mb-4 flex-1">
        {description}
      </p>

      <div className="space-y-2 pt-4 border-t border-beige-100">
        <div className="flex items-center gap-2 text-sm text-charcoal-400">
          <Calendar size={14} className="text-gold shrink-0" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal-400">
          <MapPin size={14} className="text-gold shrink-0" />
          {location}
        </div>
      </div>
    </motion.div>
  );
}
