"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgramCard from "@/components/ui/ProgramCard";
import EventCard from "@/components/ui/EventCard";
import ScholarCard from "@/components/ui/ScholarCard";
import DiscussionCard from "@/components/ui/DiscussionCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  pakistanHero,
  pakistanPrograms,
  pakistanSessions,
  pakistanScholars,
  pakistanDiscussions,
  pakistanNews,
} from "@/data/pakistan";
import { motion } from "framer-motion";
import { Newspaper, MessageSquare } from "lucide-react";

export default function PakistanPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle={pakistanHero.subtitle}
        title={pakistanHero.title}
        description={pakistanHero.description}
        primaryCTA={{ label: "Browse Discussions", href: "#discussions" }}
        secondaryCTA={{ label: "Online Programs", href: "#programs" }}
        height="min-h-[75vh] py-20 md:py-28"
      />

      {/* Knowledge Discussions */}
      <section id="discussions" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Knowledge Discussions"
            title="Rizq e Halal & Societal Issues"
            description="Deep Islamic discussions on earning halal livelihood in Pakistan, avoiding riba, business ethics, and building a life of barakah — all grounded in Quran and authentic Hadith."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanDiscussions.map((discussion, i) => (
              <DiscussionCard key={discussion.slug || i} {...discussion} community="pakistan" index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Online Programs */}
      <section id="programs" className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Online Programs"
            title="Digital Learning Circles"
            description="From online Quran tafseer circles to Rizq e Halal Q&A sessions — join our digital programs for Muslims across Pakistan."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pakistanPrograms.map((program, i) => (
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
            description="Join our upcoming live sessions on Rizq e Halal, Islamic finance, and more — accessible from anywhere in Pakistan."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {pakistanSessions.map((session, i) => (
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
            title="Guiding Lights of Knowledge"
            description="Meet the scholars who guide our online community with wisdom, authentic Islamic scholarship, and Quran & Hadith references."
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
              &ldquo;And eat of what Allah has provided for you, lawful and good. And fear Allah, in Whom you are believers.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Surah Al-Ma&apos;idah (5:88)
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
            description="Stay informed about the latest developments and new discussions from our Pakistan digital community."
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

      {/* Join Discussion CTA */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gold" />
            </div>
            <SectionHeader
              label="Join the Discussion"
              title="Pakistan Community Online"
              description="Have a question about Rizq e Halal, Islamic business, or any societal issue? Join our online discussion circles and get guidance from qualified scholars."
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
              title="Pakistan Community Updates"
              description="Subscribe to receive new discussions, online session announcements, and Islamic knowledge from our Pakistan community."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
