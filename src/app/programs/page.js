"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import StatsBar from "@/components/ui/StatsBar";
import { programCategories, impactStats } from "@/data/programs";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Programs & Services"
        title="Engage, Educate, Empower"
        description="Discover our comprehensive range of online Islamic education, community development, and knowledge-sharing programs — designed for every member of the Ummah, accessible from anywhere."
        primaryCTA={{ label: "Get Involved", href: "/contact" }}
        height="min-h-[70vh] py-20 md:py-28"
      />

      {/* Impact Stats */}
      <StatsBar stats={impactStats} />

      {/* Program Categories */}
      {programCategories.map((category, catIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`section-padding ${catIndex % 2 === 0 ? "bg-white" : "bg-beige-50"}`}
        >
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-32"
              >
                {(() => {
                  const IconComp = Icons[category.icon] || Icons.BookOpen;
                  return (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 sm:mb-5">
                      <IconComp size={24} className="text-gold sm:w-7 sm:h-7" />
                    </div>
                  );
                })()}
                <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3">
                  {category.title}
                </h2>
                <p className="text-charcoal-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                  {category.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-gold font-medium text-sm hover:gap-3 transition-all"
                >
                  Join This Program
                  <Icons.ArrowRight size={16} />
                </Link>
              </motion.div>

              {/* Programs Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {category.programs.map((program, i) => (
                  <motion.div
                    key={program.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-card card-hover p-5 sm:p-6 border border-beige-100"
                  >
                    <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2 sm:mb-3">
                      {program.title}
                    </h3>
                    <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                      {program.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Digital Volunteer CTA */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">Make a Difference</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4">
              Volunteer Online
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Join hundreds of digital volunteers who dedicate their time and skills to serve the Ummah online. Whether you can moderate a discussion, translate content, or lead an online circle — there&apos;s a place for you at Ta'sees Circle.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-xl hover:scale-[1.03] transition-all text-sm sm:text-base"
            >
              <Icons.Heart size={18} />
              Become a Digital Volunteer
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
