"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Flame, PlayCircle, Plus, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data1 = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 24 }];
const data2 = [{ v: 5 }, { v: 6 }, { v: 4 }, { v: 7 }, { v: 5 }, { v: 8 }, { v: 7 }];
const data3 = [{ v: 40 }, { v: 45 }, { v: 50 }, { v: 55 }, { v: 60 }, { v: 65 }, { v: 68 }];

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/chapters')
      .then(res => res.json())
      .then(data => setChapters(data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: "دروس خلصتها", value: "٢٤", icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-50", stroke: "#3b82f6", data: data1 },
    { label: "شابك ورا بعض", value: "٧", icon: Flame, color: "text-amber-500", bg: "bg-amber-50", stroke: "#f59e0b", data: data2 },
    { label: "نسبة الزحف بالمنهج", value: "٪٦٨", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50", stroke: "#10b981", data: data3 }
  ];

  return (
    <div className="flex flex-col gap-10">
      <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">يا هلا والله بعبدالعزيز! 👋</h1>
          <p className="text-slate-500">جاهز نجلّد أم المادة اليوم ونقفل الشابتر؟</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-medium shadow-sm border border-amber-100">
          <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          <span>وحش! شاد حيلك ٧ أيام</span>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StaggerItem key={i}>
            <Card className="p-6 flex flex-col justify-between border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 group-hover:scale-110 origin-right transition-transform">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${stat.bg} group-hover:rotate-12 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
                <div className="h-12 w-full mt-2 -ml-2 -mb-2 relative z-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stat.data}>
                        <Line type="monotone" dataKey="v" stroke={stat.stroke} strokeWidth={3} dot={false} isAnimationActive={true} animationDuration={1500} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.2}>
        <h2 className="text-xl font-bold text-slate-900 mb-6">موادك الحالية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.length > 0 ? chapters.map((c) => {
            const progress = c.processingStatus === 'complete' ? 100 : (c.processingStatus === 'partial_ready' ? 50 : 10);
            return (
              <Link key={c.id} href={`/dashboard/learning-path/${c.id}`} className="group">
                <Card className="h-full p-6 border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{c.subjectName}</h3>
                      <p className="text-sm text-slate-500">{c.title}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">منجز من هالشابتر</span>
                        <span className="text-primary">{progress}٪</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                      <p className="text-[11px] text-slate-400 mt-2 text-left" dir="ltr">{c.processingStatus === 'complete' ? 'جاهز بالكامل' : 'جاري التجهيز'} ⚙️</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          }) : (
             <div className="col-span-full py-10 flex items-center justify-center text-slate-400 text-sm">ما فيه ملفات سابقة... ارفع ملف جديد</div>
          )}

          <Link href="/dashboard/upload">
            <Card className="h-full min-h-[220px] p-6 border-2 border-dashed border-slate-300 bg-transparent hover:border-primary/50 hover:bg-primary/[0.02] shadow-none flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-700 mb-1">ارفع شابتر يديد</h3>
                <p className="text-sm text-slate-500">وش ناوي تذاكر الحين؟</p>
              </div>
            </Card>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
