"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is Ta'sees Circle?",
    answer: "Ta'sees Circle is a digital Islamic community platform dedicated to connecting and serving Muslim communities in Pakistan and Canada. We offer knowledge discussions, online circles, and authentic guidance rooted in Islamic values.",
  },
  {
    question: "How can I join Ta'sees Circle?",
    answer: "You can join our community by signing up on our website with your Google account. Once registered, you can access exclusive content, join live online discussions, and connect with community features across Pakistan and Canada.",
  },
  {
    question: "Are programs open to everyone?",
    answer: "Yes! All of our programs are open to Muslims and non-Muslims alike. We welcome everyone who is interested in learning about Islam, engaging with our community, or participating in our service programs.",
  },
  {
    question: "How can I volunteer?",
    answer: "We're always looking for passionate volunteers! You can sign up through our Contact page or visit any of our community centers. Volunteer opportunities include event organization, teaching, mentoring, food drives, and administrative support.",
  },
  {
    question: "How is Zakat distributed?",
    answer: "Our Zakat distribution follows strict Islamic guidelines. All Zakat funds are allocated to eligible categories as defined in the Quran. We maintain full transparency with annual audited reports available to all donors.",
  },
  {
    question: "Do you offer online circles?",
    answer: "Yes, our discussions and knowledge circles are available online including Quran study insights, Islamic finance Q&As, and community guidance. Check our Discussions page to participate.",
  },
];

export default function FAQ({ items = faqData }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
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
            className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-beige-50/50 transition-colors"
          >
            <span className="font-heading font-semibold text-charcoal-600 text-base">
              {item.question}
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
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
