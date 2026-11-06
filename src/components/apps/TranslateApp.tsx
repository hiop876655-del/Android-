/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeftRight, Volume2, Copy, Check, Sparkles, X } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

const DICTIONARY: Record<string, string> = {
  مرحبا: 'Hello',
  'صباح الخير': 'Good morning',
  شكرا: 'Thank you',
  طالب: 'Student',
  مدرسة: 'School',
  جامعة: 'University',
  كتاب: 'Book',
  'أندرويد 16': 'Android 16',
  سامسونج: 'Samsung',
  مرحبا_بك: 'Welcome to Samsung Galaxy Tab A11',
};

export const TranslateApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [sourceLang, setSourceLang] = useState<'ar' | 'en'>('ar');
  const [inputText, setInputText] = useState('مرحبا بكم في تابلت سامسونج');
  const [translatedText, setTranslatedText] = useState('Welcome to Samsung Galaxy Tab');
  const [copied, setCopied] = useState(false);

  const handleTranslate = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }
    const clean = text.trim();
    if (DICTIONARY[clean]) {
      setTranslatedText(DICTIONARY[clean]);
    } else {
      // Clean fallback transliteration/translation
      if (sourceLang === 'ar') {
        setTranslatedText(`[Translation]: ${text}`);
      } else {
        setTranslatedText(`[ترجمة]: ${text}`);
      }
    }
  };

  const handleSwap = () => {
    playTapSound(soundEffects);
    setSourceLang(sourceLang === 'ar' ? 'en' : 'ar');
    const temp = inputText;
    setInputText(translatedText.replace(/^\[.*?\]:\s*/, ''));
    setTranslatedText(temp);
  };

  const handleSpeak = (text: string, lang: string) => {
    playTapSound(soundEffects);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(utter);
    }
  };

  const handleCopy = () => {
    playTapSound(soundEffects);
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full bg-[#1e1f22] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#2b2d30] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow">
            G
          </div>
          <span className="font-bold text-base">ترجمة Google</span>
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#2b2d30] border-b border-white/5 shrink-0">
        <span className="text-sm font-semibold text-blue-400">
          {sourceLang === 'ar' ? 'العربية' : 'الإنجليزية'}
        </span>

        <button
          type="button"
          onClick={handleSwap}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-transform active:rotate-180"
          title="تبديل اللغات"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <span className="text-sm font-semibold text-blue-400">
          {sourceLang === 'ar' ? 'الإنجليزية' : 'العربية'}
        </span>
      </div>

      {/* Two Translation Panels */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10 overflow-y-auto">
        {/* Source Text Box */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-[#1e1f22]">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-2 text-xs text-white/50">
              <span>النص الأصلي</span>
              {inputText && (
                <button
                  type="button"
                  onClick={() => handleTranslate('')}
                  className="hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => handleTranslate(e.target.value)}
              placeholder="اكتب هنا للترجمة الفورية..."
              className="w-full flex-1 bg-transparent text-lg sm:text-xl text-white placeholder-white/30 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleSpeak(inputText, sourceLang)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="نطق النص"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translated Text Box */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-[#26282c]">
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-white/50 mb-2">الترجمة الفورية</div>
            <div className="text-lg sm:text-xl font-medium text-blue-300 leading-relaxed whitespace-pre-wrap">
              {translatedText || 'الترجمة ستظهر هنا...'}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleSpeak(translatedText, sourceLang === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="نطق الترجمة"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="نسخ الترجمة"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
