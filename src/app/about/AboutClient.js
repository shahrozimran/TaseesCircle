"use client";
import T from "@/components/i18n/T";


import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import Timeline from "@/components/sections/Timeline";
import { founderInfo, communityPillars, coreValues, milestones } from "@/data/team";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";

export default function AboutClient() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="About Ta'sees Circle"
        title="Our Mission & Founder"
        description="Founded in August 2026 by Muhammad Maqbool Ahmed Khan, Ta'sees Circle is an authentic digital platform dedicated to introducing a practical Islamic model for living — guided strictly by Quran and Sunnah."
        primaryCTA={{ label: "Explore Discussions", href: "/discussions" }}
        secondaryCTA={{ label: "Get Involved", href: "/contact" }}
        height="min-h-[70vh] py-20 md:py-28"
      />

      {/* Our Story / Founder Origin */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              label="Our Origin & Purpose"
              title="A Sole Purpose: Reviving Practical Islamic Living"
              description="Built to help Muslim families navigate modern economic, workplace, and cultural challenges with uncompromised faith."
            />
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-6 text-charcoal-400 leading-relaxed text-sm sm:text-base"
              >
                <p><T message="In {date}, {founder} founded {site} to address a pressing reality facing Muslims today: the growing gap between everyday life and authentic Islamic principles. In an era dominated by interest-based economics, workplace compromises, and cultural confusion, Muslims in Pakistan, Canada, and around the globe need clear, actionable guidance on how to live strictly according to Islam." values={{ date: <strong><T>August 2026</T></strong>, founder: <strong><T>Muhammad Maqbool Ahmed Khan</T></strong>, site: <strong><T>Ta&apos;sees Circle</T></strong> }} /></p>
                <p><T message="Ta'sees Circle was established as an independent digital mission — led with personal commitment without corporate agendas or commercial motives. The platform serves as a beacon of authentic knowledge, offering detailed discussions on earning {rizq}, obtaining riba-free mortgages, maintaining Islamic workplace ethics, and raising children with strong Islamic identity." values={{ rizq: <em><T>Rizq e Halal</T></em> }} /></p>
                <p><T>
                  Every piece of content, discussion paper, and guide published on Ta'sees Circle is grounded in verified Quranic verses and authentic Hadith narrations. This is not just a website; it is an invitation for every Muslim to embrace Islam fully in their daily life, business, and family.
                </T></p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & CEO Spotlight Card */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Leadership & Vision"
            title="Meet the Founder"
            description="The driving force behind Ta'sees Circle's mission to connect the Ummah through authentic knowledge."
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-card border border-beige-100 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8"
          >
            {/* Avatar / Icon Badge */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-gold flex items-center justify-center text-white shrink-0 shadow-lg border-4 border-white">
              <span className="font-heading font-bold text-3xl sm:text-4xl"><T>MK</T></span>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-start">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-heading font-bold text-charcoal-600 text-2xl sm:text-3xl">
                    <T>{founderInfo.name}</T>
                  </h3>
                  <p className="text-gold font-semibold text-sm sm:text-base">
                    <T>{founderInfo.role}</T> • <span className="text-charcoal-300 font-normal"><T>Founded {founderInfo.foundedDate}</T></span>
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-islamic-green/10 text-islamic-green border border-islamic-green/20 self-center sm:self-auto"><T>
                  Sole Founder & Leader
                </T></span>
              </div>

              <p className="text-charcoal-400 text-xs sm:text-sm leading-relaxed mb-5">
                <T>{founderInfo.bio}</T>
              </p>

              {/* Founder Quote */}
              <div className="p-4 sm:p-5 rounded-2xl bg-beige-50 border border-beige-200 text-charcoal-500 text-xs sm:text-sm italic leading-relaxed border-s-4 border-s-gold">
                &ldquo;<T>{founderInfo.quote}</T>&rdquo;
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Guiding Principles"
            title="Our Core Values"
            description="The four pillars that define our content, discussions, and community engagement."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {coreValues.map((value, i) => {
              const IconComponent = Icons[value.icon] || Icons.Star;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-beige-50 rounded-2xl shadow-card card-hover p-6 sm:p-8 text-center border border-beige-100"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <IconComponent size={24} className="text-gold sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl mb-2 sm:mb-3">
                    <T>{value.title}</T>
                  </h3>
                  <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                    <T>{value.description}</T>
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Call to Action — Be Part of the Mission */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Community Participation"
            title="Be Part of the Community & Support the Mission"
            description="There are no corporate boundaries here — Ta'sees Circle belongs to every Muslim seeking to live according to Islam."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {communityPillars.map((pillar, i) => {
              const IconComponent = Icons[pillar.icon] || Icons.Heart;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 sm:p-7 shadow-card card-hover border border-beige-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                      <IconComponent size={22} className="text-gold" />
                    </div>
                    <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2">
                      <T>{pillar.title}</T>
                    </h3>
                    <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed mb-4">
                      <T>{pillar.description}</T>
                    </p>
                  </div>

                  <Link
                    href="/discussions"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-dark transition-colors mt-auto pt-2"
                  >
                    <span><T>Get Involved</T></span>
                    <Icons.ArrowRight size={13} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission Banner */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-start"
            >
              <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"><T>Our Vision</T></span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4"><T>
                A United Ummah Living True Islam
              </T></h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed"><T>
                We envision a global Muslim community that holds firmly to the Quran and Sunnah, where every household thrives on halal income, strong spiritual bonds, and unwavering faith.
              </T></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-start"
            >
              <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"><T>Our Mission</T></span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4"><T>
                Educate, Connect, Support
              </T></h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed"><T>
                Ta'sees Circle provides authenticated knowledge discussions, practical fiqh solutions for daily life, and an open digital platform where Muslims in Pakistan, Canada, and beyond can learn and grow together.
              </T></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Our Journey"
            title="Milestones Since Launch"
            description="Established in August 2026 with a commitment to pure Islamic guidance."
          />
          <Timeline milestones={milestones} />
        </div>
      </section>
    </>
  );
}
