"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, BookOpen, Clock, CheckCircle2, PlayCircle, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUBJECTS_DATA = [
  { id: 1, title: "تفاعل الإنسان والحاسوب (HCI)", lastChapter: "الشابتر ٣: التفكير التصميمي", lastLesson: "مراحل بناء واجهة المستخدم", progress: 65, status: "active", icon: "🎨" },
  { id: 2, title: "هياكل البيانات والخوارزميات", lastChapter: "الشابتر ٥: الـ Trees", lastLesson: "البحث الثنائي (Binary Search)", progress: 30, status: "active", icon: "🌳" },
  { id: 3, title: "مقدمة للذكاء الاصطناعي", lastChapter: "الشابتر ٢: خوارزميات البحث", lastLesson: "معمارية A*", progress: 100, status: "completed", icon: "🤖" },
  { id: 4, title: "ريادة الأعمال", lastChapter: "الشابتر الأول", lastLesson: "أساسيات نماذج العمل", progress: 10, status: "active", icon: "💼" },
  { id: 5, title: "هندسة البرمجيات", lastChapter: "الشابتر ٧", lastLesson: "الاختبارات (Testing)", progress: 100, status: "completed", icon: "📐" },
];

export default function SubjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredSubjects = SUBJECTS_DATA.filter((s) => {
    const matchesSearch = s.title.includes(search) || s.lastChapter.includes(search);
    const matchesFilter = filter === "all" ? true : s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-8">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">موادك اللي تدرسها</h1>
          <p className="text-slate-500">كل ملفاتك والمناهج اللي رافعها محفوظة هنا. دور، كمل مذاكرة، أو ارفع لك شيء جديد.</p>
        </div>
        
        <Link href="/dashboard/upload">
          <Button className="gap-2 shadow-sm shrink-0">
            <Plus className="w-4 h-4" /> ارفع شابتر جديد
          </Button>
        </Link>
      </FadeIn>

      <FadeIn delay={0.1} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[12px] border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="دور على مادة أو شابتر..." 
            className="pl-4 pr-10 h-12 bg-slate-50 border-slate-200 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-[8px] w-full md:w-auto shrink-0">
          {[
            { id: "all", label: "الكل" },
            { id: "active", label: "قاعد أدرسها" },
            { id: "completed", label: "ختمتها" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-[6px] text-sm font-bold transition-all",
                filter === f.id ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.length > 0 ? filteredSubjects.map((sub) => (
          <StaggerItem key={sub.id}>
            <Card className="h-full border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {sub.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{sub.title}</h3>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {sub.status === "completed" ? "ختمتها بطل 🏆" : "قاعد أدرسها 🔥"}
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#F8FAFB] border border-slate-200 rounded-[8px] p-3 mb-6 mt-auto">
                  <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> وقفت هنا آخر مرة:</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{sub.lastChapter}</p>
                  <p className="text-sm text-slate-500 truncate">الدرس: {sub.lastLesson}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-600">معدل الزحف والانجاز</span>
                    <span className={sub.progress === 100 ? "text-success" : "text-primary"}>{sub.progress}٪</span>
                  </div>
                  <Progress value={sub.progress} className="h-2" />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-slate-50">
                {sub.status === "completed" ? (
                  <Link href="/dashboard/learning-path" className="block w-full">
                    <Button variant="outline" className="w-full gap-2 text-slate-600 shadow-sm bg-white">
                      <CheckCircle2 className="w-4 h-4" /> راجع المادة
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/lesson/2" className="block w-full">
                    <Button className="w-full gap-2 shadow-sm">
                      <PlayCircle className="w-4 h-4" /> كمل مذاكرة من وين ما وقفت
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </StaggerItem>
        )) : (
          <FadeIn className="col-span-full py-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">ما لقينا شيء يناسب فلترك</h3>
            <p className="text-slate-500">جرب تبحث باسم ثاني أو ارفع لك مادة جديدة عشان تبدأ تذاكر صح.</p>
          </FadeIn>
        )}
      </StaggerContainer>
    </div>
  );
}
