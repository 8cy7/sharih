"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileText, CheckCircle2, Loader2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { title: "نقرأ الملف", desc: "نستخرج النصوص من الـ PDF" },
  { title: "نقسّم المحتوى", desc: "نرتّب المنهج إلى دروس" },
  { title: "نولّد الدروس", desc: "نحضّر الشرح والتمارين" },
  { title: "خلصنا!", desc: "منهجك جاهز للمذاكرة" },
];

const tips = [
  "كل ما كان الـ PDF واضح، كل ما كانت النتيجة أدق.",
  "ممكن تذاكر من جوالك بنفس الحساب.",
  "الذكاء الاصطناعي يحضّر لك أسئلة تشبه أسئلة الاختبار.",
  "تقدر ترجع للدرس أكثر من مرة بدون ما يتغير.",
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [status, setStatus] = useState<"idle" | "processing">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const startProcessing = async () => {
    console.log("Start processing clicked", { file: file?.name, chapterName, subjectName });
    if (!file || !chapterName || !subjectName) {
      alert("يرجى تعبئة كافة الحقول أولاً!");
      return;
    }
    
    setStatus("processing");
    setProgress(5);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chapterTitle", chapterName);
      formData.append("subjectName", subjectName);
      
      console.log("Sending POST to /api/upload...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const { chapterId } = await res.json();
      
      const pollInterval = setInterval(async () => {
        const pollRes = await fetch(`/api/chapters/${chapterId}`);
        if (pollRes.ok) {
          const data = await pollRes.json();
          const pStatus = data.chapter.processingStatus;
          
          if (pStatus === "extracting") {
            setCurrentStep(0); setProgress(15);
          } else if (pStatus === "splitting") {
            setCurrentStep(1); setProgress(35);
          } else if (pStatus === "processing") {
            setCurrentStep(2); setProgress(65);
          } else if (pStatus === "partial_ready" || pStatus === "complete") {
            setCurrentStep(3); setProgress(100);
            clearInterval(pollInterval);
            setTimeout(() => {
              router.push(`/dashboard/learning-path/${chapterId}`);
            }, 1500);
          } else if (pStatus === "failed") {
            clearInterval(pollInterval);
            alert("عذراً، صارت مشكلة أثناء المعالجة!");
            setStatus("idle");
          }
        }
      }, 3000);
      
    } catch(err: any) {
      console.error(err);
      alert("فشل الرفع: " + (err.message || "خطأ غير معروف"));
      setStatus("idle");
    }
  };

  if (status === "processing") {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <FadeIn className="w-full">
          <Card className="p-8 border-border shadow-md overflow-hidden relative">
            {/* Background Scanner Effect */}
            <motion.div 
              animate={{ top: ["-10%", "110%", "-10%"] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent z-0 pointer-events-none" 
            />
            
            <h2 className="text-2xl font-bold text-center mb-8 relative z-10 text-slate-900">
               {progress === 100 ? "تم تجهيز المنهج! 🚀" : "لحظات ونضبط لك منهجك..."}
            </h2>
            
            <div className="flex gap-10 items-center justify-center mb-6">
              {/* Left Side: File Scanner Animation */}
              <div className="relative w-32 h-40 bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden shrink-0 hidden sm:block z-10 shadow-inner">
                 <div className="absolute top-4 left-4 right-4 h-3 bg-slate-200 rounded" />
                 <div className="absolute top-10 left-4 w-2/3 h-3 bg-slate-200 rounded" />
                 <div className="absolute top-16 left-4 right-4 h-3 bg-slate-200 rounded" />
                 <div className="absolute top-22 left-4 w-1/2 h-3 bg-slate-200 rounded" />
                 <div className="absolute top-28 left-4 right-8 h-3 bg-slate-200 rounded" />
                 <motion.div 
                   animate={{ top: ["0%", "100%", "0%"] }} 
                   transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                   className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
                 />
              </div>

              {/* Right Side: Process Steps */}
              <div className="flex flex-col gap-6 relative before:absolute before:right-6 before:top-4 before:bottom-8 before:w-0.5 before:bg-slate-200 z-10 flex-1">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStep && progress < 100;
                  const isCompleted = idx < currentStep || progress === 100;
                  
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex gap-4 relative z-10"
                    >
                      <motion.div 
                        animate={isCompleted ? { scale: [1, 1.2, 1] } : isActive ? { scale: [1, 1.05, 1] } : {}}
                        transition={isActive ? { repeat: Infinity, duration: 1.5 } : { duration: 0.5 }}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white transition-colors duration-500 shadow-sm",
                          isCompleted ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isActive ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{idx + 1}</span>}
                      </motion.div>
                      <div className="pt-2">
                        <h4 className={cn("font-bold text-lg transition-colors", (isActive || isCompleted) ? "text-slate-900" : "text-slate-400")}>
                          {step.title}
                        </h4>
                        <p className="text-slate-500 text-sm hidden sm:block">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 relative z-10">
              <div className="flex-1 overflow-hidden h-2.5 bg-slate-100 rounded-full shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>
              <span className="font-bold text-slate-700 w-12 text-left" dir="ltr">{progress}%</span>
            </div>

            <div className="mt-8 p-4 bg-primary/[0.03] border border-primary/10 rounded-[12px] flex items-start gap-4 relative z-10 min-h-[100px]">
              <div className="bg-primary/10 p-2 rounded-full shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-primary mb-1">تدري؟</h5>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={tipIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-slate-700 leading-relaxed font-medium"
                  >
                    {tips[tipIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ارمي لنا المذكرة وبنضبطك</h1>
          <p className="text-slate-500">حط الـ PDF حق الشابتر وخل الذكاء الاصطناعي حقنا يكسره لك دروس زي الحلاوة.</p>
        </div>

        <Card className="p-8 border-border shadow-sm">
          <div className="flex flex-col gap-6">
            
            <div className="relative border-2 border-dashed border-slate-300 rounded-[16px] bg-[#F8FAFB] hover:bg-primary/5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 p-10 flex flex-col items-center justify-center text-center cursor-pointer group">
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                onChange={handleFileChange}
              />
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                file ? "bg-primary/20 text-primary" : "bg-slate-200 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {file ? file.name : "اضغط هنا ولا اسحب الملف اللي يغثك وحطه هنا"}
              </h3>
              <p className="text-slate-500 text-sm">أهم شيء يقكون بصيغة PDF وحجمه أقل من ٥٠ ميجا</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">وش اسم المادة؟</label>
                <Input 
                  placeholder="يعني: تفاعل الإنسان والحاسوب" 
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="h-12 bg-[#F8FAFB]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">وش اسم الشابتر؟</label>
                <Input 
                  placeholder="مثال: الشابتر الثالث - التفكير التصميمي" 
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  className="h-12 bg-[#F8FAFB]"
                />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 text-lg"
              disabled={!file || !chapterName || !subjectName || status === "processing"}
              onClick={startProcessing}
            >
              {status === "processing" ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin ml-2" />
                  جاري الرفع...
                </>
              ) : (
                "توكلنا على الله 🚀"
              )}
            </Button>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
