/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  CheckCheck,
  Phone,
  Video,
  Smile,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isGroup?: boolean;
}

interface MessageItem {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

const SAMPLE_CHATS: ChatItem[] = [
  {
    id: 'c-1',
    name: 'مجموعة الفصل الدراسي (الصف الثالث)',
    avatar: '📚',
    lastMessage: 'أستاذ الرياضيات: تم إرفاق ملخص القوانين ونماذج الأسئلة',
    time: '12:30 م',
    unreadCount: 3,
    isGroup: true,
  },
  {
    id: 'c-2',
    name: 'معلم الفيزياء والكيمياء',
    avatar: '🔬',
    lastMessage: 'ممتاز يا بني، إجابتك على مسألة الحركة منتظمة وسليمة.',
    time: 'أمس',
  },
  {
    id: 'c-3',
    name: 'أحمد صديقي بالمدرسة',
    avatar: '👨‍🎓',
    lastMessage: 'هل بدأت مراجعة التاريخ اليوم؟',
    time: 'أمس',
  },
  {
    id: 'c-4',
    name: 'جروب المذاكرة والواجبات',
    avatar: '✍️',
    lastMessage: 'سارة: تم حل الواجب كاملاً',
    time: 'الإثنين',
  },
];

const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
  'c-1': [
    { id: 'm-1', sender: 'other', text: 'السلام عليكم يا شباب، لا تنسوا مراجعة درس التفاضل اليوم.', time: '12:15 م' },
    { id: 'm-2', sender: 'me', text: 'وعليكم السلام يا مستر، هل الامتحان سيشمل النهايات؟', time: '12:20 م' },
    { id: 'm-3', sender: 'other', text: 'نعم، النهايات وقواعد الاشتقاق الأساسية.', time: '12:25 م' },
    { id: 'm-4', sender: 'other', text: 'أستاذ الرياضيات: تم إرفاق ملخص القوانين ونماذج الأسئلة', time: '12:30 م' },
  ],
};

export const WhatsAppApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [activeChatId, setActiveChatId] = useState<string>('c-1');
  const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showQR, setShowQR] = useState(false);

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  const activeChat = SAMPLE_CHATS.find((c) => c.id === activeChatId) || SAMPLE_CHATS[0];
  const messages = messagesMap[activeChatId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playTapSound(soundEffects);

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: 'الآن',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setInputText('');

    // Quick automated reply simulation
    setTimeout(() => {
      const replyMsg: MessageItem = {
        id: `m-${Date.now() + 1}`,
        sender: 'other',
        text: 'تم استلام رسالتك في المحادثة بنجاح 👍',
        time: 'الآن',
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), replyMsg],
      }));
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* WhatsApp Header Bar with Official / Tablet View Toggle */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#202c33] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm shadow">
            💬
          </div>
          <span className="font-bold text-sm sm:text-base tracking-wide">WhatsApp</span>
        </div>

        {/* View Mode Toggle: Official Real Web vs Tablet Client */}
        <div className="flex items-center gap-1 bg-[#111b21] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-[#25D366] text-black font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-[#25D366] text-black font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'tablet' && (
            <button
              type="button"
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{showQR ? 'العودة للدردشة' : 'رمز QR للربط'}</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'official' ? (
        /* Official Real WhatsApp Web in Frame */
        <div className="flex-1 w-full h-full relative bg-black">
          <iframe
            src="https://web.whatsapp.com"
            title="WhatsApp Web Official"
            className="w-full h-full border-none bg-white"
            allow="camera; microphone; clipboard-read; clipboard-write; geolocation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : showQR ? (
        /* QR Code Linking View */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto gap-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl">
            <svg viewBox="0 0 200 200" className="w-52 h-52">
              <rect width="200" height="200" fill="#ffffff" />
              {/* Simulated QR Pattern */}
              <rect x="20" y="20" width="50" height="50" fill="#000000" />
              <rect x="30" y="30" width="30" height="30" fill="#ffffff" />
              <rect x="37" y="37" width="16" height="16" fill="#000000" />

              <rect x="130" y="20" width="50" height="50" fill="#000000" />
              <rect x="140" y="30" width="30" height="30" fill="#ffffff" />
              <rect x="147" y="37" width="16" height="16" fill="#000000" />

              <rect x="20" y="130" width="50" height="50" fill="#000000" />
              <rect x="30" y="140" width="30" height="30" fill="#ffffff" />
              <rect x="37" y="147" width="16" height="16" fill="#000000" />

              <rect x="85" y="25" width="25" height="25" fill="#000000" />
              <rect x="90" y="70" width="20" height="50" fill="#000000" />
              <rect x="130" y="90" width="40" height="20" fill="#000000" />
              <rect x="90" y="140" width="30" height="35" fill="#000000" />
              <rect x="140" y="140" width="40" height="40" fill="#000000" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">مسح الرمز للربط بتطبيق WhatsApp</h2>
          <p className="text-xs text-white/60 leading-relaxed">
            افتح تطبيق واتساب على هاتفك، اضغط على النقاط الثلاث ثم «الأجهزة المرتبطة»، وقم بتوجيه الكاميرا إلى الشاشة لربط التابلت.
          </p>
          <button
            type="button"
            onClick={() => setShowQR(false)}
            className="px-6 py-2.5 rounded-full bg-[#25D366] text-black font-bold text-xs hover:bg-[#20bd5a] cursor-pointer"
          >
            المتابعة كطالب
          </button>
        </div>
      ) : (
        /* Split View: Chats List & Active Thread */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Chats Sidebar */}
          <div className="w-80 sm:w-96 bg-[#111b21] border-l border-white/10 flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 bg-[#111b21] border-b border-white/10">
              <div className="flex items-center bg-[#202c33] rounded-xl px-3 py-1.5 text-xs">
                <Search className="w-4 h-4 text-white/40 ml-2" />
                <input
                  type="text"
                  placeholder="بحث في الدردشات والمجموعات..."
                  className="bg-transparent flex-1 text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {SAMPLE_CHATS.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    playTapSound(soundEffects);
                    setActiveChatId(chat.id);
                  }}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                    activeChatId === chat.id ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#202c33] border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-white truncate">
                        {chat.name}
                      </span>
                      <span className="text-[10px] text-white/50">{chat.time}</span>
                    </div>
                    <p className="text-xs text-white/60 truncate mt-0.5">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount && (
                    <div className="w-5 h-5 rounded-full bg-[#25D366] text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Active Chat Pane */}
          <div className="flex-1 flex flex-col bg-[#0b141a] overflow-hidden">
            {/* Chat Top Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#202c33] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                  {activeChat.avatar}
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-sm text-white">{activeChat.name}</span>
                  <span className="text-[11px] text-emerald-400">متصل الآن</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/70">
                <button type="button" className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                  <Video className="w-4 h-4" />
                </button>
                <button type="button" className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'me' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs sm:text-sm shadow-md leading-relaxed ${
                      m.sender === 'me'
                        ? 'bg-[#005c4b] text-white rounded-br-none'
                        : 'bg-[#202c33] text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-white/50 mt-1">
                      <span>{m.time}</span>
                      {m.sender === 'me' && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-[#202c33] flex items-center gap-2 border-t border-white/10 shrink-0"
            >
              <button type="button" className="p-2 text-white/60 hover:text-white cursor-pointer">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-white/60 hover:text-white cursor-pointer">
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب رسالة..."
                className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none text-right"
              />

              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
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
