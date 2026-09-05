"use client";

import { Children, Fragment } from "react";
import { useLanguage } from "./LanguageProvider";

// A fragment keeps links, table cells and option elements semantically unchanged.
// Only explicit text boundaries translate; React elements and user values stay intact.
export default function T({ children, message, values }) {
  const { t } = useLanguage();
  if (message) {
    // Named React slots let Urdu reorder a full sentence while keeping names and markup intact.
    return t(message)
      .split(/(\{\w+\})/g)
      .map((part, index) => {
        const name = /^\{(\w+)\}$/.exec(part)?.[1];
        return (
          <Fragment key={index}>
            {name && values && Object.hasOwn(values, name)
              ? values[name]
              : part}
          </Fragment>
        );
      });
  }
  return Children.map(children, (child) =>
    typeof child === "string" ? t(child) : child,
  );
}
