"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import ResourceCard from "@/components/ui/ResourceCard";
import { resourceCategories } from "@/data/resources";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function ResourcesClient() {
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
        height="min-h-[60vh] py-20 md:py-28"
      />

      {/* Category Filter + Content */}
      <section className="section-padding bg-white">
        <div className="section-container">
          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10 sm:mb-12">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gold text-white shadow-md"
                  : "bg-beige-100 text-charcoal-400 hover:bg-beige-200"
              }`}
            >
              All Resources
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-gold text-white shadow-md"
                    : "bg-beige-100 text-charcoal-400 hover:bg-beige-200"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Resource Groups */}
          <div className="space-y-12 sm:space-y-16">
            {filteredCategories.map((category) => {
              const CategoryIcon = Icons[category.icon] || Icons.BookOpen;
              return (
                <div key={category.id}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-beige-200">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <CategoryIcon size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl">
                        {category.title}
                      </h2>
                      <p className="text-charcoal-300 text-xs sm:text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Resource Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {(category.resources || category.items || []).map((item, i) => (
                      <ResourceCard key={item.title} {...item} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-serif text-white/90 leading-relaxed mb-3 sm:mb-4 italic">
              &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Sunan Ibn Majah (Hadith 224)
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
