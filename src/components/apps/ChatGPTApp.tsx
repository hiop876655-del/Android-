/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Calculator,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-0',
    sender: 'assistant',
    text: 'أهلاً بك! أنا ChatGPT، مساعدك الدراسي الذكي على تابلت سامسونج جالاكسي A11. كيف يمكنني مساعدتك في دراستك أو بحثك اليوم؟',
    timestamp: 'الآن',
  },
];

const PRESET_TOPICS = [
  { title: 'شرح قوانين نيوتن الثلاثة', query: 'اشرح لي قوانين نيوتن للحركة مع أمثلة من واقع الحياة للطلاب', icon: Compass },
  { title: 'حل مسألة تفاضل وتكامل', query: 'كيف أحل مسألة إيجاد نهاية دالة خطوة بخطوة؟', icon: Calculator },
  { title: 'قواعد النحو والإعراب', query: 'لخص لي علامات إعراب الفعل المضارع بالتفصيل مع أمثلة', icon: BookOpen },
  { title: 'كتابة مقال بالإنجليزية', query: 'اكتب لي مقالاً قصيراً ومنظماً باللغة الإنجليزية عن أهمية التكنولوجيا في التعليم', icon: Sparkles },
];

export const ChatGPTApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('نيوتن') || q.includes('فيزياء') || q.includes('حركة')) {
      return `### قوانين نيوتن الثلاثة للحركة:\n\n1. **القانون الأول (قانون القصور الذاتي):**\nالجسم الساكن يبقى ساكناً، والجسم المتحرك يستمر في حركته بسرعة ثابتة وفي خط مستقيم ما لم تؤثر عليه قوة محصلة خارجية.\n*مثال:* اندفاع الركاب للأمام عند توقف الحافلة فجأة.\n\n2. **القانون الثاني:**\nالقوة المحصلة المؤثرة على جسم تساوي كتلته مضروبة في تسارعه ($F = m \\times a$).\n\n3. **القانون الثالث (لكل فعل رد فعل):**\nلكل قوة فعل قوة رد فعل مساوية لها في المقدار ومضادة لها في الاتجاه.\n*مثال:* ارتداد المدفع للخلف عند إطلاق القذيفة.`;
    }
    if (q.includes('تفاضل') || q.includes('تكامل') || q.includes('رياضيات') || q.includes('نهاية')) {
      return `### خطوات حل مسائل النهايات في الرياضيات:\n\n1. **التعويض المباشر:**\nأول خطوة دائماً هي تعويض قيمة $x$ مباشرة في الدالة.\n\n2. **حالة عدم التعيين $(0 / 0)$:**\nإذا نتجت كمية غير معينة، نلجأ إلى:\n- **التحليل إلى عوامل:** مثل الفرق بين مربعين أو مكعبين لاختصار العامل الصفري.\n- **الضرب في المرافق:** في المسائل التي تحتوي على جذور تربيعية.\n- **نظرية لوبيتال أو القانون العام:** نشتق البسط والمقام ثم نعوض مجدداً.\n\nهل لديك مسألة معينة تريد حلها بالتفصيل؟`;
    }
    if (q.includes('نحو') || q.includes('إعراب') || q.includes('مضارع') || q.includes('عربي')) {
      return `### علامات إعراب الفعل المضارع:\n\n1. **الرفع:**\n- بالضمة الظاهرة (مثل: *يَكْتُبُ الطالبُ*).\n- بثبوت النون إذا كان من الأفعال الخمسة (مثل: *يَكْتُبُونَ*).\n\n2. **النصب (إذا سبقته أداة نصب: أن، لن، كي، حتى، لام التعليل):**\n- بالفتحة الظاهرة (مثل: *لنْ يَهْمِلَ*).\n- بحذف النون في الأفعال الخمسة (مثل: *لنْ يَهْمِلُوا*).\n\n3. **الجزم (إذا سبقته أداة جزم: لم، لا الناهية، لام الأمر، أدوات الشرط):**\n- بالسكون للصحيح الآخر (مثل: *لمْ يَكْتُبْ*).\n- بحذف حرف العلة للمعتل الآخر (مثل: *لمْ يَسْعَ*).`;
    }
    if (q.includes('إنجليزي') || q.includes('english') || q.includes('مقال')) {
      return `### The Importance of Technology in Education\n\nTechnology has transformed modern education in remarkable ways. Today, students can access a vast sea of knowledge with a single touch on their tablets.\n\nKey benefits include:\n- **Interactive Learning:** Videos, simulations, and educational platforms make difficult concepts easier to understand.\n- **Self-Paced Study:** Learners can review lessons anytime and test their progress instantly.\n- **Global Collaboration:** Tools like AI and online libraries connect students with worldwide educational resources.\n\nIn conclusion, embracing educational technology empowers students to achieve academic excellence and prepares them for the future workforce.`;
    }

    return `شكراً لسؤالك! بخصوص موضوع **"${query}"**:\n\nهذا الموضوع من المحاور الدراسية الهامة. للتعامل معه بإتقان، يُنصح بالتركيز على النقاط الرئيسية التالية:\n\n1. **المفهوم الأساسي:** فهم التعريفات والمصطلحات الأساسية دون حفظ سطحي.\n2. **التطبيق العملي:** حل نماذج وتدريبات من بنك المعرفة وكتاب المدرسة.\n3. **الربط بين الأفكار:** تنظيم المعلومات في خرائط ذهنية.\n\nيمكنك كتابة أي تفاصيل إضافية أو مسألة محددة وسأقوم بشرحها لك بالتفصيل!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;
    playTapSound(soundEffects);

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'الآن',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(userMsg.text);
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: answer,
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleCopy = (id: string, text: string) => {
    playTapSound(soundEffects);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    playTapSound(soundEffects);
    setMessages(INITIAL_MESSAGES);
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-[#212121] text-slate-100 flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Top Header with Mode Toggle */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#171717] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#10a37f] flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">ChatGPT</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                GPT-4o
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Official Real Web vs Tablet Client */}
        <div className="flex items-center gap-1 bg-[#212121] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-[#10a37f] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-[#10a37f] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'tablet' && (
            <button
              type="button"
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
              title="محادثة جديدة"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'official' ? (
        /* Official Real ChatGPT Web in Frame */
        <div className="flex-1 w-full h-full relative bg-neutral-900">
          <iframe
            src="https://chatgpt.com"
            title="ChatGPT Official Web"
            className="w-full h-full border-none bg-[#212121]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        /* Tablet Fast Client */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl mx-auto ${
              msg.sender === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#10a37f] text-white'
              }`}
            >
              {msg.sender === 'user' ? (
                user?.displayName ? user.displayName[0] : <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`relative rounded-2xl p-4 max-w-[85%] sm:max-w-[80%] text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-[#2f2f2f] text-white border border-white/10'
                  : 'bg-[#1e1e1e] text-slate-100 border border-white/5'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-right">{msg.text}</div>

              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5 text-white/40">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="p-1 hover:text-white rounded transition-colors cursor-pointer"
                    title="نسخ الإجابة"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-3xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-full bg-[#10a37f] text-white flex items-center justify-center text-xs shadow">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {messages.length === 1 && (
          /* Preset Starter Prompts */
          <div className="max-w-2xl mx-auto pt-4">
            <p className="text-xs text-white/50 text-center mb-3">مقترحات أسئلة سريعة للطلاب:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_TOPICS.map((topic, i) => {
                const IconComponent = topic.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(topic.query)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-emerald-300">
                      {topic.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-4 bg-[#171717] border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-3xl mx-auto flex items-center gap-2 bg-[#2f2f2f] border border-white/10 focus-within:border-emerald-500 rounded-2xl px-4 py-2.5 shadow-xl transition-all"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اسأل ChatGPT أي سؤال في المناهج، الرياضيات، العلوم..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none text-right"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() && !isTyping
                ? 'bg-[#10a37f] text-white shadow-md active:scale-95'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
        <p className="text-[10px] text-center text-white/40 mt-2">
          يعمل داخل إطار التابلت • مدعوم بالذكاء الاصطناعي لمساعدة الطلاب في التعليم
        </p>
      </div>
    </div>
      )}
    </div>
  );
};
