"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function TeamCard({ name, role, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card card-hover overflow-hidden border border-beige-100"
    >
      {/* Photo Area */}
      <div className="h-48 bg-gradient-to-br from-beige-200 to-beige-300 flex items-center justify-center relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center">
          <User size={40} className="text-charcoal-300" />
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-charcoal-600/0 group-hover:bg-charcoal-600/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="font-heading font-bold text-charcoal-600 text-lg mb-1">{name}</h3>
        <p className="text-gold text-sm font-medium mb-3">{role}</p>
        <p className="text-charcoal-300 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
