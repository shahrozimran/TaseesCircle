"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgramCard from "@/components/ui/ProgramCard";
import EventCard from "@/components/ui/EventCard";
import ScholarCard from "@/components/ui/ScholarCard";
import LocationCard from "@/components/ui/LocationCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  canadaHero,
  canadaOffices,
  canadaPrograms,
  canadaEvents,
  canadaScholars,
  canadaNews,
} from "@/data/canada";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export default function CanadaPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle={canadaHero.subtitle}
        title={canadaHero.title}
        description={canadaHero.description}
        primaryCTA={{ label: "View Programs", href: "#programs" }}
        secondaryCTA={{ label: "Upcoming Events", href: "#events" }}
        height="min-h-[75vh] py-20 md:py-28"
      />

      {/* Programs */}
      <section id="programs" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Our Programs"
            title="Programs in Canada"
            description="From weekend Islamic schools to interfaith dialogue, explore our programs serving Canadian Muslim communities."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaPrograms.map((program, i) => (
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
            title="Events in Canada"
            description="Join us at our upcoming community gatherings, workshops, and events across Canada."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {canadaEvents.map((event, i) => (
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
            title="Community Leaders & Educators"
            description="Meet the dedicated scholars and professionals who guide our Canadian community."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaScholars.map((scholar, i) => (
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
              &ldquo;Whoever emigrates in the way of Allah will find on the earth many alternative locations and abundance.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Surah An-Nisa (4:100)
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
            description="Stay informed about the latest developments and achievements from our Canadian chapters."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaNews.map((news, i) => (
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
            title="Our Canadian Offices"
            description="Visit any of our community centers across Canada."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaOffices.map((office, i) => (
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
              title="Canada Community Updates"
              description="Subscribe to receive weekly updates from our Canadian chapters."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
