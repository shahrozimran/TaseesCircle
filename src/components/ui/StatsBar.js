"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CounterItem({ label, value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-gold mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm sm:text-base text-charcoal-300 font-medium">{label}</div>
    </div>
  );
}

export default function StatsBar({ stats, dark = false }) {
  return (
    <section className={`${dark ? "bg-charcoal-600" : "bg-beige-200"} islamic-pattern`}>
      <div className="section-container py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, i) => (
            <CounterItem key={i} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
