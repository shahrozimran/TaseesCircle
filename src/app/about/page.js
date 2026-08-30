"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import TeamCard from "@/components/ui/TeamCard";
import Timeline from "@/components/sections/Timeline";
import { leadershipTeam, coreValues, milestones } from "@/data/team";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="About TaseesCircle"
        title="Our Story of Faith & Service"
        description="Founded in 2015, TaseesCircle grew from a small online study circle of 20 families in Pakistan into a cross-continental digital community serving thousands of Muslims in Pakistan and Canada."
        height="min-h-[70vh] py-20 md:py-28"
      />

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              label="Our Beginning"
              title="From a Small Circle to a Global Community"
            />
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-6 text-charcoal-400 leading-relaxed text-sm sm:text-base"
              >
                <p>
                  TaseesCircle began in 2015 as a humble digital gathering of 20 families in Pakistan, united by a shared desire to deepen their connection with the Quran and each other. What started as a weekly online study circle quickly grew into something much larger — a movement of hearts seeking knowledge, community, and purpose across borders.
                </p>
                <p>
                  Our founder, Dr. Muhammad Tariq, envisioned a digital community that would transcend geographic boundaries. By 2019, TaseesCircle had expanded its online platform to serve Muslims across Pakistan and established its Canadian digital community, bringing the warmth and spirit of Islamic brotherhood to Muslim families navigating life in a new land.
                </p>
                <p>
                  Today, TaseesCircle serves over 5,000 members across Pakistan and Canada through our digital platform. We run 15+ active online programs — from Quran academies and youth mentorship circles to Islamic finance guidance and community knowledge blogs. Our mission remains the same as day one: to unite hearts and build thriving Muslim communities rooted in authentic Islamic values.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="What We Stand For"
            title="Our Core Values"
            description="These four pillars guide everything we do at TaseesCircle."
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
                  className="bg-white rounded-2xl shadow-card card-hover p-6 sm:p-8 text-center border border-beige-100"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <IconComponent size={24} className="text-gold sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">Our Vision</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4">
                A United Ummah, Empowered by Knowledge
              </h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed">
                We envision a world where every Muslim has access to authentic Islamic knowledge, meaningful community connections, and the support they need to live a life of purpose and faith — regardless of where they call home.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">Our Mission</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4">
                Engage, Educate, Empower
              </h3>
              <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed">
                TaseesCircle engages Muslim communities through meaningful programs, educates through authentic Islamic scholarship, and empowers individuals to become leaders of positive change in their families and societies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Leadership"
            title="Meet Our Team"
            description="Dedicated individuals who guide TaseesCircle's mission with wisdom, passion, and servant leadership."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {leadershipTeam.map((member, i) => (
              <TeamCard key={member.name} {...member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Our Journey"
            title="Milestones Along the Way"
            description="From a small circle in Lahore to a thriving cross-continental community."
          />
          <Timeline milestones={milestones} />
        </div>
      </section>
    </>
  );
}
