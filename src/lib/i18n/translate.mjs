import messages from "./messages.mjs";

export const LANGUAGE_COOKIE = "tasees-language";
export const LANGUAGE_STORAGE_KEY = "tasees-language";
export const normalizeLocale = (value) => (value === "ur" ? "ur" : "en");
export const localeDirection = (locale) =>
  normalizeLocale(locale) === "ur" ? "rtl" : "ltr";
export const intlLocale = (locale) =>
  normalizeLocale(locale) === "ur" ? "ur-PK" : "en-PK";
export const normalizeMessage = (text) => text.replace(/\s+/g, " ").trim();

const dictionary = new Map(
  Object.entries(messages).map(([key, value]) => [
    normalizeMessage(key),
    value,
  ]),
);
const caseInsensitive = new Map(
  [...dictionary].map(([key, value]) => [key.toLowerCase(), value]),
);
const templates = [...dictionary]
  .filter(
    ([key]) =>
      /\{\w+\}/.test(key) && /[a-zA-Z]{3}/.test(key.replace(/\{\w+\}/g, "")),
  )
  .sort(
    ([a], [b]) =>
      b.replace(/\{\w+\}/g, "").length - a.replace(/\{\w+\}/g, "").length,
  )
  .map(([key, value]) => {
    const names = [];
    const pieces = key.split(/(\{\w+\})/g).map((part) => {
      if (/^\{\w+\}$/.test(part)) {
        names.push(part.slice(1, -1));
        return "(.*?)";
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    return { pattern: new RegExp(`^${pieces.join("")}$`), names, value };
  });

export function translateText(text, locale = "en", values) {
  if (typeof text !== "string") return text;
  const key = normalizeMessage(text);
  // Arabic/Urdu originals, identifiers and unknown user content pass through unchanged.
  let result = text;
  if (normalizeLocale(locale) === "ur" && /[a-zA-Z]/.test(key)) {
    let translated =
      dictionary.get(key) ?? caseInsensitive.get(key.toLowerCase());
    // Known system messages may arrive from older database rows as interpolated English.
    // Match only whole, authored templates; never translate arbitrary substrings of user data.
    if (translated === undefined) {
      for (const template of templates) {
        const match = template.pattern.exec(key);
        if (!match) continue;
        const captured = Object.fromEntries(
          template.names.map((name, i) => {
            const raw = match[i + 1];
            return [
              name,
              ["role", "status", "prayer"].includes(name)
                ? (dictionary.get(raw) ??
                  caseInsensitive.get(raw.toLowerCase()) ??
                  raw)
                : raw,
            ];
          }),
        );
        translated = template.value.replace(
          /\{(\w+)\}/g,
          (token, name) => captured[name] ?? token,
        );
        break;
      }
    }
    if (translated !== undefined) {
      result =
        (text.match(/^\s*/)?.[0] || "") +
        translated +
        (text.match(/\s*$/)?.[0] || "");
    }
  }
  if (values) {
    result = result.replace(/\{([\w]+)\}/g, (match, name) =>
      Object.hasOwn(values, name) ? String(values[name]) : match,
    );
  }
  return result;
}

export function formatDate(value, locale, options = {}) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value ?? "")
    : date.toLocaleDateString(intlLocale(locale), options);
}

export function formatNumber(value, locale, options) {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

export function matchesLocalizedSearch(query, ...values) {
  const search = normalizeMessage(query).toLocaleLowerCase();
  return (
    !search ||
    values
      .flat()
      .some(
        (value) =>
          typeof value === "string" &&
          [value, translateText(value, "ur")].some((text) =>
            text.toLocaleLowerCase().includes(search),
          ),
      )
  );
}

export function formatRelativeTime(value, locale, now = Date.now()) {
  const elapsed = Math.max(
    0,
    Math.floor((now - new Date(value).getTime()) / 1000),
  );
  if (!Number.isFinite(elapsed)) return "";
  if (elapsed < 60) return translateText("just now", locale);
  const [amount, unit] =
    elapsed < 3600
      ? [Math.floor(elapsed / 60), "minute"]
      : elapsed < 86400
        ? [Math.floor(elapsed / 3600), "hour"]
        : [Math.floor(elapsed / 86400), "day"];
  return new Intl.RelativeTimeFormat(intlLocale(locale), {
    numeric: "always",
    style: "short",
  }).format(-amount, unit);
}
