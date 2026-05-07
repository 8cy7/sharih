"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Lock, Award, FileText, Sparkles, BrainCircuit, MessageSquare, Flame } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LearningPathPage() {
  const params = useParams();
  const id = params.id as string;
  const [chapterData, setChapterData] = useState<any>(null);

  useEffect(() => {
    if (id) {
       fetch(`/api/chapters/${id}`)
        .then(res => res.json())
        .then(data => setChapterData(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!chapterData) {
     return <div className="text-center py-20 text-slate-500">جاري تحميل مسار التعلم...</div>;
  }

  const { chapter, lessons } = chapterData;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-12">
        <div className="flex items-center gap-3 text-primary font-medium mb-3">
          <Link href="/dashboard" className="hover:underline">موادي</Link>
          <span>/</span>
          <span>{chapter.subjectName}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{chapter.title}</h1>
        <p className="text-slate-500">هالشابتر فيه {chapter.totalLessons} دروس تفاعلية واختبار يقيّم وضعك اللي من جد. امشِ حبة حبة وخلّصهم بالترتيب.</p>
      </FadeIn>

      {/* AI Agents Generation Banner */}
      <FadeIn delay={0.2} className="mb-12">
        <div className="bg-[#0B1120] rounded-[20px] p-2 shadow-lg border border-slate-800 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          <div className="bg-slate-900/80 rounded-[16px] p-6 text-white relative">
            <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[150%] bg-primary/20 blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
              <div className="flex-1 text-right">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-4 text-[10px] font-bold text-cyan-400 uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                   <Sparkles className="w-3 h-3" /> Multi-Agent AI Architecture
                 </div>
                 <h3 className="text-lg font-bold mb-2 text-white">من قوة الذكاء، ٤ ايجنتات اشتغلوا مع بعض! 🤖</h3>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium">
                   عشان نرتب لك هالمسار، فيه وكيل ذكاء اصطناعي حلل مذكرتك، الثاني هندس لك المنهج، الثالث صنع الفيديوهات التفاعلية، والرابع جاهز كمدرس خاص يجاوبك بأي لحظة.
                 </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 shrink-0 flex-row-reverse" dir="ltr">
                 {[
                   { icon: FileText, name: "المحلل" },
                   { icon: BrainCircuit, name: "المهندس" },
                   { icon: PlayCircle, name: "الصانع" },
                   { icon: MessageSquare, name: "الموجه" }
                 ].map((agent, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 relative group/agent">
                      {i < 3 && <div className="absolute right-[-16px] top-6 w-4 h-[1px] bg-slate-700" />}
                      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 group-hover/agent:bg-primary/20 group-hover/agent:text-cyan-400 group-hover/agent:border-cyan-400/50 transition-all duration-300 group-hover/agent:scale-110 shadow-[0_0_0_rgba(34,211,238,0)] group-hover/agent:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <agent.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold group-hover/agent:text-cyan-400 transition-colors">{agent.name}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Timeline */}
      <div className="relative">
        <StaggerContainer className="flex flex-col gap-6 relative">
          {/* Vertical connecting line - positioned on the right for RTL */}
          <div className="absolute right-[23px] top-4 bottom-8 w-0.5 bg-border -z-10" />

          {lessons.map((lesson: any, idx: number) => {
            const isCompleted = false; // Update this with attempt state if applicable
            const isAvailable = lesson.processingStatus === "complete" || lesson.processingStatus === "partial_ready";
            const isLocked = !isAvailable;

            return (
              <StaggerItem key={lesson.id} className="flex gap-6 relative">
                {/* Node */}
                <div className="shrink-0 mt-2 z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm transition-colors",
                    isCompleted ? "bg-success text-white" : 
                    isAvailable ? "bg-primary text-white" : 
                    "bg-slate-100 text-slate-400"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : 
                     isAvailable ? <PlayCircle className="w-6 h-6" /> : 
                     <Lock className="w-5 h-5" />}
                  </div>
                </div>

                {/* Card */}
                <Card className={cn(
                  "flex-1 p-6 relative overflow-hidden transition-all duration-300",
                  isAvailable ? "border-primary shadow-md scale-[1.02] bg-white" : 
                  isLocked ? "border-transparent bg-[#F8FAFB] opacity-70" : 
                  "border-border shadow-sm bg-white"
                )}>
                  {/* Visual Left border for available */}
                  {isAvailable && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-400 mb-1">الدرس {lesson.lessonNumber}</p>
                      <h3 className={cn("text-xl font-bold mb-2", isLocked ? "text-slate-600" : "text-slate-900")}>
                        {lesson.titleAr}
                      </h3>
                    </div>

                    <div className="mt-4 md:mt-0 flex shrink-0">
                      {isCompleted ? (
                        <Link href={`/dashboard/lesson/${lesson.id}`}>
                          <Button variant="outline" className="text-slate-600">راجع اللي أخذته</Button>
                        </Link>
                      ) : isAvailable ? (
                        <Link href={`/dashboard/lesson/${lesson.id}`}>
                          <Button className="shadow-sm">يلا نبدأ نذاكر</Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" disabled className="text-slate-400">
                          {lesson.processingStatus === 'rendering_media' ? 'جاري التجهيز...' : 'مُقفّل'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}

          {/* Completion state / Chapter Summary */}
          <StaggerItem className="flex gap-6 mt-6">
            <div className="shrink-0 mt-4 z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-[3px] border-white bg-slate-100 text-slate-400 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
            </div>
            
            <Card className="flex-1 p-8 border-dashed border-2 border-slate-200 bg-[#F8FAFB] text-center opacity-70">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">خلاصة الشابتر</h3>
              <p className="text-slate-500 text-sm">خلص الدروس كلها عشان تفك أم الملخص اللي بينقذك ليلة الفاينل وتستلم الشهادة.</p>
            </Card>
          </StaggerItem>

        </StaggerContainer>
      </div>
    </div>
  );
}
