import "server-only";
import { cookies } from "next/headers";
import { BRAND_SOCIAL_IMAGE } from "@/lib/brand";
import {
  LANGUAGE_COOKIE,
  normalizeLocale,
  translateText,
} from "./translate.mjs";

export async function getLocale() {
  return normalizeLocale((await cookies()).get(LANGUAGE_COOKIE)?.value);
}

export async function localizeMetadata(metadata) {
  const locale = await getLocale();
  const t = (value) => translateText(value, locale);
  const title =
    typeof metadata.title === "object"
      ? {
          ...metadata.title,
          default: t(metadata.title.default),
          template: t(metadata.title.template),
        }
      : t(metadata.title);
  return {
    ...metadata,
    title,
    description: t(metadata.description),
    ...(metadata.openGraph && {
      openGraph: {
        ...metadata.openGraph,
        images: metadata.openGraph.images ?? [BRAND_SOCIAL_IMAGE],
        title: t(metadata.openGraph.title),
        description: t(metadata.openGraph.description),
        locale: locale === "ur" ? "ur_PK" : "en_US",
      },
    }),
    ...(metadata.twitter && {
      twitter: {
        ...metadata.twitter,
        images: metadata.twitter.images ?? [BRAND_SOCIAL_IMAGE],
        title: t(metadata.twitter.title),
        description: t(metadata.twitter.description),
      },
    }),
  };
}
