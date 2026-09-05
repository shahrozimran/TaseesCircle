"use client";

import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SITE_NAME } from "@/lib/constants";

export default function BrandLogo({ className = "w-20", symbol = false, dark = false, decorative = false, eager = false }) {
  const { t } = useLanguage();
  return (
    <Image
      src={symbol ? "/brand/mark.webp" : "/brand/logo.webp"}
      alt={decorative ? "" : t(SITE_NAME)}
      width={symbol ? 128 : 1024}
      height={symbol ? 128 : 512}
      className={`block h-auto shrink-0 ${dark ? "[filter:invert(1)_hue-rotate(180deg)]" : ""} ${className}`}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
    />
  );
}
