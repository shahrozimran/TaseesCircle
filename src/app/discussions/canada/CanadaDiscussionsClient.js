"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import DiscussionCard from "@/components/ui/DiscussionCard";
import { canadaDiscussions } from "@/data/canada";
import { sanitizeSearchQuery } from "@/lib/security";
import { motion } from "framer-motion";
import { Filter, Search, BookOpen } from "lucide-react";

export default function CanadaDiscussionsClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Rizq & Halal Income",
    "Islamic Finance",
    "Family & Identity",
    "Muslim Life in Canada",
    "Identity & Community",
  ];

  const filteredDiscussions = canadaDiscussions.filter((disc) => {
    const matchesCategory =
      selectedCategory === "All" || disc.category === selectedCategory;
    const cleanSearch = sanitizeSearchQuery(searchQuery).toLowerCase();
    const matchesSearch =
      cleanSearch === "" ||
      disc.title.toLowerCase().includes(cleanSearch) ||
      disc.excerpt.toLowerCase().includes(cleanSearch) ||
      disc.tags.some((t) => t.toLowerCase().includes(cleanSearch));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="🇨🇦 Canada Community Hub"
        title="Halal Living & Guidance in Canada"
        description="Authentic Islamic guidance tailored for Muslims living in Canada — halal salary evaluation, riba-free home mortgages, halal investing, workplace rights, and raising Islamic families."
        primaryCTA={{ label: "View All Articles", href: "#articles" }}
        secondaryCTA={{ label: "Pakistan Hub", href: "/discussions/pakistan" }}
        height="min-h-[70vh] py-20 md:py-28"
      />

      {/* Main Articles Listing Section */}
      <section id="articles" className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Canada Knowledge Hub"
            title="Browse Knowledge Discussions"
            description="Click on any topic to read the full discussion containing verified Quranic verses and Hadith references."
          />

          {/* Search & Category Filter Bar */}
          <div className="mb-8 sm:mb-10 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" size={18} />
              <input
                type="text"
                maxLength={100}
                placeholder="Search topics, keywords (e.g. Mortgage, Investing, Identity)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-600 placeholder:text-charcoal-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <Filter size={14} className="text-gold shrink-0 mr-1 hidden sm:inline-block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gold text-white shadow-sm"
                      : "bg-beige-100 text-charcoal-400 hover:bg-beige-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredDiscussions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredDiscussions.map((disc, i) => (
                <DiscussionCard key={disc.slug} {...disc} community="canada" index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-beige-50 rounded-2xl border border-beige-200 max-w-md mx-auto">
              <BookOpen size={36} className="text-charcoal-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-charcoal-500 text-base mb-1">
                No Discussions Found
              </h3>
              <p className="text-charcoal-300 text-xs">
                Try adjusting your search query or selecting another category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
