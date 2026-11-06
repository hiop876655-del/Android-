/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Plus,
  Copy,
  Check,
  Compass,
  Atom,
  Languages,
  Code,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface GeminiMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
}

const INITIAL_MESSAGES: GeminiMessage[] = [
  {
    id: 'g-0',
    sender: 'gemini',
    text: 'مرحباً! أنا Google Gemini، الذكاء الاصطناعي متعدد الوسائط على تابلت سامسونج جالاكسي A11. كيف يمكنني إلهامك ومساعدتك في واجباتك وبحوثك المدرسية اليوم؟',
  },
];

const PROMPT_CHIPS = [
  { label: 'تفسير ظاهرة الشفق القطبي', text: 'ما هو الشفق القطبي (الأورورا) وكيف يحدث في الغلاف الجوي؟', icon: Compass },
  { label: 'الجدول الدوري والتكافؤ', text: 'كيف أفهم التوزيع الإلكتروني والجدول الدوري بطريقة سهلة ومبسطة؟', icon: Atom },
  { label: 'قواعد التعبير الأدبي', text: 'ما هي أهم النصائح لكتابة موضوع تعبير باللغة العربية يحصل على الدرجة النهائية؟', icon: Languages },
  { label: 'أساسيات لغة Python', text: 'اشرح لي المتغيرات والدوال في بايثون مع كود برمجي بسيط', icon: Code },
];

export const GeminiApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [messages, setMessages] = useState<GeminiMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const generateGeminiResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('شفق') || q.includes('أورورا') || q.includes('aurora')) {
      return `### ظاهرة الشفق القطبي (Aurora Borealis & Australis):\n\nالشفق القطبي هو عرض ضوئي طبيعي ساحر يظهر في سماء المناطق القطبية.\n\n**كيف تحدث الظاهرة علمياً؟**\n1. **الرياح الشمسية:** تطلق الشمس سيلاً من الجسيمات المشحونة (إلكترونات وبروتونات) باتجاه الفضاء.\n2. **المجال المغناطيسي للأرض:** يحمي الأرض ويوجه هذه الجسيمات نحو القطبين المغناطيسيين الشمالي والجنوبي.\n3. **الاصطدام بالغلاف الجوي:** تصطدم الجسيمات المشحونة بذرات الأكسجين والنيتروجين، فتهيجها وتطلق طاقة ضوئية بألوان مذهلة (الأخضر والأحمر والبنفسجي).`;
    }
    if (q.includes('دوري') || q.includes('جدول') || q.includes('كيمياء') || q.includes('توزيع')) {
      return `### فهم الجدول الدوري والتوزيع الإلكتروني:\n\n- **المجموعات (الأعمدة الرأسية):** تحتوي عناصر ذات خواص كيميائية متشابهة بسبب تشابه عدد إلكترونات الغلاف الخارجي (إلكترونات التكافؤ).\n- **الدورات (الصفوف الأفقية):** يمثل رقم الدورة عدد مستويات الطاقة الرئيسية المشغولة بالإلكترونات.\n- **قاعدة التوزيع:** توزع الإلكترونات حسب قاعدة البناء التصاعدي: $1s^2, 2s^2, 2p^6, 3s^2, 3p^6...$\n\n*نصيحة للمذاكرة:* احفظ أول 20 عنصراً بالترتيب، سيسهل عليك حل أي سؤال كيمياء!`;
    }
    if (q.includes('تعبير') || q.includes('أدبي') || q.includes('لغة عربية')) {
      return `### أسرار كتابة موضوع تعبير عربي متكامل:\n\n1. **العناصر والأفكار:** ابدأ بكتابة 4 إلى 5 أفكار رئيسية قبل بدء الصياغة.\n2. **المقدمة الجذابة:** تجنب المقدمات المحفوظة التقليدية، واستعن بآية قرآنية أو حديث شريف أو بيت شعر مناسب للموضوع.\n3. **تقسيم الموضوع لفقرات:** كل فكرة في فقرة مستقلة تبدأ بمسافة بادئة وتنتهي بنقطة.\n4. **الاستشهاد الأدبي:** دعم أفكارك بالشواهد والأمثلة المنطقية.\n5. **الخاتمة المركزة:** تلخيص وجيز للموضوع مع فكرة إيجابية أو دعوة للعمل.`;
    }
    if (q.includes('python') || q.includes('بايثون') || q.includes('برمجة') || q.includes('كود')) {
      return `### أساسيات لغة بايثون للطلاب:\n\nبايثون لغة برمجة قوية وبسيطة تشبه اللغة الإنجليزية الطبيعية.\n\n\`\`\`python\n# مثال: دالة ترحب بالطالب وتحسب متوسط الدرجات\ndef calculate_student_grade(name, marks):\n    average = sum(marks) / len(marks)\n    print(f"مرحباً {name}، معدلك الدراسي هو: {average:.1f}%")\n    return average\n\n# تشغيل الكود\nstudent_marks = [95, 88, 92, 100]\ncalculate_student_grade("خالد", student_marks)\n\`\`\`\n\nتتميز بايثون بأنها اللغة الأولى المستخدمة في تطبيقات الذكاء الاصطناعي وبناء الروبوتات!`;
    }

    return `بناءً على تحليلي لسؤالك حول **"${query}"**:\n\nإليك التفسير العلمي والمعرفي:\n\n- **النقطة الأولى:** هذا المفهوم يعتمد على دراسة وتحليل العوامل الأساسية المرتبطة بالمنهج التعليمي.\n- **النقطة الثانية:** ربط المفاهيم النظرية بالتطبيقات الحياتية المعاصرة يساعد في ترسيخ الفهم.\n- **المراجع المقترحة:** بنك المعرفة المصري وقنوات مدرستنا التعليمية المعتمدة.\n\nهل تود استكشاف تفاصيل إضافية أو حل تدريبات محددة؟ أنا جاهز!`;
  };

  const handleSend = (override?: string) => {
    const text = override || inputText;
    if (!text.trim() || isGenerating) return;
    playTapSound(soundEffects);

    const userMsg: GeminiMessage = {
      id: `gemini-u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      const response = generateGeminiResponse(userMsg.text);
      const geminiMsg: GeminiMessage = {
        id: `gemini-g-${Date.now() + 1}`,
        sender: 'gemini',
        text: response,
      };
      setMessages((prev) => [...prev, geminiMsg]);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = (id: string, text: string) => {
    playTapSound(soundEffects);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-[#131314] text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Gemini Header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#1e1f20] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#131314] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">Gemini</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                1.5 Flash
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Official Real Web vs Tablet Client */}
        <div className="flex items-center gap-1 bg-[#131314] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'tablet' && (
            <button
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setMessages(INITIAL_MESSAGES);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'official' ? (
        /* Official Real Gemini in Frame */
        <div className="flex-1 w-full h-full relative bg-[#131314]">
          <iframe
            src="https://gemini.google.com"
            title="Google Gemini Official Web"
            className="w-full h-full border-none bg-[#131314]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        /* Tablet Fast Client */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl mx-auto ${
              m.sender === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-tr from-blue-600 to-pink-500 text-white'
              }`}
            >
              {m.sender === 'user' ? (
                user?.displayName ? user.displayName[0] : <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div
              className={`rounded-2xl p-4 max-w-[85%] text-sm leading-relaxed shadow-lg ${
                m.sender === 'user'
                  ? 'bg-[#2a2b2e] text-white border border-white/10'
                  : 'bg-[#1e1f20] text-slate-100 border border-white/5'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-right">{m.text}</div>

              {m.sender === 'gemini' && (
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5 text-white/40">
                  <button
                    type="button"
                    onClick={() => handleCopy(m.id, m.text)}
                    className="p-1 hover:text-white rounded transition-colors cursor-pointer"
                    title="نسخ"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 max-w-3xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-pink-500 text-white flex items-center justify-center text-xs shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#1e1f20] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-blue-300">
              <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
              <span>جاري صياغة إجابة Gemini التعليمية...</span>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="max-w-2xl mx-auto pt-4">
            <p className="text-xs text-white/50 text-center mb-3">موضوعات مميزة مقترحة:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROMPT_CHIPS.map((chip, idx) => {
                const IconComp = chip.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip.text)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-blue-300">
                      {chip.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="p-4 bg-[#1e1f20] border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2 bg-[#131314] border border-white/10 focus-within:border-blue-500 rounded-full px-5 py-2.5 shadow-xl transition-all"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اسأل Gemini عن أي درس أو فكرة أو مسألة..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none text-right"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() && !isGenerating
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md active:scale-95'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
          </div>
        </div>
      )}
    </div>
  );
};
