"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgramCard from "@/components/ui/ProgramCard";
import EventCard from "@/components/ui/EventCard";
import ScholarCard from "@/components/ui/ScholarCard";
import LocationCard from "@/components/ui/LocationCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  pakistanHero,
  pakistanOffices,
  pakistanPrograms,
  pakistanEvents,
  pakistanScholars,
  pakistanNews,
} from "@/data/pakistan";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export default function PakistanPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle={pakistanHero.subtitle}
        title={pakistanHero.title}
        description={pakistanHero.description}
        primaryCTA={{ label: "View Programs", href: "#programs" }}
        secondaryCTA={{ label: "Upcoming Events", href: "#events" }}
        height="min-h-[75vh] py-20 md:py-28"
      />

      {/* Programs */}
      <section id="programs" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Our Programs"
            title="Programs in Pakistan"
            description="From Quran study circles to youth development, explore our community programs serving Muslims across Pakistan."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanPrograms.map((program, i) => (
              <ProgramCard key={program.title} {...program} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Upcoming Events"
            title="Events in Pakistan"
            description="Join us at our upcoming gatherings, workshops, and celebrations across Pakistan."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {pakistanEvents.map((event, i) => (
              <EventCard key={event.title} {...event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Scholars */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Our Scholars"
            title="Guiding Lights of Knowledge"
            description="Meet the scholars who guide our community with wisdom and authentic Islamic scholarship."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanScholars.map((scholar, i) => (
              <ScholarCard key={scholar.name} {...scholar} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Quran Verse */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl font-arabic text-white/90 leading-relaxed mb-3 sm:mb-4">
              &ldquo;Indeed, Allah is with those who fear Him and those who are doers of good.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Surah An-Nahl (16:128)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community News */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Latest Updates"
            title="Community News"
            description="Stay informed about the latest developments and achievements from our Pakistan chapters."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanNews.map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-card card-hover p-5 sm:p-6 border border-beige-100"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Newspaper size={18} className="text-gold" />
                </div>
                <p className="text-xs text-gold font-medium mb-1.5">{news.date}</p>
                <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2 sm:mb-3 leading-snug">
                  {news.title}
                </h3>
                <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                  {news.excerpt}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Find Us"
            title="Our Pakistan Offices"
            description="Visit any of our community centers across Pakistan."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanOffices.map((office, i) => (
              <LocationCard key={office.city} {...office} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-beige-100">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="Stay Connected"
              title="Pakistan Community Updates"
              description="Subscribe to receive weekly updates from our Pakistan chapters."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
