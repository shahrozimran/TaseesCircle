"use client";
import T from "@/components/i18n/T";


import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import DiscussionCard from "@/components/ui/DiscussionCard";
import { pakistanDiscussions } from "@/data/pakistan";
import { canadaDiscussions } from "@/data/canada";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Hash } from "lucide-react";

export default function DiscussionsLandingClient() {
  const allFeatured = [
    pakistanDiscussions[0],
    pakistanDiscussions[2],
    canadaDiscussions[0],
    canadaDiscussions[1],
  ];

  const communities = [
    {
      name: "Pakistan Community",
      href: "/discussions/pakistan",
      badge: "🇵🇰 Pakistan Hub",
      title: "Rizq e Halal & Societal Guidance",
      description:
        "Knowledge discussions addressing economic and societal challenges in Pakistan — earning halal income, business ethics, avoiding riba, freelancing, and Zakat. Grounded in Quran and authentic Hadith.",
      count: "6 Active Discussions",
      topics: ["Rizq e Halal", "Workplace Fiqh", "Avoiding Riba", "Business Zakat"],
      gradient: "from-charcoal-600 via-charcoal-500 to-islamic-green/80",
      cta: "Explore Pakistan Discussions",
    },
    {
      name: "Canada Community",
      href: "/discussions/canada",
      badge: "🇨🇦 Canada Hub",
      title: "Muslim Life & Guidance in Canada",
      description:
        "Practical Islamic discussions tailored for Canadian Muslims — halal salary evaluation, riba-free home mortgages, halal stock investing, workplace rights, and raising Islamic families in the West.",
      count: "6 Active Discussions",
      topics: ["Halal Mortgages", "Muslim Identity", "Canadian Workplace", "Halal Investing"],
      gradient: "from-charcoal-600 via-charcoal-500 to-gold-dark",
      cta: "Explore Canada Discussions",
    },
  ];

  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Islamic Knowledge & Community Discussions"
        title="Knowledge Grounded in Quran & Sunnah"
        description="Select a community hub below to explore in-depth knowledge discussions, authentic Quranic insights, and scholarly guidance tailored to your region."
        primaryCTA={{ label: "Pakistan Discussions", href: "/discussions/pakistan" }}
        secondaryCTA={{ label: "Canada Discussions", href: "/discussions/canada" }}
        height="min-h-[70vh] py-20 md:py-28"
      />

      {/* Select Community Hub Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Choose Your Region"
            title="Select a Discussion Hub"
            description="Our discussions provide practical Islamic solutions grounded in Quran & Hadith, tailored specifically for Muslims living in Pakistan and Canada."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {communities.map((comm, i) => (
              <motion.div
                key={comm.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link href={comm.href} className="group block h-full">
                  <div
                    className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${comm.gradient} p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between islamic-pattern shadow-card group-hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1.5 border border-white/10`}
                  >
                    <div>
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20">
                          <T>{comm.badge}</T>
                        </span>
                        <span className="text-gold-light text-xs font-medium bg-gold/10 px-3 py-1 rounded-full">
                          <T>{comm.count}</T>
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3 group-hover:text-gold-light transition-colors">
                        <T>{comm.title}</T>
                      </h3>

                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
                        <T>{comm.description}</T>
                      </p>

                      {/* Topic Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {comm.topics.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-white/90 border border-white/10"
                          >
                            <Hash size={10} className="text-gold-light" />
                            <T>{t}</T>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-gold-light font-semibold text-sm group-hover:text-white transition-colors">
                      <span><T>{comm.cta}</T></span>
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold transition-colors">
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Discussions Grid */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Featured Topics"
            title="Latest Knowledge Discussions"
            description="Explore popular topics with authentic Quranic verses and Hadith references."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {allFeatured.map((disc, i) => (
              <DiscussionCard key={disc.slug} {...disc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Islamic Knowledge Banner */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={22} className="text-gold" />
            </div>
            <p dir="rtl" lang="ar" translate="no" className="text-xl sm:text-2xl md:text-3xl font-arabic text-white/95 leading-loose mb-3">
              &ldquo;وَقُل رَّبِّ زِدْنِي عِلْمًا&rdquo;
            </p>
            <p className="text-white/80 text-sm sm:text-base italic mb-2"><T>
              &ldquo;And say: My Lord, increase me in knowledge.&rdquo;
            </T></p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide"><T>
              — Surah Taha (20:114)
            </T></p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
