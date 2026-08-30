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
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-10 md:px-14">
      {/* Quote Icon */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <Quote size={20} className="text-gold sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="relative min-h-[180px] sm:min-h-[200px] flex items-center">
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
            <p className="text-base sm:text-lg md:text-xl text-charcoal-400 leading-relaxed italic mb-6 sm:mb-8 font-body">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-heading font-bold text-charcoal-600 text-base sm:text-lg">{t.name}</p>
              <p className="text-xs sm:text-sm text-charcoal-300">{t.location}</p>
              <p className="text-xs text-gold mt-1 font-medium">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 sm:-left-2 md:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal-400 hover:text-gold hover:shadow-card-hover transition-all"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 sm:-right-2 md:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-card flex items-center justify-center text-charcoal-400 hover:text-gold hover:shadow-card-hover transition-all"
        aria-label="Next testimonial"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === current
                ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-gold"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-beige-400 hover:bg-beige-500"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
