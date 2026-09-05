"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const languages = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
];

export default function LanguageSwitcher({ dark = false, compact = false }) {
  const { locale, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const options = useRef([]);
  const focusOnOpen = useRef(null);
  const id = useId();

  useLayoutEffect(() => {
    if (open && focusOnOpen.current !== null) {
      options.current[focusOnOpen.current]?.focus();
      focusOnOpen.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const focusOption = (index) => options.current[index]?.focus();

  return (
    <div
      ref={root}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={`${t("Language")}: ${locale === "ur" ? "اردو" : "English"}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            const index = event.key === "ArrowUp" ? 1 : 0;
            if (open) focusOption(index);
            else {
              focusOnOpen.current = index;
              setOpen(true);
            }
          }
        }}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors ${dark ? "text-white hover:bg-white/10" : "text-charcoal-500 hover:bg-beige-100"}`}
      >
        <Languages size={18} aria-hidden="true" />
        <span className={compact ? "hidden sm:inline" : ""}>
          {t("Language")}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          aria-label={t("Language")}
          className="absolute end-0 top-full z-[60] mt-2 min-w-40 rounded-xl border border-beige-200 bg-white p-1.5 text-charcoal-600 shadow-card-hover animate-slide-down"
        >
          {languages.map((language, index) => (
            <button
              key={language.code}
              ref={(node) => {
                options.current[index] = node;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={locale === language.code}
              onClick={() => {
                changeLanguage(language.code);
                close();
              }}
              onKeyDown={(event) => {
                if (
                  ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  focusOption(
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 1
                        : (index + 1) % 2,
                  );
                }
              }}
              className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm hover:bg-beige-100 ${locale === language.code ? "bg-beige-50 font-semibold text-gold" : ""}`}
            >
              <span lang={language.code} dir={language.dir} translate="no">
                {language.name}
              </span>
              {locale === language.code && (
                <Check size={15} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
