"use client";

import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages, ChevronDown } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
] as const;

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // router.replace will update the locale in the pathname while preserving query params and path structure
      router.replace(
        pathname,
        { locale: newLocale as any }
      );
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 bg-kerala-coir-50 hover:bg-kerala-coir-100/80 border border-kerala-coir-300 text-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition">
        <Languages className="w-4 h-4 text-kerala-green-800 shrink-0" />
        <select
          value={currentLocale}
          disabled={isPending}
          onChange={(e) => handleLanguageChange(e.target.value)}
          aria-label="Select Language"
          className="bg-transparent border-0 pr-5 pl-1 py-0 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-hidden focus:ring-0 appearance-none"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
