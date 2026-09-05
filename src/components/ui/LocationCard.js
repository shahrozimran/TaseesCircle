"use client";
import T from "@/components/i18n/T";


import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function LocationCard({ city, address, phone, email, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="bg-white rounded-2xl shadow-card card-hover p-6 border border-beige-100"
    >
      <h3 className="font-heading font-bold text-charcoal-600 text-xl mb-4"><T>{city}</T></h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-gold mt-1 shrink-0" />
          <p className="text-charcoal-400 text-sm"><T>{address}</T></p>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-gold shrink-0" />
          <a href={`tel:${phone}`} className="text-charcoal-400 text-sm hover:text-gold transition-colors">
            <T>{phone}</T>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-gold shrink-0" />
          <a href={`mailto:${email}`} className="text-charcoal-400 text-sm hover:text-gold transition-colors">
            <T>{email}</T>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
