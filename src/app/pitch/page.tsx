"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, FileText, CheckCircle2, PlayCircle, Eye, Sparkles, AlertCircle, Quote } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Cinematic Theme Colors & Styles
const bgDark = "bg-[#060913]";
const cardGlass = "bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl";
const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary";
const glowPrimary = "shadow-[0_0_60px_rgba(37,99,235,0.3)]";

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Advance on Right Arrow, Down Arrow, Space, or Enter
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "Enter") nextSlide();
      // Go back on Left Arrow, Up Arrow, or Backspace
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Backspace") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const SlideWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={cn("relative flex items-center justify-center h-full w-full overflow-hidden text-white", bgDark)}>
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
        {children}
      </div>
    </div>
  );

  const Slide1 = () => (
    <SlideWrapper>
      <div className="text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-10 text-sm text-cyan-300 tracking-widest uppercase font-bold">
          <Sparkles className="w-4 h-4" /> هاكثون التمكين الفكري
        </motion.div>
        
        <div className="overflow-hidden mb-6 relative pb-4">
          <motion.h1 
            initial={{ y: "100%", opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[12rem] font-black leading-none tracking-wide font-arabic relative z-10"
          >
            شَارِح
          </motion.h1>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent blur-3xl -z-10" />
        </div>
        
        <div className="overflow-hidden mt-4">
          <motion.p 
            initial={{ y: "150%", rotate: 2 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-3xl font-medium text-slate-300 max-w-2xl leading-relaxed"
          >
            نكسر جمود المحاضرات ونحوّلها لدروس تفاعلية 
            <span className="font-bold text-white px-2">بالذكاء الاصطناعي</span>
          </motion.p>
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide2 = () => (
    <SlideWrapper>
      <div className="flex flex-col items-center w-full max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-20 text-slate-100 z-20"
        >
          تعرفون هالمعضلة ؟
        </motion.h1>
        
        <div className="relative w-full h-96 mt-10 perspective-1000">
          {[
            { rotate: "-15deg", left: "10%", top: "10%", title: "مذكرة تفاعل الإنسان والحاسوب ١٢٠ صفحة!", opacity: 0.8 },
            { rotate: "8deg", left: "30%", top: "5%", title: "ضياع وقت في محاولة فك رموز الملازم", opacity: 0.6 },
            { rotate: "-5deg", left: "55%", top: "20%", title: "صعوبة استيعاب المناهج الطويلة", opacity: 0.9 },
            { rotate: "20deg", left: "20%", top: "40%", title: "أساليب الحفظ والتلقين بدل الفهم", opacity: 0.5 },
            { rotate: "-10deg", left: "70%", top: "5%", title: "صعوبة تقييم الطالب لمستواه قبل الاختبار", opacity: 0.8 },
            { rotate: "5deg", left: "40%", top: "50%", title: "ندرة الشروحات التفاعلية باللغة العربية", opacity: 0.7 },
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50, rotate: 0 }}
              animate={{ opacity: item.opacity, scale: 1, y: 0, rotate: item.rotate }}
              transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
              key={i} 
              className={cn("absolute p-6 flex flex-col items-center justify-center text-center font-bold text-lg", cardGlass)}
              style={{ left: item.left, top: item.top, width: '320px', height: '140px' }}
            >
              <AlertCircle className="w-8 h-8 mb-3 text-cyan-400 opacity-50" />
              <p className="text-slate-200">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide3 = () => (
    <SlideWrapper>
      <div className="flex flex-col items-center justify-center w-full max-w-6xl">
        <h1 className="text-2xl text-cyan-400 font-bold mb-4 uppercase tracking-wider">بلُغة الأرقام</h1>
        <h2 className="text-6xl font-bold mb-24 text-slate-100">إحصائيات وحقائق</h2>
        
        <div className="grid grid-cols-3 w-full gap-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cn("p-10 flex flex-col items-center rounded-3xl", cardGlass)}>
            <div className="relative mb-8">
              <span className={cn("text-8xl font-black block relative z-10", textGradient)}>x6</span>
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
            <p className="text-xl font-bold text-slate-200 leading-snug">سرعة نسيان المعلومات الملقّنة مقارنة بالتفاعلية</p>
            <p className="text-slate-500 mt-6 text-sm font-bold">دراسات التعلّم التفاعلي</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cn("p-10 flex flex-col items-center rounded-3xl relative overflow-hidden", cardGlass, glowPrimary)}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="relative mb-8">
              <span className={cn("text-8xl font-black block relative z-10", textGradient)}>٧٠٪</span>
              <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full" />
            </div>
            <p className="text-xl font-bold text-slate-200 leading-snug">من الطلاب الجامعيين يعتمدون على الحفظ لاجتياز الاختبار دون الفهم</p>
            <p className="text-slate-500 mt-6 text-sm font-bold">دراسة MIT 2018</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cn("p-10 flex flex-col items-center rounded-3xl", cardGlass)}>
            <div className="relative mb-8">
              <span className={cn("text-8xl font-black block relative z-10 text-slate-300")}>٣<span className="text-4xl text-slate-500 font-medium ml-2">ساعات</span></span>
            </div>
            <p className="text-xl font-bold text-slate-200 leading-snug">الوقت الضائع يومياً في التلخيص ومحاولة فك شفرات السلايدات</p>
            <p className="text-slate-500 mt-6 text-sm font-bold">تقرير DataReportal</p>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide4 = () => (
    <SlideWrapper>
      <div className="flex w-full max-w-6xl items-center gap-24">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <h1 className="text-2xl text-cyan-400 font-bold mb-4 uppercase">سؤال الجمهور المباشر</h1>
          <h2 className="text-5xl font-bold mb-12 text-slate-100 leading-tight">هل تواجه ملل من القراءة المستمرة وتطالب بالتفاعل؟</h2>
          
          <div className="flex flex-col gap-8 text-xl font-medium text-slate-300">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-cyan-400 flex items-center justify-center shrink-0 border border-primary/30 mt-1">1</div>
              <p>هل قمت بشراء ملخصات جاهزة لأنك لا تستطيع استيعاب المادة الأصلية؟</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-cyan-400 flex items-center justify-center shrink-0 border border-primary/30 mt-1">2</div>
              <p>هل تضيع أكثر وقتك في قراءة ما لا يُفيد فعلياً في الاختبارات؟</p>
            </div>
          </div>
          <p className="text-slate-500 mt-16 font-bold text-sm bg-white/5 py-2 px-4 inline-block rounded-full border border-white/5">استبيان أكاديمي شارك فيه ١٢٤ طالب</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-96 h-96 relative flex items-center justify-center">
          {/* Glowing Ring Chart (CSS Graphic) */}
          <div className="absolute inset-0 rounded-full border-[30px] border-white/5" />
          <div className="absolute inset-0 rounded-full border-[30px] border-primary border-t-cyan-400 border-l-cyan-400 rotate-[-45deg] blur-[2px]" />
          <div className="absolute inset-0 rounded-full border-[30px] border-primary border-t-cyan-400 border-l-cyan-400 rotate-[-45deg]" />
          <div className="text-center z-10 bg-[#060913] w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className={cn("text-8xl font-black", textGradient)}>٧١٪</span>
            <span className="text-lg text-slate-400 font-bold mt-2">قالوا نعم!</span>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );

  const Slide5 = () => (
    <SlideWrapper>
      <div className="flex flex-col items-center justify-center w-full max-w-5xl">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold mb-20 text-slate-100">
          في عـالم مثـالي...
        </motion.h1>
        
        <div className="flex flex-col gap-6 w-full text-2xl font-bold">
          {[
            { text: "منصة تبسط المناهج من ملفات PDF الميتة وتحييها.", delay: 0.1 },
            { text: "الذكاء الاصطناعي يقوم بالتلخيص وتحرير مقاطع مرئية بناءً عليها.", delay: 0.2, highlight: true },
            { text: "مدرس آلي شخصي يعينك على كل رد وكل استفسار بلهجتك.", delay: 0.3 },
            { text: "تحمي وقتك كطالب وتركز على المعلومة الخالصة والمفيدة فقط.", delay: 0.4 },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay }}
              className={cn("py-8 px-10 rounded-2xl w-full flex items-center gap-6 transition-all", cardGlass, item.highlight ? "border-cyan-400/50 bg-primary/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : "")}
            >
              <CheckCircle2 className={cn("w-8 h-8 shrink-0", item.highlight ? "text-cyan-400" : "text-slate-500")} />
              <span className={item.highlight ? "text-white" : "text-slate-300"}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide6 = () => (
    <SlideWrapper>
      <div className="flex flex-col items-center w-full max-w-6xl">
        <h1 className="text-6xl font-bold mb-10 text-slate-100">من نحن؟ (رحلة الطالب)</h1>
        <p className="text-2xl text-slate-400 font-medium text-center mb-20 max-w-4xl">
          نهدف من خلال منصة <span className="text-cyan-400 font-bold">شارح</span> إلى حماية الطالب من المعاناة مع المناهج المشتتة، ونؤمن بتمكين الطالب من الوصول للفهم العميق بسهولة عن طريق:
        </p>
        
        <div className="flex items-center justify-center gap-12 w-full relative">
          {/* Animated connection line */}
          <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-white/10 -z-10" />
          <motion.div 
             initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
             className="absolute top-1/2 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent origin-left -z-10 shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
          />
          
          {[
            { step: 1, title: "رفع وتلقيم", desc: "اسحب أي ملف PDF معقد بالمنصة" },
            { step: 2, title: "تحليل وكسر", desc: "الـ AI يفكك النصوص لمفاهيم" },
            { step: 3, title: "تفاعل وتقييم", desc: "دروس مرئية واختبارات تكيفية" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 * (i+1) }}
              className={cn("w-72 h-64 rounded-3xl flex flex-col items-center justify-center text-center p-8 relative group", cardGlass)}
            >
              <div className="absolute -top-6 w-12 h-12 rounded-full bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-xl font-black text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-4 mt-4">{item.title}</h3>
              <p className="text-slate-400 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide7 = () => (
    <SlideWrapper>
      <div className="flex w-full items-center justify-center max-w-6xl gap-20">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <h1 className={cn("text-[8rem] font-black leading-none mb-6", textGradient)}>M V P</h1>
          <h2 className="text-4xl font-bold text-slate-100 mb-8 leading-tight">النظام حيّ ويعمل الآن! 🚀</h2>
          <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed mb-10">
            تم تطوير المنصة بالكامل كـ Web App متجاوب. المنصة تدعم رفع الملفات، المعالجة اللحظية، وتوليد واجهة الدرس والمحادثة الذكية.
          </p>
          <div className="flex gap-4">
            <div className="px-6 py-3 rounded-full bg-success/10 text-success border border-success/20 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> جاهز للعمل
            </div>
            <div className="px-6 py-3 rounded-full bg-primary/10 text-cyan-400 border border-primary/20 font-bold flex items-center gap-2">
              <PlayCircle className="w-5 h-5" /> تفاعل حي
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.2 }} className="w-1/2">
           {/* Cinematic Glass Mockup */}
           <div className={cn("p-2 rounded-[2rem] w-full aspect-[4/3] flex flex-col overflow-hidden relative group", cardGlass)}>
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             {/* Fake browser header */}
             <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-6 gap-2 w-full rounded-t-[1.75rem]">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                 <div className="w-3 h-3 rounded-full bg-success/50" />
               </div>
               <div className="mx-auto w-1/2 h-6 bg-white/5 rounded-md flex items-center justify-center text-[10px] text-white/30 font-mono tracking-widest uppercase">sharih.app</div>
             </div>
             
             {/* Fake App Body */}
             <div className="flex-1 bg-[#0B1120] relative overflow-hidden flex p-4 gap-4">
                <div className="w-3/4 bg-slate-900 rounded-xl border border-white/5 p-4 flex flex-col">
                  <div className="w-full aspect-video bg-black rounded-lg mb-4 flex items-center justify-center border border-white/10 relative overflow-hidden">
                    <PlayCircle className="w-16 h-16 text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </div>
                  <div className="w-1/2 h-6 bg-white/10 rounded mb-2" />
                  <div className="w-full h-4 bg-white/5 rounded mb-2" />
                  <div className="w-5/6 h-4 bg-white/5 rounded" />
                </div>
                <div className="w-1/4 bg-slate-900 rounded-xl border border-white/5 flex flex-col p-3">
                  <div className="w-full h-8 bg-primary/20 rounded-md mb-4 flex items-center justify-center text-xs text-primary font-bold">AI Tutor</div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-white/10 p-2 rounded-lg text-[8px] text-white/70">أهلاً بك! كيف أقدر أساعدك في هذا الدرس؟</div>
                    <div className="bg-primary/30 p-2 rounded-lg text-[8px] text-primary self-end ml-4">لو سمحت اشرح لي المفهوم بشكل أسهل</div>
                  </div>
                </div>
             </div>
           </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );

  const Slide8 = () => (
    <SlideWrapper>
      <div className="flex flex-col items-center justify-center w-full max-w-6xl">
        <h1 className="text-5xl font-bold mb-20 text-slate-100">سواعد "شارح" المخلصة</h1>
        
        <div className="grid grid-cols-3 gap-12 w-full">
          {[
            { name: "عبدالعزيز الفهد", role: "قائد الفريق / مبرمج فل ستاك", tag: "مهندس برمجيات" },
            { name: "عمر الفيفي", role: "ضمان الجودة / UIUX", tag: "مهندس برمجيات" },
            { name: "هاشم المصعبي", role: "محلل أعمال / مطور منتجات", tag: "مهندس برمجيات" },
          ].map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
              className={cn("p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group", cardGlass)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Cinematic Avatar */}
              <div className="w-32 h-32 rounded-full mb-8 relative p-1 bg-gradient-to-br from-primary to-cyan-400">
                <div className="w-full h-full bg-[#0B1120] rounded-full flex items-center justify-center text-4xl font-black text-white/20">
                  {member.name.charAt(0)}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{member.name}</h2>
              <div className="px-3 py-1 bg-white/10 text-cyan-300 text-xs font-bold rounded-full mb-4">{member.tag}</div>
              <p className="text-slate-400 font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );

  const Slide9 = () => (
    <SlideWrapper>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex w-full max-w-5xl items-center justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="text-8xl font-black text-white leading-tight">شـكراً لكم!</h1>
          <p className="text-3xl font-medium text-slate-400">امسح الباركود لتعيش التجربة بنفسك اليوم.</p>
          <div className="inline-block px-6 py-3 rounded-full border border-white/20 bg-white/5 text-cyan-400 font-bold mt-4 w-max">
            #هاكثون_التمكين_الفكري
          </div>
        </div>
        
        <div className={cn("p-6 rounded-[2.5rem] flex flex-col items-center justify-center", cardGlass, glowPrimary)}>
           <div className="w-72 h-72 rounded-[1.5rem] bg-white border-8 border-transparent flex flex-col items-center justify-center text-slate-900 font-black text-2xl gap-4 p-4 relative overflow-hidden group">
             {/* Simple QR Code Art */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUiIGhlaWdodD0iNSIgZmlsbD0iIzA2MDkxMyIvPjwvc3ZnPg==')] opacity-20" />
             <div className="w-16 h-16 bg-primary rounded-xl absolute top-6 left-6" />
             <div className="w-16 h-16 bg-primary rounded-xl absolute top-6 right-6" />
             <div className="w-16 h-16 bg-primary rounded-xl absolute bottom-6 left-6" />
             <div className="relative z-10 px-4 py-2 bg-white rounded-full border-2 border-slate-900 shadow-xl">
               SCAN ME
             </div>
           </div>
        </div>
      </motion.div>
    </SlideWrapper>
  );

  const slides = [
    <Slide1 key={0} />, <Slide2 key={1} />, <Slide3 key={2} />, 
    <Slide4 key={3} />, <Slide5 key={4} />, <Slide6 key={5} />, 
    <Slide7 key={6} />, <Slide8 key={7} />, <Slide9 key={8} />
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-[#060913] flex flex-col print-container" dir="rtl">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        
        .font-arabic { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        
        @media print {
          @page { size: 16in 9in; margin: 0; }
          body, html { margin: 0; padding: 0; width: 16in; height: 9in; overflow: hidden; background: #060913 !important; }
          .print-container { height: 9in; width: 16in; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />
    </div>
  );
}
