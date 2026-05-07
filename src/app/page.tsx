"use client";

import { Navbar } from "@/components/layout/Navbar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  FileText, 
  MessageSquare, 
  PlayCircle, 
  Target 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden border-b border-border bg-slate-50/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0 mix-blend-multiply opacity-60" />

        <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm text-slate-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              أطلقنا البيتا أخيراً!
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6 relative">
              اختصر وقتك،
              <br />
              <div className="relative inline-block mt-3">
                <span className="relative z-10 text-primary">وشارح يعطيك الزبدة</span>
                <div className="absolute bottom-1 left-0 right-0 h-4 bg-secondary/20 -z-10 -rotate-2 scale-105" />
              </div>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-10 leading-relaxed font-medium">
              ارمي مذكراتك وسلايداتك الطويلة علينا! الذكاء الاصطناعي بيستلم منهجك ويكسّره لك لفيديوهات قصيرة تفتح النفس، مع اختبارات ومدرس فازع لك ٢٤ ساعة يجاوبك على أي سؤال.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-[8px] gap-3 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                  يلا نبدأ نذاكر
                  <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl transform rotate-3 scale-105" />
            <Card className="relative bg-white/90 backdrop-blur-sm p-6 border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">وش هو التفكير التصميمي؟</div>
                  <div className="text-sm text-slate-500">تم تجهيز المقطع لك</div>
                </div>
              </div>
              <div className="w-full h-48 bg-slate-100 rounded-xl relative overflow-hidden group border border-slate-200">
                <div className="absolute inset-0 bg-slate-800" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageSquare className="w-4 h-4 text-secondary" />
                  أسئلة على الماشي
                </div>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-success shadow-sm">
                  مضبوط ✓
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-[1280px] w-full mx-auto px-6">
          <FadeIn className="mb-16 md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">مو بس نلخص لك، <br/>احنا <span className="text-primary">نعيد برمجة</span> منهجك</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">كل تول وحركة في شارح ضبطناها عشان نفكك من العُقد اللي تقفل الأخلاق أيام الفاينل والميدتيرم.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            <FadeIn delay={0.1} className="md:col-span-2 relative group">
              <Card className="h-full bg-slate-50/50 border-slate-200 overflow-hidden flex flex-col justify-end p-8 hover:bg-white hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-8 right-8 w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <FileText className="w-6 h-6 text-slate-800" />
                </div>
                <div className="relative z-10 w-2/3">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">نفصفص الملازم فصفصة</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    نظامنا الرهيب مو بس يقرا كلام قراية، يفهم العناوين، والأقسام، والجداول العلة حق الجامعة ويرتبها لك بمسار يمشي معك خطوة بخطوة.
                  </p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2} className="md:col-span-1 group">
              <Card className="h-full bg-primary text-white border-primary overflow-hidden p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
                <PlayCircle className="w-10 h-10 text-white/50 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all" />
                <div>
                  <h3 className="text-xl font-bold mb-2">فيديوهات تفتح النفس</h3>
                  <p className="text-primary-foreground/80 font-medium">
                    نحول الكلام الجامعي الناشف لفيدوهات وصور تدش المخ وتقعد فيه.
                  </p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3} className="md:col-span-1 group">
              <Card className="h-full bg-secondary/5 border-secondary/10 overflow-hidden p-8 flex flex-col justify-between group hover:bg-secondary/10 hover:shadow-xl hover:border-secondary/30 hover:-translate-y-1 transition-all duration-300">
                <MessageSquare className="w-10 h-10 text-secondary group-hover:scale-110 group-hover:-rotate-6 transition-all" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">فازع لك بأي وقت</h3>
                  <p className="text-slate-600 font-medium">
                    مدرس ذكي تسولف معه 24/7 يجاوبك على أسئلتك من نفس منهجك وما بيقصّر معك.
                  </p>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4} className="md:col-span-2 p-0 group">
              <Card className="h-full bg-white border-slate-200 overflow-hidden flex items-center p-8 gap-8 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">نختبرك على قد فهمك</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    عشان ما تذاكر أي كلام وتتوه، النظام بيختبرك بشكل ذكي ويركز على الأشياء اللي دايم تجيب فيها العيد لين ما تضبطها.
                  </p>
                </div>
                <div className="hidden md:flex w-[200px] flex-col gap-3 opacity-60">
                  <div className="h-10 w-full bg-slate-100 rounded-lg flex items-center px-4 border border-slate-200"><div className="w-4 h-4 rounded-full bg-success shrink-0" /></div>
                  <div className="h-10 w-full bg-slate-100 rounded-lg flex items-center px-4 border border-slate-200 border-l-4 border-l-primary shadow-sm"><div className="w-4 h-4 rounded-full bg-slate-300 shrink-0" /></div>
                  <div className="h-10 w-full bg-slate-100 rounded-lg flex items-center px-4 border border-slate-200"><div className="w-4 h-4 rounded-full bg-slate-300 shrink-0" /></div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-slate-900 text-white">
        <div className="max-w-[1280px] w-full mx-auto px-6">
          <FadeIn className="text-center mb-16 md:w-2/3 mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">باقات ما تكسّر الميزانية</h2>
            <p className="text-slate-400 text-lg">ضبطنا لك الباقات اللي تعطيك الخلاصة وتفك أزمتك.</p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <StaggerItem>
              <Card className="p-8 md:p-10 rounded-2xl bg-white/5 border-white/10 text-white backdrop-blur-md">
                <h3 className="text-2xl font-bold mb-2">الطالب العادي</h3>
                <p className="text-slate-400 font-medium mb-8">زين على زين، يمشيك بأوقات الزنقة.</p>
                <div className="mb-6"><span className="text-5xl font-bold">بلاش</span></div>
                <ul className="space-y-4 mb-10 font-medium">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> تقدر ترفع ملفين كل شهر
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> ملخصات نصية بس
                  </li>
                  <li className="flex items-center gap-3 text-white/40 line-through">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> ما فيه فيديوهات للأسف
                  </li>
                </ul>
                <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-0">سجل حساب وخلك جاهز</Button>
              </Card>
            </StaggerItem>

            <StaggerItem className="relative">
              <Card className="p-8 md:p-10 rounded-2xl bg-primary border border-primary shadow-2xl text-white transform md:scale-105">
                <div className="inline-flex py-1 px-3 bg-white/20 rounded-full text-xs font-bold mb-4">اللي الكل هاب فيها</div>
                <h3 className="text-2xl font-bold mb-2">الــدافـــور</h3>
                <p className="text-primary-foreground/80 font-medium mb-8">فللت كل الصلاحيات، اضمن الـ A+</p>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">٤٩</span>
                  <span className="text-primary-foreground/70 font-medium">ريال / عالشهر</span>
                </div>
                <ul className="space-y-4 mb-10 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" /> ارفع ملفات للصبح
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" /> فيديوهات لكل درس ترفعه
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" /> مدرسك الخاص متاح بأي وقت
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white" /> اختبارات تقفل ملف المادة
                  </li>
                </ul>
                <Button className="w-full h-12 bg-white text-primary hover:bg-slate-100 shadow-md">جربها الحين ٧ أيام علينا</Button>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">شارح</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="#" className="hover:text-white transition-colors">عنّا</Link>
            <Link href="#" className="hover:text-white transition-colors">الشروط</Link>
            <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} شارح. كل الحقوق محفوظة لنا.
          </div>
        </div>
      </footer>
    </div>
  );
}
