import { Card } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-10">
      <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse mb-3" />
          <div className="h-4 w-48 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-100 rounded-full animate-pulse" />
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <StaggerItem key={i}>
            <Card className="p-6 flex flex-col justify-between border border-border shadow-sm h-[130px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-3" />
                  <div className="h-8 w-12 bg-slate-300 rounded animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-[10px] bg-slate-200 animate-pulse" />
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.2}>
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px] p-6 border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-slate-200 animate-pulse" />
                </div>
                <div className="h-2 w-16 bg-slate-100 rounded animate-pulse mt-1" />
              </div>
            </Card>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
