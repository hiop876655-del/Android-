/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Phone, Video, Send, Smile, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface MessengerChat {
  id: string;
  name: string;
  avatar: string;
  time: string;
  lastMessage: string;
}

const CHATS: MessengerChat[] = [
  { id: 'm-1', name: 'أحمد محمود', avatar: '👨‍🎓', time: 'الآن', lastMessage: 'هل استلمت جدول امتحانات العملي؟' },
  { id: 'm-2', name: 'سارة إبراهيم', avatar: '👩‍🎓', time: '10:30 ص', lastMessage: 'شكراً جزيلاً على المساعدة في حل المسألة' },
  { id: 'm-3', name: 'مجموعة دراسة الأحياء', avatar: '🧬', time: 'أمس', lastMessage: 'تمت مشاركة رسم بياني للخلية النباتية' },
];

export const MessengerApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [activeId, setActiveId] = useState('m-1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'other', text: 'السلام عليكم يا صديقي، كيف تسير المذاكرة على التابلت اليوم؟' },
    { id: '2', sender: 'me', text: 'وعليكم السلام! ممتازة جداً، أراجع بنك المعرفة ومذكرات الفيزياء.' },
    { id: '3', sender: 'other', text: 'هل استلمت جدول امتحانات العملي؟' },
  ]);

  const activeChat = CHATS.find((c) => c.id === activeId) || CHATS[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playTapSound(soundEffects);

    const newM = { id: `msg-${Date.now()}`, sender: 'me', text: inputText.trim() };
    setMessages((prev) => [...prev, newM]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now() + 1}`, sender: 'other', text: 'تمام، ربنا يوفقك ويوفقنا جميعاً! 🌟' },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-[#18191a] text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Top Messenger Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#242526] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00B2FF] via-[#006AFF] to-[#9900FF] flex items-center justify-center text-white text-base shadow">
            ⚡
          </div>
          <span className="font-bold text-base">Messenger</span>
        </div>
      </div>

      {/* Split Window */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-72 sm:w-80 bg-[#18191a] border-l border-white/10 flex flex-col shrink-0">
          <div className="p-3">
            <div className="flex items-center bg-[#242526] rounded-full px-3 py-1.5 text-xs">
              <Search className="w-4 h-4 text-white/40 ml-2" />
              <input type="text" placeholder="بحث في Messenger..." className="bg-transparent flex-1 focus:outline-none" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {CHATS.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveId(c.id);
                }}
                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  activeId === c.id ? 'bg-[#2a2b2e]' : 'hover:bg-[#202124]'
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-lg shadow">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-white truncate">{c.name}</span>
                    <span className="text-[10px] text-white/40">{c.time}</span>
                  </div>
                  <p className="text-[11px] text-white/60 truncate mt-0.5">{c.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Chat */}
        <div className="flex-1 flex flex-col bg-[#111213] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#242526] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-base">
                {activeChat.avatar}
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-xs sm:text-sm text-white">{activeChat.name}</span>
                <span className="text-[10px] text-emerald-400">نشط الآن</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#0084FF]">
              <button type="button" className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-xs sm:text-sm leading-relaxed shadow ${
                    m.sender === 'me'
                      ? 'bg-gradient-to-r from-[#0084FF] to-[#0099FF] text-white rounded-br-none'
                      : 'bg-[#303030] text-white rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#242526] flex items-center gap-2 border-t border-white/10 shrink-0">
            <button type="button" className="p-2 text-white/50 hover:text-white">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 bg-[#3a3b3c] rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none text-right"
            />
            <button
              type="submit"
              className="p-2 rounded-full text-[#0084FF] hover:bg-white/10 cursor-pointer"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
