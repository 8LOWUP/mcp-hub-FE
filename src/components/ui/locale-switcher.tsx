"use client";

import {useLocale} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import {useSearchParams} from "next/navigation";

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const next = locale === "ko" ? "en" : "ko";

  const switchLocale = () => {
    const qs = searchParams?.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { locale: next });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-2 rounded-md border text-sm hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Toggle locale"
      title={`Switch to ${next.toUpperCase()}`}
    >
      {next.toUpperCase()}
    </button>
  );
}