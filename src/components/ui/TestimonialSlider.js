"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialSlider({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Quote Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <Quote size={24} className="text-gold" />
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="relative min-h-[200px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center w-full"
          >
            <p className="text-lg sm:text-xl text-charcoal-400 leading-relaxed italic mb-8 font-body">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-heading font-bold text-charcoal-600 text-lg">{t.name}</p>
              <p className="text-sm text-charcoal-300">{t.location}</p>
              <p className="text-xs text-gold mt-1">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal-400 hover:text-gold hover:shadow-card-hover transition-all"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal-400 hover:text-gold hover:shadow-card-hover transition-all"
        aria-label="Next testimonial"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === current
                ? "w-8 h-2.5 bg-gold"
                : "w-2.5 h-2.5 bg-beige-400 hover:bg-beige-500"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
