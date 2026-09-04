"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  User,
  Zap,
  FolderOpen,
  HeartHandshake,
  Search,
  Lock,
} from "lucide-react";

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [workerHealthId, setWorkerHealthId] = useState<string | null>(null);

  // Read stored worker Health ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("workerHealthId");
      if (storedId) setWorkerHealthId(storedId);
    }
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(path);
  };

  // Hide on ALL login routes (selector + sub-routes)
  if (pathname.startsWith("/login")) {
    return null;
  }

  // Detect worker mode
  const isWorkerMode = pathname.startsWith("/workers/");

  // Worker's passport link
  const workerPassportHref = workerHealthId
    ? `/workers/${encodeURIComponent(workerHealthId)}`
    : pathname;

  // Role-aware nav items
  const navItems = isWorkerMode
    ? [
        { href: workerPassportHref, label: "My Passport", icon: User },
        { href: "/quick-actions", label: t("quickActions"), icon: Zap },
        { href: "/schemes", label: t("schemes"), icon: HeartHandshake },
        { href: "/privacy", label: t("privacy"), icon: Lock },
      ]
    : [
        { href: "/quick-actions", label: t("quickActions"), icon: Zap },
        { href: "/records", label: t("records"), icon: FolderOpen },
        { href: "/schemes", label: t("schemes"), icon: HeartHandshake },
        { href: "/registry", label: t("registerSearch"), icon: Search },
      ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffefc]/95 backdrop-blur-lg border-t border-[#efeeeb] shadow-xl px-2 py-1.5"
      aria-label="Mobile Bottom Navigation"
    >
      <div className={`grid grid-cols-${navItems.length} items-center justify-around`}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] active:scale-95 ${
                active
                  ? "text-[#0f3e17] font-extrabold"
                  : "text-[#222222]/60 hover:text-[#0f3e17] font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  active ? "bg-[#e1f4df] text-[#0f3e17]" : "bg-transparent text-slate-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-full mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
