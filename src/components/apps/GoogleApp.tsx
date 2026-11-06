/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Mic, Camera, Globe, ArrowLeft, ArrowRight, RotateCw, Plus, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

const PRESET_RESULTS: Record<string, SearchResult[]> = {
  default: [
    {
      title: 'بوابة المناهج التعليمية والدروس التفاعلية للطلاب',
      snippet: 'منصة تعليمية شاملة تتيح للطلاب وأولياء الأمور الوصول إلى الكتب الدراسية والامتحانات السابقة وبنك المعرفة.',
      url: 'https://moe.gov.eg/curriculum',
      source: 'وزارة التربية والتعليم',
    },
    {
      title: 'ويكيبيديا، الموسوعة الحرة - الصفحة الرئيسية',
      snippet: 'ويكيبيديا مشروع موسوعة متعددة اللغات تشارك في تأليفها مجتمعات المتطوعين عبر الإنترنت، تغطي العلوم والتاريخ والأدب.',
      url: 'https://ar.wikipedia.org',
      source: 'ar.wikipedia.org',
    },
    {
      title: 'ناشيونال جيوغرافيك - عالم الطبيعة والعلوم والاستكشاف',
      snippet: 'مقالات وأفلام وثائقية موثقة تستكشف عجائب كوكب الأرض والحياة البرية وعلم الفلك والاكتشافات الأثرية الحديثة.',
      url: 'https://nationalgeographic.com/arabic',
      source: 'National Geographic',
    },
    {
      title: 'Khan Academy - دورات مجانية في الرياضيات والعلوم والفيزياء',
      snippet: 'تعلم مجاناً في أي مكان وفي أي وقت مع تمارين تفاعلية وفيديوهات إرشادية في الرياضيات والعلوم والهندسة.',
      url: 'https://ar.khanacademy.org',
      source: 'Khan Academy',
    },
  ],
};

export const GoogleApp: React.FC<{ isChrome?: boolean }> = ({ isChrome = false }) => {
  const { soundEffects, openApp } = useLauncher();
  const [tabs, setTabs] = useState<{ id: string; title: string; url: string }[]>([
    { id: 'tab-1', title: isChrome ? 'Chrome - علامة تبويب جديدة' : 'Google', url: 'https://www.google.com' },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    playTapSound(soundEffects);
    setSubmittedQuery(searchQuery.trim());
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    playTapSound(soundEffects);
    setSearchQuery('');
    setSubmittedQuery('');
    setIsSearching(false);
  };

  const addTab = () => {
    playTapSound(soundEffects);
    const newId = `tab-${Date.now()}`;
    setTabs((prev) => [...prev, { id: newId, title: 'علامة تبويب جديدة', url: 'https://www.google.com' }]);
    setActiveTabId(newId);
    handleClearSearch();
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(soundEffects);
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  return (
    <div className="w-full h-full bg-[#202124] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Chrome Tablet Tabs Bar (Only when launched as Chrome or full tablet browser) */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-[#1f1f1f] border-b border-[#3c4043] overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                playTapSound(soundEffects);
                setActiveTabId(tab.id);
              }}
              className={`flex items-center gap-2 max-w-[200px] px-3.5 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition-colors ${
                activeTabId === tab.id ? 'bg-[#303134] text-white shadow-md' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="w-3.5 h-3.5 shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
              <span className="truncate flex-1 text-right">{submittedQuery || tab.title}</span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => closeTab(tab.id, e)}
                  className="hover:bg-white/20 rounded-full p-0.5 text-white/60 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTab}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="علامة تبويب جديدة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chrome / Google Tablet Address Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#303134] border-b border-[#3c4043] shrink-0">
        <button
          type="button"
          onClick={handleClearSearch}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
          title="الرئيسية"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-[#202124] border border-[#5f6368] rounded-full px-4 py-1.5 focus-within:border-[#8ab4f8]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في Google أو اكتب عنوان موقع..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none text-right px-2"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <Mic className="w-4 h-4 text-white/50 ml-2 hover:text-[#8ab4f8] cursor-pointer" />
          <Camera className="w-4 h-4 text-white/50 ml-2 hover:text-[#8ab4f8] cursor-pointer" />
        </form>
      </div>

      {/* Main Google View (Home or Results) */}
      <div className="flex-1 overflow-y-auto bg-[#202124]">
        {isSearching ? (
          /* Search Results Page */
          <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col gap-6">
            <div className="text-xs text-white/50 pb-2 border-b border-[#3c4043]">
              حوالي 1,840,000 نتيجة لـ "{submittedQuery}" (0.34 ثانية)
            </div>

            {/* Simulated Knowledge Card */}
            <div className="bg-[#303134] border border-[#3c4043] rounded-2xl p-5 shadow-lg flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-[#8ab4f8]">
                <span>معلومات عامة ونتائج سريعة</span>
              </div>
              <h2 className="text-lg font-bold text-white">{submittedQuery}</h2>
              <p className="text-sm text-white/80 leading-relaxed">
                موضوع تعليمي وبحثي موثوق متاح في المصادر العلمية وبنك المعرفة والمنصات التعليمية المعتمدة لطلاب تابلت سامسونج.
              </p>
            </div>

            {/* Result list */}
            <div className="flex flex-col gap-5">
              {PRESET_RESULTS.default.map((res, i) => (
                <div key={i} className="flex flex-col gap-1 text-right">
                  <div className="flex items-center gap-1.5 text-xs text-[#bdc1c6]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{res.source}</span>
                    <span className="text-white/30">•</span>
                    <span className="truncate text-white/40 font-mono text-[11px]" dir="ltr">{res.url}</span>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline"
                  >
                    {res.title}
                  </a>
                  <p className="text-xs sm:text-sm text-[#bdc1c6] leading-relaxed">
                    {res.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Google Home Landing */
          <div className="h-full flex flex-col items-center justify-center p-6 max-w-2xl mx-auto my-auto gap-6 text-center">
            {/* Google Multicolored Big Logo */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 272 92" className="w-56 sm:w-64 drop-shadow-md">
                <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.82 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-13.27-8.24l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.42 0 17.72 4.03 23.35 9.41l-6.55 6.55c-4.03-3.78-9.49-6.64-16.8-6.64-13.61 0-24.36 11.09-24.36 24.7s10.75 24.7 24.36 24.7c8.82 0 13.86-3.53 17.05-6.72 1.76-1.76 2.94-4.28 3.44-7.73H35.29v-3.33z"/>
              </svg>
            </div>

            {/* Big Search Input */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex items-center bg-[#202124] border border-[#5f6368] hover:border-[#70757a] focus-within:border-[#8ab4f8] focus-within:bg-[#303134] rounded-full px-5 py-3 shadow-xl transition-all">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في Google أو اكتب عنوان موقع..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none text-right px-3"
                />
                <Mic className="w-5 h-5 text-[#8ab4f8] cursor-pointer ml-2" />
                <Camera className="w-5 h-5 text-[#8ab4f8] cursor-pointer ml-2" />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  type="submit"
                  className="bg-[#303134] hover:bg-[#3c4043] border border-transparent hover:border-[#5f6368] text-white text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  بحث Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('بنك المعرفة المصري');
                    setSubmittedQuery('بنك المعرفة المصري');
                    setIsSearching(true);
                  }}
                  className="bg-[#303134] hover:bg-[#3c4043] border border-transparent hover:border-[#5f6368] text-white text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  ضربة حظ
                </button>
              </div>
            </form>

            {/* Quick Educational Shortcuts */}
            <div className="grid grid-cols-4 gap-4 mt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ويكيبيديا الموسوعة الحرة');
                  setSubmittedQuery('ويكيبيديا الموسوعة الحرة');
                  setIsSearching(true);
                }}
                className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-2xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#303134] flex items-center justify-center text-white font-bold text-lg">
                  W
                </div>
                <span className="text-xs text-white/80">ويكيبيديا</span>
              </button>

              <button
                type="button"
                onClick={() => openApp('youtube')}
                className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-2xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                  ▶
                </div>
                <span className="text-xs text-white/80">YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => openApp('translate')}
                className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-2xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                  文A
                </div>
                <span className="text-xs text-white/80">الترجمة</span>
              </button>

              <button
                type="button"
                onClick={() => openApp('maps')}
                className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-2xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base">
                  📍
                </div>
                <span className="text-xs text-white/80">الخرائط</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
