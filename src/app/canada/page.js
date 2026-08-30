"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgramCard from "@/components/ui/ProgramCard";
import EventCard from "@/components/ui/EventCard";
import ScholarCard from "@/components/ui/ScholarCard";
import DiscussionCard from "@/components/ui/DiscussionCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  canadaHero,
  canadaPrograms,
  canadaSessions,
  canadaScholars,
  canadaDiscussions,
  canadaNews,
} from "@/data/canada";
import { motion } from "framer-motion";
import { Newspaper, MessageSquare } from "lucide-react";

export default function CanadaPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle={canadaHero.subtitle}
        title={canadaHero.title}
        description={canadaHero.description}
        primaryCTA={{ label: "Browse Discussions", href: "#discussions" }}
        secondaryCTA={{ label: "Join Online Circle", href: "#programs" }}
        height="min-h-[75vh] py-20 md:py-28"
      />

      {/* Knowledge Discussions */}
      <section id="discussions" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Knowledge Discussions"
            title="Halal Life in Canada — Islamic Guidance"
            description="Practical Islamic discussions on halal income, riba-free mortgages, Muslim identity, and raising families in Canada — all backed by Quran and authentic Hadith."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaDiscussions.map((discussion, i) => (
              <DiscussionCard key={i} {...discussion} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Online Programs */}
      <section id="programs" className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Online Programs"
            title="Digital Circles for Canadian Muslims"
            description="From Islamic learning to halal finance guidance — join our digital programs serving Muslims across Canada."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canadaPrograms.map((program, i) => (
              <ProgramCard key={program.title} {...program} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Online Sessions */}
      <section id="sessions" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Upcoming Online Sessions"
            title="Live Webinars & Q&A Sessions"
            description="Join our upcoming live sessions on halal mortgages, Rizq e Halal in Canada, and more — accessible from anywhere in Canada."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {canadaSessions.map((session, i) => (
              <EventCard key={session.title} {...session} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Scholars */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Our Scholars"
            title="Community Leaders & Educators"
            description="Meet the dedicated scholars and professionals who guide our Canadian digital community with wisdom and authentic Islamic knowledge."
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
              &ldquo;And whoever fears Allah — He will make for him a way out and will provide for him from where he does not expect.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Surah At-Talaq (65:2-3)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Updates */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Latest Updates"
            title="Community News"
            description="Stay informed about the latest discussions, new online sessions, and achievements from our Canadian digital community."
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

      {/* Join Discussion CTA */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gold" />
            </div>
            <SectionHeader
              label="Join the Discussion"
              title="Canada Community Online"
              description="Have a question about halal income in Canada, Islamic finance, or Muslim life in the West? Join our online circles and get guidance from qualified scholars."
            />
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
            >
              <MessageSquare size={16} />
              Join Discussion Circle
            </a>
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
              description="Subscribe to receive new discussions, online session announcements, and Islamic guidance tailored for Canadian Muslims."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
