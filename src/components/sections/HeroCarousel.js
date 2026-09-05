"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import T from "@/components/i18n/T";

// The same physical swipe direction and filename order apply in both languages.
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
// Matching end slides let either edge wrap without moving backwards across the strip.
const frames = [4, 0, 1, 2, 3, 4, 0];
const normalizePosition = (position) =>
  position === 0
    ? slides.length
    : position === frames.length - 1
      ? 1
      : position;

export default function HeroCarousel() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const viewport = useRef(null);
  const position = useRef(1);
  const width = useRef(0);
  const animation = useRef(null);
  // Before hydration this already displays image 1, rather than the leading clone.
  const x = useMotionValue("-100%");
  const [viewportWidth, setViewportWidth] = useState(0);
  const [active, setActive] = useState(0);
  const [moving, setMoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState({});

  useEffect(() => {
    const resize = new ResizeObserver(([entry]) => {
      const measured = entry.contentRect.width;
      if (!measured || measured === width.current) return;
      animation.current?.stop();
      width.current = measured;
      position.current = normalizePosition(position.current);
      x.set(-position.current * measured);
      setViewportWidth(measured);
      setActive(position.current - 1);
      setMoving(false);
    });
    const visibility = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    resize.observe(viewport.current);
    visibility.observe(viewport.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      animation.current?.stop();
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [x]);

  const goTo = useCallback(
    (target, automatic = false) => {
      if (!width.current) return;
      animation.current?.stop();
      const bounded = Math.max(0, Math.min(frames.length - 1, target));
      position.current = bounded;
      setMoving(true);
      animation.current = animate(x, -bounded * width.current, {
        // Automatic slides ease in and out; swipes glide into a gentle stop.
        duration: reducedMotion ? 0 : automatic ? 2 : 0.7,
        ease: automatic ? [0.45, 0, 0.55, 1] : [0.22, 1, 0.36, 1],
        onComplete: () => {
          const settled = normalizePosition(bounded);
          position.current = settled;
          if (settled !== bounded) x.set(-settled * width.current);
          setActive(settled - 1);
          setMoving(false);
        },
      });
    },
    [reducedMotion, x],
  );

  useEffect(() => {
    if (
      !viewportWidth ||
      focused ||
      dragging ||
      moving ||
      reducedMotion ||
      !inView ||
      !pageVisible
    )
      return;
    if (!ready[active] || !ready[(active + 1) % slides.length]) return;
    // Five seconds to read, followed by a two-second automatic slide.
    const timer = window.setTimeout(
      () => goTo(position.current + 1, true),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [
    active,
    focused,
    dragging,
    moving,
    reducedMotion,
    inView,
    pageVisible,
    ready,
    viewportWidth,
    goTo,
  ]);

  return (
    <section
      className="overflow-hidden bg-[#171a16] pt-20 sm:pt-24"
      aria-label={t("Community stories")}
    >
      <div
        className="relative mx-auto lg:max-w-[calc(100%-8rem)]"
        style={{ width: "min(100%, 1536px, calc(150svh - 240px))" }}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
      <div
        ref={viewport}
        id="hero-carousel"
        role="region"
        aria-roledescription={t("carousel")}
        aria-label={`${t("Community stories")}. ${t("Swipe left or right, or use the arrow keys, to explore the images.")}`}
        tabIndex={0}
        dir="ltr"
        className="relative aspect-[3/2] w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-light"
        onKeyDown={(event) => {
          const target =
            event.key === "ArrowRight"
              ? position.current + 1
              : event.key === "ArrowLeft"
                ? position.current - 1
                : event.key === "Home"
                  ? 1
                  : event.key === "End"
                    ? slides.length
                    : null;
          if (target === null) return;
          event.preventDefault();
          goTo(target);
        }}
      >
        <motion.div
          className="flex h-full w-full cursor-grab active:cursor-grabbing"
          style={{ x, touchAction: "pan-y pinch-zoom" }}
          drag={viewportWidth > 0 ? "x" : false}
          dragConstraints={{
            left: -(frames.length - 1) * viewportWidth,
            right: 0,
          }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => {
            animation.current?.stop();
            position.current = Math.max(
              0,
              Math.min(
                frames.length - 1,
                Math.round(-Number(x.get()) / width.current),
              ),
            );
            setMoving(false);
            setDragging(true);
            viewport.current.focus({ preventScroll: true });
          }}
          onDragEnd={(_, info) => {
            const distance = info.offset.x;
            const passedThreshold =
              Math.abs(distance) > Math.min(80, width.current * 0.15);
            const flick =
              Math.abs(distance) > 8 && Math.abs(info.velocity.x) > 350;
            const step = passedThreshold || flick ? (distance < 0 ? 1 : -1) : 0;
            setDragging(false);
            goTo(position.current + step);
          }}
        >
          {frames.map((slideIndex, frameIndex) => (
            <div
              key={frameIndex}
              role="group"
              aria-roledescription={t("slide")}
              aria-label={t("Image {current} of {total}", {
                current: slideIndex + 1,
                total: slides.length,
              })}
              aria-hidden={frameIndex !== active + 1}
              className="relative h-full w-full shrink-0 select-none"
            >
              <Image
                src={slides[slideIndex].src}
                alt={t(slides[slideIndex].alt)}
                fill
                sizes="(min-width: 1536px) 1536px, 100vw"
                preload={frameIndex === 1}
                // The next frame must be ready before the automatic slide begins.
                loading={frameIndex === 1 ? undefined : "eager"}
                className="pointer-events-none object-contain"
                draggable={false}
                onLoad={() =>
                  setReady((loaded) =>
                    loaded[slideIndex]
                      ? loaded
                      : { ...loaded, [slideIndex]: true },
                  )
                }
              />
            </div>
          ))}
        </motion.div>
      </div>
      <button
        type="button"
        aria-label={t("Previous image")}
        aria-controls="hero-carousel"
        aria-disabled={!viewportWidth || moving || dragging}
        onClick={() => {
          if (!moving && !dragging) goTo(position.current - 1);
        }}
        className="absolute -left-14 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-charcoal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold aria-disabled:cursor-default aria-disabled:opacity-40 lg:flex"
      >
        <ChevronLeft size={22} aria-hidden="true" style={{ transform: "none" }} />
      </button>
      <button
        type="button"
        aria-label={t("Next image")}
        aria-controls="hero-carousel"
        aria-disabled={!viewportWidth || moving || dragging}
        onClick={() => {
          if (!moving && !dragging) goTo(position.current + 1);
        }}
        className="absolute -right-14 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-charcoal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold aria-disabled:cursor-default aria-disabled:opacity-40 lg:flex"
      >
        <ChevronRight size={22} aria-hidden="true" style={{ transform: "none" }} />
      </button>
      </div>
      <p className="px-4 py-4 text-center text-xs sm:text-sm font-medium text-white/75">
        <T>Swipe left to explore the idea.</T>
      </p>
    </section>
  );
}
