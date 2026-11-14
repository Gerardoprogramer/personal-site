"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function Logo() {
  const { href, t } = useTranslation();
  return (
    <Link
      href={`${href({ page: "home" })}#top`}
      aria-label={t.header.logoLabel}
      className="header-brand"
    >
      <span className="brand-monogram" aria-hidden="true">
        <svg viewBox="0 0 40 44" fill="none">
          <path
            d="M20 2 37.3 12v20L20 42 2.7 32V12Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <span>G</span>
      </span>
      <span className="brand-name">
        gerardo<span className="text-accent">.mm</span>
      </span>
    </Link>
  );
}
