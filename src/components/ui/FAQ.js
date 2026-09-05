"use client";
import T from "@/components/i18n/T";


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is Ta'sees Circle?",
    answer: "Ta'sees Circle is a digital Islamic community platform founded by Muhammad Maqbool Ahmed Khan in August 2026. It is dedicated to connecting and serving Muslim communities in Pakistan and Canada through knowledge discussions, online circles, and authentic guidance rooted in the Quran and Sunnah.",
  },
  {
    question: "How can I join Ta'sees Circle?",
    answer: "You can join our community by signing up on our website with your Google account. Once registered, you can access exclusive content, join live online discussions, and connect with community features across Pakistan and Canada.",
  },
  {
    question: "Are discussions open to everyone?",
    answer: "Yes! All of our discussions and knowledge circles are open to Muslims and non-Muslims alike. We welcome everyone who is interested in learning about Islam, engaging with our community, or asking questions about Islamic life and ethics.",
  },
  {
    question: "How can I get involved or volunteer?",
    answer: "We welcome passionate community members! You can get involved through our Contact page. Opportunities include moderating online discussions, sharing beneficial knowledge, assisting with digital events, and supporting the Ummah.",
  },
  {
    question: "Do you offer online discussion circles?",
    answer: "Yes, our discussions and knowledge circles are available online including Quran study insights, Islamic finance Q&As, freelancing & career ethics, and halal living guidance. Check our Discussions page to participate.",
  },
];

export default function FAQ({ items = faqData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="bg-white rounded-xl border border-beige-100 shadow-card overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-5 text-start hover:bg-beige-50/50 transition-colors"
          >
            <span className="font-heading font-semibold text-charcoal-600 text-base">
              <T>{item.question}</T>
            </span>
            <ChevronDown
              size={18}
              className={`text-charcoal-300 shrink-0 transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-charcoal-400 text-sm leading-relaxed border-t border-beige-100 pt-4">
                  <T>{item.answer}</T>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
