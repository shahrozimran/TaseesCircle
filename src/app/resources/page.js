"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ResourceCard from "@/components/ui/ResourceCard";
import { resourceCategories } from "@/data/resources";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCategories =
    activeCategory === "all"
      ? resourceCategories
      : resourceCategories.filter((c) => c.id === activeCategory);

  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Resources & Learning"
        title="Grow in Knowledge & Faith"
        description="Access our curated collection of Islamic learning materials, from Quran study guides and hadith collections to articles and recommended reading."
        height="h-[70vh]"
      />

      {/* Filter Tabs */}
      <section className="bg-white border-b border-beige-200 sticky top-0 z-30">
        <div className="section-container">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-gold text-white"
                  : "bg-beige-100 text-charcoal-400 hover:bg-beige-200"
              }`}
            >
              All Resources
            </button>
            {resourceCategories.map((cat) => {
              const IconComp = Icons[cat.icon] || Icons.FileText;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-gold text-white"
                      : "bg-beige-100 text-charcoal-400 hover:bg-beige-200"
                  }`}
                >
                  <IconComp size={14} />
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      {filteredCategories.map((category, catIndex) => {
        const IconComp = Icons[category.icon] || Icons.FileText;
        return (
          <section
            key={category.id}
            className={`section-padding ${catIndex % 2 === 0 ? "bg-white" : "bg-beige-50"}`}
          >
            <div className="section-container">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <IconComp size={22} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-charcoal-600 text-2xl">
                    {category.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.resources.map((resource, i) => (
                  <ResourceCard
                    key={resource.title}
                    {...resource}
                    icon={category.icon}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Daily Hadith */}
      <section className="bg-charcoal-600 islamic-pattern py-20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Daily Hadith</span>
            <p className="text-xl md:text-2xl font-arabic text-white/90 leading-relaxed mt-4 mb-4">
              &ldquo;The best among you are those who learn the Quran and teach it.&rdquo;
            </p>
            <p className="text-gold text-sm font-medium tracking-wide">
              — Prophet Muhammad ﷺ (Sahih Al-Bukhari)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Suggest Resource CTA */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="Contribute"
              title="Suggest a Resource"
              description="Have an Islamic book, article, or learning material you'd like to see featured? Let us know through our contact form."
            />
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
            >
              <Icons.Send size={16} />
              Suggest a Resource
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
