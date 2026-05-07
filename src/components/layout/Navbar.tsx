import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all", className)}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">شارح</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#how-it-works" className="hover:text-primary transition-colors">وش السالفة؟</Link>
          <Link href="#features" className="hover:text-primary transition-colors">المميزات</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">الباقات</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="font-semibold text-slate-700 hover:text-primary rounded-[8px]">دخول</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-[8px] font-semibold px-6 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:translate-y-[-2px] transition-all duration-300">يلا نبدأ</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
