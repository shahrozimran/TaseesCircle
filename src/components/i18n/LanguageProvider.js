"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  LANGUAGE_COOKIE,
  LANGUAGE_STORAGE_KEY,
  normalizeLocale,
  localeDirection,
  intlLocale,
  translateText,
} from "@/lib/i18n/translate.mjs";

const LanguageContext = createContext(null);

export default function LanguageProvider({ initialLocale = "en", children }) {
  const [locale, setLocale] = useState(normalizeLocale(initialLocale));
  const router = useRouter();

  const changeLanguage = useCallback(
    (value) => {
      const next = normalizeLocale(value);
      setLocale(next);
      document.documentElement.lang = next;
      document.documentElement.dir = localeDirection(next);
      document.cookie = `${LANGUAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        /* Switching still works if storage is disabled. */
      }
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    const onStorage = (event) => {
      if (
        event.key === LANGUAGE_STORAGE_KEY &&
        ["en", "ur"].includes(event.newValue)
      )
        changeLanguage(event.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [changeLanguage]);

  const value = useMemo(
    () => ({
      locale,
      direction: localeDirection(locale),
      dateLocale: intlLocale(locale),
      changeLanguage,
      t: (text, values) => translateText(text, locale, values),
    }),
    [locale, changeLanguage],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}
