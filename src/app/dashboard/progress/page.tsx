"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trophy, TrendingUp, Flame, Brain, Target, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data
const WEEKLY_DATA = [
  { name: "الأحد", lastWeek: 20, thisWeek: 45 },
  { name: "الاثنين", lastWeek: 35, thisWeek: 55 },
  { name: "الثلاثاء", lastWeek: 40, thisWeek: 85 },
  { name: "الأربعاء", lastWeek: 25, thisWeek: 60 },
  { name: "الخميس", lastWeek: 60, thisWeek: 75 },
  { name: "الجمعة", lastWeek: 15, thisWeek: 40 },
  { name: "السبت", lastWeek: 50, thisWeek: 90 },
];

const TOPICS_STRENGTH = [
  { topic: "النمذجة الأولية (Wireframing)", score: 95, status: "strong" },
  { topic: "خوارزميات البحث (A*)", score: 88, status: "strong" },
  { topic: "التفكير التصميمي", score: 82, status: "strong" },
  { topic: "حساب التعقيد الزمني (Big O)", score: 45, status: "weak" },
  { topic: "مبادئ إدارة الأعمال", score: 30, status: "weak" },
];

export default function ProgressPage() {
  // Generate static dummy heatmap data to prevent hydration mismatches
  const heatmapData = [
    0, 1, 0, 0, 2, 4, 3, 0, 0, 1, 3, 4, 4, 2, 0, 1, 2, 3, 0, 0,
    0, 2, 4, 4, 3, 1, 0, 0, 0, 2, 3, 4, 2, 0, 1, 0, 3, 4, 3, 0,
    1, 2, 1, 0, 0, 4, 4, 2, 1, 0, 0, 3, 4, 2, 1, 0, 2, 4, 4, 3
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">وين وصلت؟ وش سويت؟</h1>
          <p className="text-slate-500">هنا نطلع لك الزبدة، كم ذاكرت، وأدائك مقارنة بالأسبوع اللي طاف.</p>
        </div>
      </FadeIn>

      {/* Top Stats */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "ساعات المذاكرة (هالأسبوع)", value: "١٢.٥", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "أيام متواصلة ما وقفت", value: "٧ أيام", icon: Flame, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "معدل الإجابات الصح بالاختبارات", value: "٪٨٤", icon: Target, color: "text-success", bg: "bg-success/10" },
          { label: "المركز بين أصحابك", value: "الثالث", icon: Trophy, color: "text-purple-500", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <StaggerItem key={i}>
            <Card className="p-5 border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Charts */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          {/* Comparison Chart */}
          <FadeIn delay={0.2}>
            <Card className="p-6 border-border shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-slate-900">مقارنة هالأسبوع مع اللي قبله</h3>
                <p className="text-sm text-slate-500">وحش! شديت حيلك هالأسبوع بشكل ملحوظ مقارنة بالأيام اللي راحت.</p>
              </div>
              
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="thisWeek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="lastWeek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}
                    />
                    <Area type="monotone" name="الأسبوع اللي فات" dataKey="lastWeek" stroke="#94A3B8" fillOpacity={1} fill="url(#lastWeek)" />
                    <Area type="monotone" name="هالأسبوع البطل" dataKey="thisWeek" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#thisWeek)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </FadeIn>

          {/* GitHub Style Heatmap */}
          <FadeIn delay={0.3}>
            <Card className="p-6 border-border shadow-sm">
              <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">خريطة الحماس (آخر شهرين)</h3>
                  <p className="text-sm text-slate-500">كل ما كان اللون أغمق، كل ما يعني إنك داعس مذاكرة ذاك اليوم.</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <span>ساحب</span>
                  <div className="w-3 h-3 rounded-sm bg-slate-100" />
                  <div className="w-3 h-3 rounded-sm bg-primary/20" />
                  <div className="w-3 h-3 rounded-sm bg-primary/40" />
                  <div className="w-3 h-3 rounded-sm bg-primary/70" />
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span>داعس</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 justify-start">
                {heatmapData.map((intensity, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-[calc(10%-6px)] sm:w-[calc(5%-6px)] h-8 rounded-md transition-all hover:ring-2 ring-primary/50",
                      intensity === 0 ? "bg-slate-100" :
                      intensity === 1 ? "bg-primary/20" :
                      intensity === 2 ? "bg-primary/40" :
                      intensity === 3 ? "bg-primary/70" : "bg-primary"
                    )}
                    title={`مدى الحماس: ${intensity}`}
                  />
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Right Column: Strengths & Weaknesses */}
        <div className="col-span-1">
          <FadeIn delay={0.4} className="h-full">
            <Card className="p-6 border-border shadow-sm h-full flex flex-col">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-slate-900">أقوى وأضعف مواضيعك</h3>
                <p className="text-sm text-slate-500">جبنا لك هالمعلومات بناءً على كويزاتك اللي اختبرتها.</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <h4 className="flex items-center gap-2 text-sm font-bold text-success mb-3">
                  <Brain className="w-4 h-4" /> اللي فاهمه مضبوط
                </h4>
                <div className="space-y-3 mb-8">
                  {TOPICS_STRENGTH.filter(t => t.status === "strong").map((topic, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-slate-700">{topic.topic}</span>
                        <span className="text-success">{topic.score}٪</span>
                      </div>
                      <Progress value={topic.score} className="h-1.5 bg-success/10 [&>div]:bg-success" />
                    </div>
                  ))}
                </div>

                <h4 className="flex items-center gap-2 text-sm font-bold text-rose-500 mb-3">
                  <AlertCircle className="w-4 h-4" /> اللي جايب فيه العيد
                </h4>
                <div className="space-y-3">
                  {TOPICS_STRENGTH.filter(t => t.status === "weak").map((topic, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-slate-700">{topic.topic}</span>
                        <span className="text-rose-500">{topic.score}٪</span>
                      </div>
                      <Progress value={topic.score} className="h-1.5 bg-rose-500/10 [&>div]:bg-rose-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button className="w-full text-white shadow-sm gap-2">
                  <Target className="w-4 h-4" /> خلنا نقفل نقاط الضعف الحين
                </Button>
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
