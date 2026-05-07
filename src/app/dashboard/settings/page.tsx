"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CreditCard, Sliders, Moon, Sun, Trash2, Bell, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "plan" | "preferences">("preferences");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Settings State
  const [videoSpeed, setVideoSpeed] = useState("1.5x");
  const [quizDiff, setQuizDiff] = useState("medium");
  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState("light");

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Settings Navigation Sidebar */}
      <FadeIn className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">الإعدادات</h1>
        
        {[
          { id: "profile", label: "معلوماتك الشخصية", icon: User },
          { id: "plan", label: "باقتك وفواتيرك", icon: CreditCard },
          { id: "preferences", label: "تفضيلات المذاكرة", icon: Sliders },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-[8px] font-bold text-sm transition-all w-full text-right",
              activeTab === tab.id ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </FadeIn>

      {/* Settings Content Area */}
      <div className="flex-1 w-full max-w-3xl">
        <FadeIn key={activeTab}>
          {activeTab === "preferences" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">تفضيلات المذاكرة والمنصة</h2>
                <p className="text-slate-500 mb-6">اضبط المنصة على المود اللي يريح دماغك ويخليك تركز صح.</p>
              </div>

              {/* Mode Toggle */}
              <Card className="p-6 border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">الوضع الليلي والنهاري (الثيم)</h3>
                  <p className="text-sm text-slate-500">تبي تريح عيونك بالظلام ولا تحب الإضاءة؟</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                  <button 
                    onClick={() => setTheme("light")}
                    className={cn("flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all", theme === "light" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    <Sun className="w-4 h-4" /> نهاري ومصحصح
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={cn("flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all", theme === "dark" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    <Moon className="w-4 h-4" /> ليلي ورايق
                  </button>
                </div>
              </Card>

              {/* Learning Preferences */}
              <Card className="p-6 border-border shadow-sm flex flex-col gap-8">
                {/* Video Speed */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 block">سرعة الفيديوهات الافتراضية</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {["1x", "1.25x", "1.5x", "2x"].map(spd => (
                      <button
                        key={spd}
                        onClick={() => setVideoSpeed(spd)}
                        className={cn(
                          "px-6 py-2 rounded-full font-bold text-sm border-2 transition-all",
                          videoSpeed === spd ? "border-primary bg-primary/10 text-primary" : "border-slate-200 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        {spd} {spd === "1.5x" && <span className="text-[10px] ml-1 bg-primary text-white px-1.5 py-0.5 rounded ml-2 relative -top-0.5">اللي هابين فيه</span>}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">عشان ما تضطر تغير السرعة كل ما تفتح مقطع جديد.</p>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Quiz Difficulty */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 block">مستوى صعوبة الكويزات التلقائي</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {[
                      { id: "easy", label: "أسئلة سطحية وتمشية حال", color: "success" },
                      { id: "medium", label: "متوسطة وتشغل المخ", color: "primary" },
                      { id: "hard", label: "أسئلة تعجيزية (للدوافير)", color: "rose-600" }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        onClick={() => setQuizDiff(diff.id)}
                        className={cn(
                          "p-4 rounded-xl font-bold text-sm border-2 transition-all text-center",
                          quizDiff === diff.id ? `border-${diff.color} bg-${diff.color}/5 text-${diff.color}` : "border-slate-200 text-slate-500"
                        )}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Sounds & Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">أصوات التنبيهات بالكويزات</h3>
                    <p className="text-sm text-slate-500">صوت (كفو!) إذا الإجابة صح، وصوت (بوو) إذا العيد قرّب.</p>
                  </div>
                  <button 
                    onClick={() => setSoundOn(!soundOn)}
                    className={cn(
                      "relative w-14 h-8 rounded-full transition-colors",
                      soundOn ? "bg-success" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                      soundOn ? "left-1" : "right-1"
                    )} />
                  </button>
                </div>
              </Card>

              {/* Danger Zone */}
              <div className="mt-8">
                <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> منطقة الخطر (إياك واللعب هنا)
                </h3>
                <Card className="p-6 border-rose-200/50 bg-rose-50/50 shadow-sm flex flex-col gap-4 items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">حذف الحساب وكل بياناتي</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      هذا الخيار بفرمت حسابك من السيرفر كلياً (موادك، كويزاتك، اشتراكك). ماراح نقدر نرجع لك أي شيء بعد ما تضغط الزر. متأكد بايعها؟
                    </p>
                  </div>
                  
                  {!showDeleteConfirm ? (
                    <Button variant="destructive" className="mt-2 text-white bg-rose-600 hover:bg-rose-700" onClick={() => setShowDeleteConfirm(true)}>
                      إيه متأكد، احذف أبو الحساب
                    </Button>
                  ) : (
                    <div className="mt-2 p-4 bg-white border border-rose-200 rounded-lg w-full flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-200">
                      <p className="font-bold text-rose-600">ترى ما فيه تراجع، فكرت زين؟</p>
                      <div className="flex gap-4 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                          لا أمزح، رجعني!
                        </Button>
                        <Button variant="destructive" className="flex-1 bg-red-600">
                          حذف نهائي 💥
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">معلوماتك الشخصية</h2>
              <Card className="p-6 border-border shadow-sm mb-6">
                <p className="text-slate-500">بيانات الحساب هنا..</p>
              </Card>
            </div>
          )}

          {activeTab === "plan" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">باقتك الحالية وفواتيرك</h2>
              <Card className="p-6 border-primary bg-primary/5 shadow-sm mb-6">
                <h3 className="text-xl font-bold text-primary mb-2">أنت مشترك بباقة: الدافور 🚀</h3>
                <p className="text-slate-600 font-medium">يجدد اشتراكك في 15 مايو القادم. وتقدر ترفع ملفات للسماء بدون ما نوقفك.</p>
              </Card>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
