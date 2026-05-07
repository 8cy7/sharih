"use client";

import { useState, useEffect } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowLeft, Trophy, ArrowRight, Brain, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [answeredState, setAnsweredState] = useState<"idle" | "correct" | "incorrect">("idle");
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null); // For backend submission results
  
  // Track all user answers
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  useEffect(() => {
     if (lessonId) {
        fetch(`/api/quiz/${lessonId}`)
          .then(res => res.json())
          .then(data => setQuestions(data.questions || []))
          .catch(console.error);
     }
  }, [lessonId]);

  if (questions.length === 0) return <div className="p-20 text-center text-slate-500 font-bold">جاري تحميل الاختبار...</div>;

  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleSelect = (text: string) => {
    if (answeredState !== "idle") return; // locked
    setSelectedOpt(text);
  };

  const handleSubmit = () => {
    if (!selectedOpt || !confidence) return;
    
    // Save to userAnswers list
    const newAnswers = [...userAnswers];
    newAnswers[currentIdx] = { selectedAnswer: selectedOpt, confidence };
    setUserAnswers(newAnswers);

    const isCorrect = selectedOpt === question.correctAnswer;
    if (isCorrect) {
      setAnsweredState("correct");
      setScore(s => s + 1);
    } else {
      setAnsweredState("incorrect");
    }
  };

  const submitResultsToBackend = async () => {
      try {
        const res = await fetch(`/api/quiz/${lessonId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: userAnswers, visitorId: "student-123" })
        });
        const data = await res.json();
        setResultsData(data);
        setShowResults(true);
      } catch (err) {
        console.error(err);
        setShowResults(true); // show anyway
      }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setConfidence(null);
      setAnsweredState("idle");
    } else {
      submitResultsToBackend();
    }
  };

  if (showResults) {
    // If backend graded it, use backend results. Else fallback.
    const percent = resultsData ? resultsData.score : Math.round((score / questions.length) * 100);
    const passed = resultsData ? resultsData.passed : percent >= 80;
    
    const strongTopics = resultsData?.strongTopics || [];
    const weakTopics = resultsData?.weakTopics || [];

    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6">
        <FadeIn className="w-full max-w-lg">
          <Card className="p-8 md:p-10 text-center shadow-lg border-transparent">
            <div className={cn(
              "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm border-4",
              passed ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
            )}>
              {passed ? <Trophy className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {passed ? "كفو والله! عديت الدرس وبيضت الوجه 🚀" : "أفا! يبيلك شطرنج ومراجعة بسيطة شوي"}
            </h1>
            <p className="text-slate-500 mb-8">هاذي زبدة نتيجتك في الدرس</p>
            
            <div className="text-6xl font-black text-slate-900 mb-2" dir="ltr">{percent}%</div>
            
            <div className="bg-slate-50 rounded-xl p-4 my-8 text-right border justify-start flex flex-col items-start w-full">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> تفاصيل وضعك في الاختبار
              </h4>
              <ul className="text-sm space-y-2 w-full text-slate-600 font-medium">
                {strongTopics.length > 0 && (
                  <li className="flex flex-col w-full border-b pb-3">
                    <span className="text-slate-500 mb-1">نقاط القوة عندك:</span>
                    <span className="text-success font-bold text-base leading-relaxed">{strongTopics.join('، ')}</span>
                  </li>
                )}
                {weakTopics.length > 0 && (
                  <li className="flex flex-col w-full pt-2">
                    <span className="text-slate-500 mb-1">نقاط الضعف:</span>
                    <span className="text-warning font-bold text-base leading-relaxed">{weakTopics.join('، ')}</span>
                  </li>
                )}
                {strongTopics.length === 0 && weakTopics.length === 0 && (
                   <li className="flex justify-between w-full pt-1">
                      <span>إجابات صحيحة</span>
                      <span className="text-success">{score} من {questions.length}</span>
                   </li>
                )}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 h-14 shadow-sm" onClick={() => router.push(`/dashboard/lesson/${lessonId}`)}>
                 ارجع للدرس
              </Button>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Quiz Header */}
      <div className="h-16 border-b border-border flex flex-col justify-center px-6 sticky top-0 bg-white z-10 w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between font-bold text-slate-600 text-sm mb-2 mt-4">
          <Link href={`/dashboard/lesson/${lessonId}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
            اطلع من الاختبار الحين
          </Link>
          <div dir="ltr">سؤال {currentIdx + 1} من {questions.length}</div>
        </div>
        <Progress value={progress} className="h-1.5 rounded-none absolute bottom-0 left-0 right-0 bg-slate-100" />
      </div>

      <div className="max-w-2xl mx-auto py-12 px-6 pb-32">
        <FadeIn key={currentIdx}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 mb-10">
            {question.questionText}
          </h2>

          <StaggerContainer className="flex flex-col gap-4">
            {question.options.map((optText: string, idx: number) => {
              const isSelected = selectedOpt === optText;
              let stateClass = "border-border hover:border-primary/50 hover:bg-slate-50";
              const isOptCorrect = optText === question.correctAnswer;
              
              if (answeredState !== "idle") {
                if (isOptCorrect) {
                  stateClass = "border-success bg-success/5 text-slate-900 ring-2 ring-success/20";
                } else if (isSelected && !isOptCorrect) {
                  stateClass = "border-destructive bg-destructive/5 text-slate-900 ring-2 ring-destructive/20";
                } else {
                  stateClass = "opacity-50 border-border bg-white";
                }
              } else if (isSelected) {
                stateClass = "border-primary bg-primary/5 ring-2 ring-primary/20";
              }

              return (
                <StaggerItem key={idx}>
                  <button
                    onClick={() => handleSelect(optText)}
                    disabled={answeredState !== "idle"}
                    className={cn(
                      "w-full text-right p-5 rounded-xl border-2 transition-all outline-none font-medium flex gap-4 text-slate-700",
                      stateClass
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 shrink-0 rounded border-2 flex items-center justify-center font-bold text-sm",
                      answeredState !== "idle" && isOptCorrect ? "bg-success border-success text-white" :
                      answeredState !== "idle" && isSelected && !isOptCorrect ? "bg-destructive border-destructive text-white" :
                      isSelected ? "border-primary text-primary" : "border-slate-300 text-slate-400"
                    )}>
                      {answeredState !== "idle" && isOptCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                       answeredState !== "idle" && isSelected && !isOptCorrect ? <XCircle className="w-5 h-5" /> : (idx + 1)}
                    </div>
                    <span className="mt-0.5 leading-snug">{optText}</span>
                  </button>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Confidence Selector */}
          {answeredState === "idle" && (
            <FadeIn delay={0.4} className="mt-10 p-6 bg-[#F8FAFB] rounded-xl border border-border">
              <h4 className="text-sm font-bold text-slate-500 mb-4 text-center">كم نسبة تأكدك من الإجابة يا وحش؟</h4>
              <div className="flex gap-2">
                {[
                  { id: "sure", label: "متأكد", color: "bg-success/10 text-success hover:bg-success/20 border-success/20" },
                  { id: "unsure", label: "شوي متردد", color: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20" },
                  { id: "guess", label: "تراها حدرة بدرة (تخمين)", color: "bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200" }
                ].map(conf => (
                  <Button
                    key={conf.id}
                    variant="outline"
                    className={cn("flex-1 h-12 shadow-none border max-w-[33%] text-xs md:text-sm whitespace-normal text-center leading-tight", conf.color, confidence === conf.id && "ring-2 ring-offset-1")}
                    onClick={() => setConfidence(conf.id)}
                  >
                    {conf.label}
                  </Button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Feedback */}
          {answeredState !== "idle" && (
            <FadeIn className={cn(
              "mt-8 p-5 rounded-xl border-2 flex gap-4",
              answeredState === "correct" ? "bg-success/5 border-success/30 text-success" : "bg-destructive/5 border-destructive/30 text-destructive"
            )}>
              <div className="shrink-0 mt-0.5">
                {answeredState === "correct" ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className={cn("font-bold text-lg mb-1", answeredState === "correct" ? "text-emerald-900" : "text-red-900")}>
                  {answeredState === "correct" ? "كفو! إجابتك بمحلها" : "أوبس! جبت العيد شوي"}
                </h4>
                <p className={answeredState === "correct" ? "text-emerald-800" : "text-red-800"}>
                  {question.explanationAr}
                </p>
              </div>
            </FadeIn>
          )}

        </FadeIn>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 glassmorphism-bottom z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex justify-end">
          {answeredState === "idle" ? (
            <Button 
              size="lg" 
              className="px-10 h-14 text-lg w-full sm:w-auto shadow-md"
              disabled={!selectedOpt || !confidence}
              onClick={handleSubmit}
            >
              شيّك على إجابتي
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="px-10 h-14 text-lg w-full sm:w-auto shadow-md gap-2"
              onClick={handleNext}
            >
              {currentIdx < questions.length - 1 ? "روّح للسؤال الثاني" : "عطني النتيجة الصدق"}
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
