"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";

// Keep native required/type/pattern checks, but show their feedback in the app language.
export default function LocalizedForm({
  children,
  onInvalid,
  onInput,
  ...props
}) {
  const form = useRef(null);
  const { locale, t } = useLanguage();
  useEffect(() => {
    for (const field of form.current?.elements || [])
      field.setCustomValidity?.("");
  }, [locale]);

  return (
    <form
      {...props}
      ref={form}
      onInvalid={(event) => {
        const field = event.target;
        field.setCustomValidity("");
        const validity = field.validity;
        const message = validity.valueMissing
          ? "Please fill out this field."
          : validity.typeMismatch && field.type === "email"
            ? "Please enter a valid email address."
            : validity.tooShort
              ? "Please lengthen this text to at least {count} characters."
              : validity.tooLong
                ? "Please shorten this text to {count} characters or fewer."
                : validity.rangeUnderflow || validity.rangeOverflow
                  ? "Please enter a value within the allowed range."
                  : "Please match the requested format.";
        field.setCustomValidity(
          t(message, {
            count: validity.tooShort ? field.minLength : field.maxLength,
          }),
        );
        onInvalid?.(event);
      }}
      onInput={(event) => {
        event.target.setCustomValidity?.("");
        onInput?.(event);
      }}
    >
      {children}
    </form>
  );
}
