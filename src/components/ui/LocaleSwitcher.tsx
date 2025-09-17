"use client";

import Image from "next/image";
import {useLocale} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import {useSearchParams} from "next/navigation";

const LocaleSwitcher = () => {
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
      className="
        rounded-md text-sm p-2 hover:cursor-pointer
        bg-surface-3 hover:bg-surface-3/10
      "
      aria-label="Toggle locale"
      title={`Switch to ${next.toUpperCase()}`}
    >
      <Image src="/locale.svg" alt="Locale icon" width={20} height={20} />
    </button>
  );
}

export default LocaleSwitcher