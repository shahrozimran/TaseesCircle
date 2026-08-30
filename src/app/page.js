"use client";

import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import CountrySpotlight from "@/components/sections/CountrySpotlight";
import StatsBar from "@/components/ui/StatsBar";
import TestimonialSlider from "@/components/ui/TestimonialSlider";
import EventCard from "@/components/ui/EventCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { STATS } from "@/lib/constants";
import { testimonials } from "@/data/testimonials";
import { pakistanEvents } from "@/data/pakistan";
import { canadaEvents } from "@/data/canada";
import { motion } from "framer-motion";
import { BookOpen, Users, Heart, Star } from "lucide-react";

const featuredEvents = [
  ...pakistanEvents.slice(0, 2),
  ...canadaEvents.slice(0, 2),
];

const values = [
  {
    icon: BookOpen,
    title: "Knowledge",
    description: "Seeking and sharing authentic Islamic knowledge to illuminate hearts and minds.",
  },
  {
    icon: Users,
    title: "Unity",
    description: "Building bridges across borders, uniting the Ummah through shared purpose.",
  },
  {
    icon: Heart,
    title: "Service",
    description: "Serving humanity with compassion, following the Sunnah of our beloved Prophet ﷺ.",
  },
  {
    icon: Star,
    title: "Faith",
    description: "Nurturing strong Iman as the foundation of a meaningful life and thriving community.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        subtitle="Welcome to TaseesCircle"
        title="Uniting Hearts, Building Communities"
        description="An Islamic community engagement platform connecting Muslim communities in Pakistan and Canada through education, worship, and service."
        primaryCTA={{ label: "Explore Pakistan", href: "/pakistan" }}
        secondaryCTA={{ label: "Explore Canada", href: "/canada" }}
      />

      {/* Mission / Values */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Our Mission"
            title="Rooted in Faith, Driven by Purpose"
            description="TaseesCircle is built on the prophetic values of knowledge, unity, service, and unwavering faith. We bring these timeless principles to life in communities across two nations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-5 sm:p-6 rounded-2xl bg-beige-50 hover:bg-beige-100 transition-colors group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-gold/20 transition-colors">
                  <val.icon size={22} className="text-gold sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-bold text-charcoal-600 text-base sm:text-lg mb-2">
                  {val.title}
                </h3>
                <p className="text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Spotlight */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Our Communities"
            title="Two Nations, One Ummah"
            description="Explore our vibrant communities in Pakistan and Canada, each with unique programs and events tailored to local needs."
          />
          <CountrySpotlight />
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar stats={STATS} />

      {/* Upcoming Events */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionHeader
            label="Upcoming Events"
            title="Join Us at Our Next Gathering"
            description="From community iftars to educational seminars, there's always something happening at TaseesCircle."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredEvents.map((event, i) => (
              <EventCard key={i} {...event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-beige-100">
        <div className="section-container">
          <SectionHeader
            label="Community Voices"
            title="What Our Members Say"
            description="Hear from community members whose lives have been touched by TaseesCircle."
          />
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Quran Verse */}
      <section className="bg-charcoal-600 islamic-pattern py-14 sm:py-20">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-arabic text-white/90 leading-relaxed mb-3 sm:mb-4 px-2">
              &ldquo;And hold firmly to the rope of Allah all together and do not become divided.&rdquo;
            </p>
            <p className="text-gold text-xs sm:text-sm font-medium tracking-wide">
              — Surah Ali &apos;Imran (3:103)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeader
              label="Stay Connected"
              title="Join Our Newsletter"
              description="Receive weekly updates on events, programs, and inspiring Islamic content from TaseesCircle."
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
