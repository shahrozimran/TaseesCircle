"use client";

import { useState } from "react";
import Hero from "@/components/sections/Hero";
import SectionHeader from "@/components/ui/SectionHeader";
import LocationCard from "@/components/ui/LocationCard";
import FAQ from "@/components/ui/FAQ";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/constants";

const allOffices = [
  {
    city: "Lahore, Pakistan",
    address: "42-B, Gulberg III, Main Boulevard, Lahore, Punjab",
    phone: "+92 42 3571 0000",
    email: "lahore@taseescircle.org",
  },
  {
    city: "Toronto, Canada",
    address: "2150 Islington Avenue, Suite 200, Toronto, ON M9P 3V4",
    phone: "+1 (416) 555-0100",
    email: "toronto@taseescircle.org",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", country: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <>
      <Hero
        subtitle="Get in Touch"
        title="Contact Us"
        description="We'd love to hear from you. Whether you have a question, want to volunteer, or just want to say Assalamu Alaikum — reach out!"
        height="min-h-[60vh] py-20 md:py-28"
      />

      {/* Contact Form + Info */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <SectionHeader
                label="Send a Message"
                title="We're Here to Help"
                align="left"
              />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-islamic-green/5 border border-islamic-green/20 rounded-2xl p-6 sm:p-8 text-center"
                >
                  <CheckCircle size={44} className="text-islamic-green mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-charcoal-600 text-lg sm:text-xl mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-charcoal-300 text-sm">
                    JazakAllah Khair for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs sm:text-sm font-medium text-charcoal-500 mb-1.5 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs sm:text-sm font-medium text-charcoal-500 mb-1.5 sm:mb-2">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="contact-country" className="block text-xs sm:text-sm font-medium text-charcoal-500 mb-1.5 sm:mb-2">
                        Country
                      </label>
                      <select
                        id="contact-country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-500 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                      >
                        <option value="">Select country</option>
                        <option value="pakistan">Pakistan</option>
                        <option value="canada">Canada</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs sm:text-sm font-medium text-charcoal-500 mb-1.5 sm:mb-2">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs sm:text-sm font-medium text-charcoal-500 mb-1.5 sm:mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-beige-50 text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              <SectionHeader
                label="Our Offices"
                title="Visit Us"
                align="left"
              />
              {allOffices.map((office, i) => (
                <LocationCard key={office.city} {...office} index={i} />
              ))}

              {/* Social */}
              <div className="bg-beige-50 rounded-2xl p-5 sm:p-6 border border-beige-100">
                <h4 className="font-heading font-bold text-charcoal-600 mb-4 text-base">
                  Connect on Social Media
                </h4>
                <div className="flex gap-3">
                  {[
                    { Icon: FacebookIcon, href: SOCIAL_LINKS.facebook, label: "Facebook" },
                    { Icon: InstagramIcon, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                    { Icon: YoutubeIcon, href: SOCIAL_LINKS.youtube, label: "YouTube" },
                    { Icon: WhatsAppIcon, href: SOCIAL_LINKS.whatsapp, label: "WhatsApp" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white border border-beige-200 flex items-center justify-center text-charcoal-400 hover:text-gold hover:border-gold transition-all"
                      aria-label={s.label}
                    >
                      <s.Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-beige-50">
        <div className="section-container">
          <SectionHeader
            label="Common Questions"
            title="Frequently Asked Questions"
            description="Find quick answers to the most common questions about TaseesCircle."
          />
          <FAQ />
        </div>
      </section>
    </>
  );
}
