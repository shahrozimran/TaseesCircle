"use client";
import T from "@/components/i18n/T";


import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import DiscussionCard from "@/components/ui/DiscussionCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  canadaHero,
  canadaDiscussions,
  canadaNews,
} from "@/data/canada";
import { motion } from "framer-motion";
import { Newspaper, MessageSquare, HeartHandshake, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CanadaClient() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle={canadaHero.subtitle}
        title={canadaHero.title}
        description={canadaHero.description}
        primaryCTA={{ label: "Browse Discussions", href: "#discussions" }}
        secondaryCTA={{ label: "Pakistan Hub", href: "/discussions/pakistan" }}
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
              <DiscussionCard key={discussion.slug || i} {...discussion} community="canada" index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Sadaqah-e-Jariyah Callout Banner */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-charcoal-600 via-charcoal-500 to-gold-dark text-white rounded-3xl p-6 sm:p-10 shadow-xl islamic-pattern border border-white/10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-start">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold-light border border-gold/30">
                  <Sparkles size={14} />
                  <span><T>Sadaqah-e-Jariyah (Ongoing Charity)</T></span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white leading-tight"><T>
                  Be Part of the Community & Earn Continuous Rewards
                </T></h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl"><T>
                  Whether you want to suggest a topic, share authenticated Islamic knowledge, or help spread beneficial guidance in Canada — being part of this community is an ongoing charity that continues to benefit the Ummah.
                </T></p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-xs sm:text-sm shrink-0"
              >
                <HeartHandshake size={18} /><T>
                Get Involved / Contact Us
              </T></Link>
            </div>
          </motion.div>
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
            <p className="text-lg sm:text-xl md:text-2xl font-arabic text-white/90 leading-relaxed mb-3 sm:mb-4"><T>
              &ldquo;And whoever fears Allah — He will make for him a way out and will provide for him from where he does not expect.&rdquo;
            </T></p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide"><T>
              — Surah At-Talaq (65:2-3)
            </T></p>
          </motion.div>
        </div>
      </section>

      {/* Community Updates */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Latest Updates"
            title="Community News"
            description="Stay informed about the latest discussions and achievements from our Canadian digital community."
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
                <p className="text-xs text-gold font-medium mb-1.5"><T>{news.date}</T></p>
                <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2 sm:mb-3 leading-snug">
                  <T>{news.title}</T>
                </h3>
                <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                  <T>{news.excerpt}</T>
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
              description="Have a question about halal income in Canada, Islamic finance, or Muslim life in the West? Reach out to us through our contact page."
            />
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
            >
              <MessageSquare size={16} /><T>
              Contact Us
            </T></Link>
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
              description="Subscribe to receive new discussions and Islamic guidance tailored for Canadian Muslims."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
