"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, TrendingUp, UploadCloud, Settings, LayoutDashboard } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/dashboard/subjects", label: "موادي", icon: BookOpen },
    { href: "/dashboard/progress", label: "وين وصلت؟", icon: TrendingUp, mirror: true },
    { href: "/dashboard/upload", label: "ارفع ملف جديد", icon: UploadCloud },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 border-l border-border bg-[#F8FAFB] pt-8 pb-12 flex flex-col h-screen sticky top-0", className)}>
      <div className="px-8 mb-10">
        <Link href="/">
          <span className="text-2xl font-bold text-primary">شارح</span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[8px] text-sm font-medium transition-all duration-200 group relative",
                isActive ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-primary" : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-full" />
              )}
              <link.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600", link.mirror && "-scale-x-100")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
