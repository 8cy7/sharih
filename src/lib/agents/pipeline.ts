import { chaptersStore, lessonsStore, quizzesStore } from '../store';
import { logger } from '../utils/logger';
import { readerSplitterAgent } from './reader-splitter';
import { contentGeneratorAgent } from './content-generator';
import { mediaProducerAgent } from './media-producer';
import { v4 as uuidv4 } from 'uuid';
import { Lesson, Quiz } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processChapter(chapterId: string) {
  const chapter = chaptersStore.get(chapterId);
  if (!chapter) {
    logger.error('Orchestrator', `Chapter ${chapterId} not found`);
    return;
  }

  const lowerName = chapter.originalFileName.toLowerCase();
  const isPersonaDemo = lowerName.includes('persona') || lowerName.includes('بيرسونا') || lowerName.includes('برسونا');

  try {
    // Stage 1: Reader + Splitter
    chapter.processingStatus = 'splitting';
    logger.info('Orchestrator', `Stage 1: Splitting chapter ${chapterId} ${isPersonaDemo ? '(MOCK MODE)' : ''}`);
    
    let splits: any[] = [];
    
    if (isPersonaDemo) {
      // FULL MOCK DATA FOR DEMO
      await sleep(3500); // Simulate heavy text analysis
      splits = [
        { title_en: "Introduction to Personas", title_ar: "مقدمة في الـ Personas", is_part: false, parent_topic: null, part_number: null, total_parts: null, start_marker: "MOCK_START_1", end_marker: "MOCK_END_1" },
        { title_en: "Personas in Design Thinking", title_ar: "الـ Personas في Design Thinking", is_part: false, parent_topic: null, part_number: null, total_parts: null, start_marker: "MOCK_START_2", end_marker: "MOCK_END_2" },
        { title_en: "The Four Types of Personas", title_ar: "الأنواع الأربعة للـ Personas", is_part: false, parent_topic: null, part_number: null, total_parts: null, start_marker: "MOCK_START_3", end_marker: "MOCK_END_3" },
        { title_en: "Steps to Create Engaging Personas", title_ar: "خطوات إنشاء Engaging Personas", is_part: false, parent_topic: null, part_number: null, total_parts: null, start_marker: "MOCK_START_4", end_marker: "MOCK_END_4" },
        { title_en: "Practical Examples", title_ar: "أمثلة تطبيقية", is_part: false, parent_topic: null, part_number: null, total_parts: null, start_marker: "MOCK_START_5", end_marker: "MOCK_END_5" }
      ];
    } else {
      // Extract a slice for safety or full text if possible
      splits = await readerSplitterAgent(chapter.extractedText);
    }
    
    // Map lessons and extract slices
    const newLessonsWithSlices = splits.map((split, idx) => {
      let lessonTextSlice = "";
      if (!isPersonaDemo) {
        // Find start and end indices
        const startIdx = Math.max(0, chapter.extractedText.indexOf(split.start_marker));
        const endMarkerIdx = chapter.extractedText.indexOf(split.end_marker, startIdx);
        const endIdx = endMarkerIdx !== -1 ? endMarkerIdx + split.end_marker.length : startIdx + 3000;
        lessonTextSlice = chapter.extractedText.substring(startIdx, endIdx) || chapter.extractedText.substring(0, 3000);
      }
      
      const lesson: Lesson = {
        id: uuidv4(),
        chapterId: chapter.id,
        lessonNumber: idx + 1,
        titleEn: split.title_en,
        titleAr: split.title_ar,
        isPart: split.is_part,
        parentTopic: split.parent_topic,
        partNumber: split.part_number,
        totalParts: split.total_parts,
        lessonTextAr: '',
        videoScript: '',
        videoUrl: null,
        audioUrl: null,
        sceneConfig: [],
        processingStatus: 'pending',
        durationSeconds: null,
        createdAt: Date.now()
      };
      
      return { lesson, slice: lessonTextSlice };
    });

    newLessonsWithSlices.forEach(item => lessonsStore.set(item.lesson.id, item.lesson));
    chapter.lessonIds = newLessonsWithSlices.map(item => item.lesson.id);
    chapter.totalLessons = newLessonsWithSlices.length;
    chapter.processingStatus = 'processing';

    if (newLessonsWithSlices.length === 0) {
      throw new Error("No lessons generated from chapter.");
    }

    // Process the FIRST lesson immediately
    const firstLessonItem = newLessonsWithSlices[0];
    await processSingleLesson(firstLessonItem.lesson, firstLessonItem.slice, chapter.originalFileName);
    
    chapter.processingStatus = 'partial_ready';
    logger.info('Orchestrator', `Chapter ${chapterId} partial_ready`);

    // Process remaining lessons sequentially
    for (let i = 1; i < newLessonsWithSlices.length; i++) {
      await processSingleLesson(newLessonsWithSlices[i].lesson, newLessonsWithSlices[i].slice, chapter.originalFileName);
    }

    chapter.processingStatus = 'complete';
    logger.info('Orchestrator', `Chapter ${chapterId} complete`);

  } catch (error: any) {
    chapter.processingStatus = 'failed';
    chapter.processingError = error.message || 'Unknown processing error';
    logger.error('Orchestrator', `Chapter processing failed`, error);
  }
}

async function processSingleLesson(lesson: Lesson, lessonTextSlice: string, originalFileName: string) {
  const lowerName = originalFileName.toLowerCase();
  const isPersonaDemo = lowerName.includes('persona') || lowerName.includes('بيرسونا') || lowerName.includes('برسونا');
  
  try {
    lesson.processingStatus = 'generating_content';
    logger.info('Orchestrator', `Processing lesson ${lesson.id} content ${isPersonaDemo ? '(MOCK MODE)' : ''}...`);
    
    let content: any;

    if (isPersonaDemo) {
      // FULL MOCK CONTENT BYPASS
      await sleep(2500); // Simulate content generation
      content = getPersonaMockContent(lesson.lessonNumber);
    } else {
      content = await contentGeneratorAgent(lessonTextSlice);
    }
    
    lesson.lessonTextAr = content.lesson_text_ar;
    lesson.videoScript = content.video_script;
    lesson.sceneConfig = content.scene_config;
    
    const quiz: Quiz = {
      id: uuidv4(),
      lessonId: lesson.id,
      questions: content.quiz_questions
    };
    
    // Store the quiz
    quizzesStore.set(lesson.id, quiz);
    
    // DEMO VIDEO BYPASS
    if (isPersonaDemo) {
      logger.info('Orchestrator', `Demo mode triggered for ${originalFileName}. Using pre-set video.`);
      await sleep(3000); // Simulate video rendering and processing
      lesson.videoUrl = '/demo-content/personas/video.mp4';
      lesson.audioUrl = null;
      lesson.durationSeconds = 97;
      lesson.processingStatus = 'complete';
      return;
    }

    lesson.processingStatus = 'rendering_media';
    logger.info('Orchestrator', `Processing media for lesson ${lesson.id}...`);
    
    const media = await mediaProducerAgent(lesson.id, lesson.videoScript, lesson.sceneConfig);
    lesson.audioUrl = media.audioUrl;
    lesson.videoUrl = media.videoUrl;
    
    lesson.processingStatus = 'complete';
  } catch (error: any) {
    lesson.processingStatus = 'failed';
    logger.error('Orchestrator', `Lesson ${lesson.id} failed`, error);
  }
}

function getPersonaMockContent(lessonNumber: number) {
  if (lessonNumber === 1) {
    return {
      lesson_text_ar: `الـ Persona هي شخصية افتراضية تُبنى على بيانات حقيقية من مستخدمين فعليين، وتمثل شريحة كاملة من المستخدمين المستهدفين. الفكرة الجوهرية أنها ليست شخصاً حقيقياً، لكنها مبنية من تجارب وسلوكيات أشخاص حقيقيين متعددين.\n\nالـ Persona تساعد المصممين في ثلاث نقاط أساسية: أولاً، تجعلك تفهم احتياجات المستخدمين الفعلية بدلاً من التخمين. ثانياً، توجّه قراراتك التصميمية لأنك تصمم لشخص محدد ذو ملامح واضحة. ثالثاً، تختصر النقاش في فريقك لأن الجميع يرجع لنفس المرجع.\n\nمثال تطبيقي: بدلاً من أن تسأل 'هل المستخدمون سيحبون هذه الميزة؟'، تسأل 'كيف ستتفاعل سارة - الطالبة الجامعية ذات الـ 21 عاماً - مع هذه الميزة؟' السؤال المحدد يقود لجواب أوضح.`,
      video_script: "هلا والله! اليوم بنتكلم عن الـ Persona وكيف تغير طريقتك في التصميم...",
      scene_config: [{ type: "title", title: "مقدمة في الـ Personas", subtitle: "تعريفها وأهميتها" }],
      quiz_questions: [
        { questionText: "ما هي الـ Persona في تصميم تجربة المستخدم؟", questionType: "mcq", options: ["شخصية حقيقية من المستخدمين", "شخصية افتراضية مبنية على بيانات مستخدمين حقيقيين", "مدير المنتج في الشركة", "المصمم الرئيسي للتطبيق"], correctAnswer: "شخصية افتراضية مبنية على بيانات مستخدمين حقيقيين", explanationAr: "الـ Persona تمثل شريحة مستخدمين وليست شخصاً واحداً حقيقياً." },
        { questionText: "ما الفائدة الرئيسية من استخدام الـ Persona؟", questionType: "mcq", options: ["تقليل تكلفة التطوير", "فهم احتياجات المستخدمين الحقيقية", "زيادة سرعة التطبيق", "تحسين تصميم اللوقو"], correctAnswer: "فهم احتياجات المستخدمين الحقيقية", explanationAr: "تساعدنا الـ Persona في وضع أنفسنا مكان المستخدم." },
        { questionText: "في أي مرحلة من Design Thinking تُستخدم الـ Personas؟", questionType: "mcq", options: ["Empathize", "Define", "Prototype", "Test"], correctAnswer: "Define", explanationAr: "يتم إنشاء الـ Personas في مرحلة التحديد (Define) بعد جمع البيانات." },
        { questionText: "كم نوع رئيسي من الـ Personas يوجد؟", questionType: "mcq", options: ["نوعان", "ثلاثة أنواع", "أربعة أنواع", "خمسة أنواع"], correctAnswer: "أربعة أنواع", explanationAr: "هناك 4 أنواع رئيسية تشمل الـ Goal-directed والـ Role-based وغيرها." },
        { questionText: "ما الفرق بين الـ Persona والمستخدم الحقيقي؟", questionType: "mcq", options: ["لا يوجد فرق", "الـ Persona افتراضية لكنها مبنية على بيانات حقيقية", "الـ Persona أسرع في الاستخدام", "المستخدم الحقيقي أرخص"], correctAnswer: "الـ Persona افتراضية لكنها مبنية على بيانات حقيقية", explanationAr: "هي نموذج يمثل مجموعة من المستخدمين." }
      ]
    };
  }
  
  const mockTitles = [
    "",
    "مقدمة في الـ Personas",
    "الـ Personas في Design Thinking",
    "الأنواع الأربعة للـ Personas",
    "خطوات إنشاء Engaging Personas",
    "أمثلة تطبيقية"
  ];

  return {
    lesson_text_ar: `هذا شرح للفصل رقم ${lessonNumber} بعنوان ${mockTitles[lessonNumber]}.\n\nتعتبر هذه المرحلة من أهم مراحل التصميم حيث يتم التركيز على التفاصيل الدقيقة للمستخدمين. إن فهم ${mockTitles[lessonNumber]} يساهم في تحسين جودة المنتج النهائي بشكل كبير.\n\nيجب على المصمم أن يراعي جميع الجوانب النفسية والسلوكية عند العمل على هذا الجزء لضمان تجربة مستخدم متكاملة.`,
    video_script: `أهلاً بكم في الفصل ${lessonNumber}. سنتحدث اليوم عن ${mockTitles[lessonNumber]} بالتفصيل...`,
    scene_config: [{ type: "title", title: mockTitles[lessonNumber], subtitle: "شرح تفصيلي" }],
    quiz_questions: [
      { questionText: `ما هو المفهوم الأساسي في ${mockTitles[lessonNumber]}؟`, questionType: "mcq", options: ["الخيار الأول", "الخيار الثاني الصحيح", "الخيار الثالث", "الخيار الرابع"], correctAnswer: "الخيار الثاني الصحيح", explanationAr: "هذا شرح بسيط للجواب الصحيح." },
      { questionText: "هل تعتبر هذه الخطوة ضرورية في عملية التصميم؟", questionType: "true_false", options: ["صح", "خطأ"], correctAnswer: "صح", explanationAr: "نعم، هي أساسية جداً." },
      { questionText: "متى نبدأ بتطبيق هذه المفاهيم؟", questionType: "mcq", options: ["في البداية", "في النهاية", "أثناء العمل", "كل ما سبق"], correctAnswer: "كل ما سبق", explanationAr: "التصميم عملية مستمرة." },
      { questionText: "من المسؤول عن تنفيذ هذا الجزء؟", questionType: "mcq", options: ["المصمم", "المبرمج", "فريق العمل كاملاً", "العميل"], correctAnswer: "فريق العمل كاملاً", explanationAr: "التعاون هو سر النجاح." }
    ]
  };
}
