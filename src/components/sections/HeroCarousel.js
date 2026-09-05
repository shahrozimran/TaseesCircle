"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// Preserve the supplied filename order and original artwork in both languages.
const slides = [
  {
    src: "/images/hero/1.jpeg",
    alt: "An illustrated comparison of dishonest dealings and fair trade around community mosques.",
  },
  {
    src: "/images/hero/2.jpeg",
    alt: "Community members gather in a marketplace circle to commit to honest dealings.",
  },
  {
    src: "/images/hero/3.jpeg",
    alt: "A mosque and marketplace illustrating worship, fair weights and halal livelihood.",
  },
  {
    src: "/images/hero/4.jpeg",
    alt: "Merchants and families practise fair trade and trustworthy exchanges in a marketplace.",
  },
  {
    src: "/images/hero/5.jpeg",
    alt: "Neighbourhood circles connect across a city around a shared commitment to fairness.",
  },
];
const INTERVAL_MS = 7000; // Two-second fade, then five seconds at full opacity.

export default function HeroCarousel() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [{ active, previous }, setSlide] = useState({
    active: 0,
    previous: null,
  });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState({});
  const root = useRef(null);
  const playing =
    !hovered && !focused && !reducedMotion && inView && pageVisible;
  const next = (active + 1) % slides.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(root.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || !ready[active] || !ready[next]) return;
    const timer = window.setTimeout(
      () => setSlide({ active: next, previous: active }),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, next, playing, ready]);

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription={t("carousel")}
      aria-label={`${t("Community stories")}. ${t("Images pause while focused.")}`}
      tabIndex={0}
      className="relative min-w-0 rounded-[22px] border border-white/10 bg-gradient-to-br from-gold/30 via-white/5 to-gold/10 p-1 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal-600 sm:rounded-[28px] sm:p-1.5"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[17px] bg-charcoal-500 sm:rounded-[21px]">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription={t("slide")}
            aria-label={t("Image {current} of {total}", {
              current: index + 1,
              total: slides.length,
            })}
            aria-hidden={active !== index}
            // Keep the previous image opaque beneath the incoming image to avoid a dark flash.
            style={{
              zIndex: active === index ? 2 : previous === index ? 1 : 0,
            }}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out motion-reduce:transition-none ${active === index || previous === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={slide.src}
              alt={t(slide.alt)}
              fill
              sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
              preload={index === 0}
              className="select-none object-contain"
              draggable={false}
              onLoad={() =>
                setReady((loaded) =>
                  loaded[index] ? loaded : { ...loaded, [index]: true },
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
