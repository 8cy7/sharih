"use client";

import { useState, useRef, useEffect } from "react";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, PlayCircle, MessageSquare, Send, CheckCircle2, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"read" | "watch" | "ask">("read");
  const [hasEngaged, setHasEngaged] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  
  useEffect(() => {
    if (activeTab !== "read") setHasEngaged(true);
  }, [activeTab]);

  useEffect(() => {
    if (id) {
       fetch(`/api/lessons/${id}`)
        .then(res => res.json())
        .then(data => setLesson(data))
        .catch(console.error);
    }
  }, [id]);

  if (!lesson) {
    return <div className="p-20 text-center text-slate-500 font-bold">جاري تحميل الدرس...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <FadeIn className="mb-6">
        <div className="flex items-center gap-3 text-primary font-medium mb-3">
          <Link href={`/dashboard/learning-path/${lesson.chapterId}`} className="hover:underline">عودة للمسار</Link>
          <span>/</span>
          <span className="text-slate-500">الدرس {lesson.lessonNumber}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.titleAr}</h1>
      </FadeIn>

      <div className="flex flex-col flex-1 min-h-0 bg-white border border-border shadow-sm rounded-xl overflow-hidden relative">
        <div className="flex px-2 pt-2 border-b border-border bg-[#F8FAFB] shrink-0">
          {[
            { id: "read", label: "اقرا الزبدة", icon: BookOpen },
            { id: "watch", label: "تفرّج المقطع", icon: PlayCircle },
            { id: "ask", label: "اسأل شارح", icon: MessageSquare }
          ].map((tab) => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors outline-none",
                activeTab === tab.id ? "text-primary" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "read" && <ReadTabContent text={lesson.lessonTextAr} onScrollEnd={() => setHasEngaged(true)} />}
          {activeTab === "watch" && <WatchTabContent lesson={lesson} />}
          {activeTab === "ask" && <AskTabContent lessonId={lesson.id} onMessage={() => setHasEngaged(true)} />}
        </div>
      </div>

      <FadeIn className="mt-6 flex justify-end shrink-0 py-2">
        <Button 
          size="lg" 
          className="text-lg px-8 h-14 shadow-md w-full sm:w-auto"
          disabled={!hasEngaged}
          onClick={() => router.push(`/quiz/${lesson.id}`)}
        >
          يلا نختبرك الحين
        </Button>
      </FadeIn>
    </div>
  );
}

function ReadTabContent({ text, onScrollEnd }: { text: string, onScrollEnd: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onScrollEnd();
      }
    };
    contentRef.current?.addEventListener("scroll", handleScroll);
    return () => contentRef.current?.removeEventListener("scroll", handleScroll);
  }, [onScrollEnd]);

  return (
    <div ref={contentRef} className="h-full overflow-y-auto p-6 md:p-12">
      <div className="max-w-[720px] mx-auto prose prose-slate prose-lg rtl:prose-p:leading-8 rtl:mb-8 font-sans" dir="rtl">
        {text ? (
           <ReactMarkdown>{text}</ReactMarkdown>
        ) : (
           <div className="text-[18px] text-slate-700 leading-relaxed font-medium mb-6 whitespace-pre-wrap">المحتوى جاري التوليد...</div>
        )}
        
        <p className="text-[18px] text-slate-500 italic mt-8 text-center pt-8 border-t border-border mt-10">
          (انزل تحت للآخر عشان النظام يحسب لك إنك شفت الصفحة)
        </p>
      </div>
    </div>
  );
}

function WatchTabContent({ lesson }: { lesson: any }) {
  const [showWatchedBtn, setShowWatchedBtn] = useState(true);
  const { videoUrl, audioUrl, sceneConfig } = lesson;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fallback scenes if AI didn't provide enough or missing config
  const rawScenes = Array.isArray(sceneConfig) && sceneConfig.length > 0 ? sceneConfig : [
    { type: "title", title: lesson.titleAr || "مقدمة", subtitle: "جاري تشغيل الصوتيات" },
    { type: "bullets", title: "محتوى الدرس", points: ["النقاط الأساسية", "المفاهيم", "الخلاصة"] }
  ];
  
  // Format the scenes to guarantee a minimum length and layout
  const scenes = rawScenes.map(s => ({
    ...s,
    id: Math.random().toString(36).substr(2, 9)
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentSceneIndex = duration > 0 ? Math.min(Math.floor((currentTime / duration) * scenes.length), scenes.length - 1) : 0;
  const currentScene = scenes[currentSceneIndex];

  const renderScene = (scene: any) => {
    if (!scene) return null;

    if (scene.type === "title" || scene.type === "summary" || scene.type === "quiz_intro") {
       return (
         <motion.div key={scene.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="text-center z-10 w-full px-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">
               {scene.title || scene.text || scene.term || "الدرس"}
            </h2>
            {(scene.subtitle || scene.description) && (
               <p className="text-xl md:text-2xl text-slate-300 font-medium">
                  {scene.subtitle || scene.description}
               </p>
            )}
         </motion.div>
       )
    }

    // List and details format
    return (
      <motion.div key={scene.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="w-full max-w-3xl text-right z-10 px-6">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b-2 border-slate-700/50 pb-4 inline-block drop-shadow">
            {scene.title || scene.term || "نقطة مهمة"}
         </h2>
         <div className="flex flex-col gap-5">
           {(scene.bullets || scene.points || scene.steps || scene.scenario_steps || scene.key_points || scene.left_points || scene.right_points || [scene.definition || scene.example || scene.description || "تفاصيل..."]).map((b: any, i: number) => {
              // Handle strictly formatted arrays: ["Tech", "عربي", "🚀"] or normal strings
              const textContent = Array.isArray(b) ? b.join(" - ") : typeof b === 'object' && b !== null ? JSON.stringify(b) : b;
              return (
                 <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: i * 0.3}} key={i} className="flex items-start gap-5 bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                    <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-medium" dir="auto">{textContent}</p>
                 </motion.div>
              );
           })}
         </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl">
        <div className="relative w-full pb-[56.25%] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden group mb-6 border border-slate-800 ring-4 ring-slate-900/5 ring-offset-2">
          
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            {!videoUrl && !audioUrl ? (
              <p className="text-white text-lg font-bold flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                الفيديو والصوت قيد التوليد... ارجع بعد قليل!
              </p>
            ) : videoUrl ? (
              <video controls src={videoUrl} className="absolute inset-0 w-full h-full object-contain bg-black" />
            ) : (
              <div className="absolute inset-0 flex flex-col w-full h-full">
                 <audio ref={audioRef} src={audioUrl || ""} />
                 
                 {/* Visual Canvas using framer-motion and sceneConfig */}
                 <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
                    
                    <AnimatePresence mode="wait">
                       {renderScene(currentScene)}
                    </AnimatePresence>
                 </div>
                 
                 {/* Video Playback Controls Component */}
                 <div className="h-20 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex items-center px-8 gap-6 z-20">
                    <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shrink-0 shadow-lg shadow-primary/20">
                       {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                    </button>
                    <div className="flex-1 flex flex-col gap-2">
                       <h4 className="text-slate-300 text-sm font-bold truncate pr-2" dir="rtl">{lesson.titleAr}</h4>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer group">
                          <div className="absolute top-0 bottom-0 left-0 bg-primary group-hover:bg-primary/90 transition-all duration-100 ease-linear" style={{ width: `${duration ? (currentTime/duration)*100 : 0}%` }} />
                       </div>
                    </div>
                    <span className="text-slate-400 font-bold font-mono tracking-widest w-16 text-right shrink-0">
                       {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                    </span>
                 </div>
              </div>
            )}
          </div>
        </div>
        
        <FadeIn>
           <Button variant="default" size="lg" className="gap-2 shadow-sm bg-success hover:bg-success/90 w-full mb-8 text-lg h-14" onClick={() => setShowWatchedBtn(false)}>
             <CheckCircle2 className="w-5 h-5" /> 
             شفت الدرس واستفدت!
           </Button>
        </FadeIn>
      </div>
    </div>
  );
}

function AskTabContent({ lessonId, onMessage }: { lessonId: string, onMessage: () => void }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{ role: string, text: string }[]>([
    { role: "ai", text: "يا هلا فيك مع شارح! أنا مبرمج إني أكون فازع لك، أي سؤال يخص هالدرس أنا موجوود!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [msgs]);

  const send = async () => {
    if (!msg.trim() || loading) return;
    const newMsg = msg;
    setMsg("");
    setMsgs(prev => [...prev, { role: "user", text: newMsg }]);
    onMessage();
    setLoading(true);

    try {
      const res = await fetch(`/api/lessons/${lessonId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg })
      });
      
      if (!res.body) throw new Error("No readable stream");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setMsgs(prev => [...prev, { role: "ai", text: "" }]);
      
      let aiFullMsg = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
           if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.substring(6));
                aiFullMsg += data.text;
                // update last message
                setMsgs(prev => {
                   const updated = [...prev];
                   updated[updated.length - 1] = { role: "ai", text: aiFullMsg };
                   return updated;
                });
              } catch(e) {}
           }
        }
      }
    } catch (e) {
      console.error("Streaming failed", e);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFBFA]/50">
      <div className="p-3 bg-secondary/10 border-b border-border flex justify-center sticky top-0 z-10 shrink-0">
        <p className="text-xs font-bold text-secondary flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" />
          أنا هنا فازع لك، فاهم الدرس وأسئلتك في الحفظ والصون!
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex max-w-[80%]", m.role === "user" ? "self-start" : "self-end")}>
            <div className={cn(
              "p-4 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed whitespace-pre-wrap",
              m.role === "user" 
                ? "bg-muted text-slate-800 rounded-tr-sm border border-border/50" 
                : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm ring-1 ring-slate-100 ring-offset-2"
            )}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-border shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          <Input 
            className="flex-1 bg-slate-50 focus-visible:ring-secondary/20 border-slate-200 h-12" 
            placeholder="اسألني عن أي جزئية لحست مخك..." 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading} className="h-12 w-12 rounded-[8px] bg-secondary hover:bg-secondary/90 shrink-0 shadow-sm">
             <Send className="w-5 h-5 rtl:-scale-x-100" />
          </Button>
        </form>
      </div>
    </div>
  );
}
