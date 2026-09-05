"use client";

import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { SITE_NAME } from "@/lib/constants";

export default function BrandLogo({ className = "w-28", symbol = false, decorative = false, eager = false }) {
  const { t } = useLanguage();
  return (
    <Image
      src={symbol ? "/brand/mark.webp" : "/brand/logo.webp"}
      alt={decorative ? "" : t(SITE_NAME)}
      width={symbol ? 128 : 1040}
      height={symbol ? 128 : 632}
      className={`block h-auto shrink-0 rounded-md ${className}`}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
    />
  );
}
