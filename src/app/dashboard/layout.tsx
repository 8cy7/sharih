import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white h-screen overflow-hidden">
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-white z-20 flex items-center justify-between px-4">
        <span className="text-xl font-bold text-primary">شارح</span>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <Sidebar className="hidden md:flex shrink-0 z-10" />
      <main className="flex-1 w-full flex flex-col min-h-0 bg-white md:pt-0 pt-16 overflow-y-auto">
        <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 py-8 md:py-12 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
