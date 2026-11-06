/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Search,
  CheckCheck,
  Download,
  FileText,
  Volume2,
  Share2,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface TelegramChannel {
  id: string;
  name: string;
  subscribers: string;
  avatar: string;
  color: string;
}

const CHANNELS: TelegramChannel[] = [
  { id: 'ch-1', name: 'قناة بنك المعرفة والمناهج الرسمية', subscribers: '185,000 مشترك', avatar: '📚', color: 'from-blue-600 to-indigo-600' },
  { id: 'ch-2', name: 'ملخصات الثانوية العامة والاختبارات', subscribers: '94,200 مشترك', avatar: '📝', color: 'from-cyan-600 to-blue-500' },
  { id: 'ch-3', name: 'أخبار التابلت والتعليم الذكي', subscribers: '52,000 مشترك', avatar: '📢', color: 'from-amber-600 to-orange-500' },
];

export const TelegramApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [activeChannelId, setActiveChannelId] = useState('ch-1');
  const [inputText, setInputText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 'p-1',
      sender: 'قناة بنك المعرفة والمناهج الرسمية',
      time: '11:00 ص',
      text: '📌 تنبيه لجميع الطلاب:\nتم رفع مذكرات المراجعة النهائية في مواد الفيزياء والرياضيات والتاريخ بصيغة PDF عالية الدقة.\nيمكنكم التحميل المباشر الآن والاطلاع عليها على أجهزة التابلت.',
      hasFile: true,
      fileName: 'ملخص_شامل_للمفاهيم_2026.pdf',
      fileSize: '4.2 MB',
      views: '12.4K',
    },
    {
      id: 'p-2',
      sender: 'قناة بنك المعرفة والمناهج الرسمية',
      time: '12:30 م',
      text: '💡 نصيحة المذاكرة اليومية:\nقم بحل نموذج امتحان واحد يومياً في نفس توقيت الامتحان الفعلي لتعويد الذهن على التركيز وسرعة الحل.',
      views: '9.8K',
    },
  ]);

  const activeChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playTapSound(soundEffects);

    const newPost = {
      id: `p-${Date.now()}`,
      sender: 'أنت',
      time: 'الآن',
      text: inputText.trim(),
      views: '1',
    };

    setPosts((prev) => [...prev, newPost]);
    setInputText('');
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-[#17212b] text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#242f3d] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#229ED9] flex items-center justify-center text-white text-base shadow">
            ✈
          </div>
          <div>
            <span className="font-bold text-base text-white">Telegram</span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#17212b] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-[#229ED9] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-[#229ED9] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>
      </div>

      {viewMode === 'official' ? (
        <div className="flex-1 w-full h-full relative bg-[#17212b]">
          <iframe
            src="https://web.telegram.org"
            title="Telegram Official Web"
            className="w-full h-full border-none bg-[#17212b]"
            allow="camera; microphone; clipboard-read; clipboard-write; geolocation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 sm:w-80 bg-[#17212b] border-l border-white/10 flex flex-col shrink-0">
          <div className="p-3">
            <div className="flex items-center bg-[#242f3d] rounded-xl px-3 py-1.5 text-xs">
              <Search className="w-4 h-4 text-white/40 ml-2" />
              <input
                type="text"
                placeholder="بحث في القنوات والرسائل..."
                className="bg-transparent flex-1 text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {CHANNELS.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveChannelId(ch.id);
                }}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  activeChannelId === ch.id ? 'bg-[#2b5278]' : 'hover:bg-[#202b36]'
                }`}
              >
                <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${ch.color} flex items-center justify-center text-lg shrink-0 shadow`}>
                  {ch.avatar}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <h4 className="font-semibold text-xs text-white truncate">{ch.name}</h4>
                  <span className="text-[11px] text-white/50">{ch.subscribers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Feed */}
        <div className="flex-1 flex flex-col bg-[#0e1621] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="max-w-2xl mx-auto bg-[#182533] border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs text-[#6ab2f2] font-semibold border-b border-white/5 pb-2">
                  <span>{post.sender}</span>
                  <span className="text-white/40 text-[10px]">{post.time}</span>
                </div>

                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{post.text}</p>

                {post.hasFile && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#242f3d] border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-lg bg-blue-500/20 text-[#6ab2f2]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-semibold text-white">{post.fileName}</span>
                        <span className="text-[10px] text-white/50">{post.fileSize}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => playTapSound(soundEffects)}
                      className="p-2 bg-[#2b5278] hover:bg-[#346391] text-white rounded-lg cursor-pointer"
                      title="تحميل"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                  <div className="flex items-center gap-1">
                    <span>👁 {post.views}</span>
                  </div>
                  <button type="button" className="hover:text-white flex items-center gap-1 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="p-3 bg-[#17212b] border-t border-white/10 flex items-center gap-2 shrink-0">
            <button type="button" className="p-2 text-white/50 hover:text-white cursor-pointer">
              <Smile className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 text-white/50 hover:text-white cursor-pointer">
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالة أو تعليق في القناة..."
              className="flex-1 bg-[#242f3d] rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none text-right"
            />

            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#229ED9] hover:bg-[#1f93cb] text-white flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
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
