/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Star, Send, Inbox, PenTool, Search, Trash2, ArrowRight } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface EmailItem {
  id: string;
  sender: string;
  title: string;
  body: string;
  date: string;
  unread: boolean;
  starred?: boolean;
}

const SAMPLE_EMAILS: EmailItem[] = [
  {
    id: '1',
    sender: 'إدارة المدرسة وبنك المعرفة',
    title: 'جدول الحصص الأسبوعي والاختبارات الشهرية',
    body: 'عزيزي الطالب، نود إعلامك بأنه تم تحديث جدول المحاضرات والأنشطة للفصل الدراسي الحالي على تابلت المدرسة.',
    date: '10:45 ص',
    unread: true,
  },
  {
    id: '2',
    sender: 'منصة Google Classroom',
    title: 'تم نشر تكليف جديد في مادة العلوم والفيزياء',
    body: 'قام المعلم بنشر واجب دراسي عن قوانين الحركة وقوة الجاذبية، الموعد النهائي للتسليم يوم الأحد القادم.',
    date: 'أمس',
    unread: false,
  },
  {
    id: '3',
    sender: 'فريق Samsung Galaxy',
    title: 'مرحباً بك في جهاز Samsung Galaxy Tab A11',
    body: 'تم إعداد جهازك بنجاح بنظام Android 16 وواجهة One UI 7 المخصصة للطلاب. نتمنى لك تجربة ممتعة في التعلم.',
    date: '3 نوفمبر',
    unread: false,
  },
];

export const GmailApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTapSound(soundEffects);
    setEmails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const deleteEmail = (id: string) => {
    playTapSound(soundEffects);
    setEmails((prev) => prev.filter((m) => m.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  return (
    <div className="w-full h-full bg-[#1f1f1f] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Search Bar */}
      <div className="p-3 bg-[#2b2b2b] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex-1 max-w-2xl mx-auto flex items-center bg-[#1f1f1f] border border-white/15 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-white/50 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في البريد..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none text-right"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
          {user?.displayName ? user.displayName[0] : 'S'}
        </div>
      </div>

      {/* Main Mail Area */}
      <div className="flex-1 flex overflow-hidden">
        {selectedEmail ? (
          /* View Message */
          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#1a1a1a]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للبريد الوارد</span>
              </button>

              <button
                type="button"
                onClick={() => deleteEmail(selectedEmail.id)}
                className="p-2 text-red-400 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              <h2 className="text-lg font-bold text-white mb-2">{selectedEmail.title}</h2>
              <div className="flex items-center justify-between text-xs text-white/60 mb-6">
                <span className="font-semibold text-white/90">{selectedEmail.sender}</span>
                <span>{selectedEmail.date}</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.body}
              </p>
            </div>
          </div>
        ) : (
          /* Emails List */
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {emails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => {
                  playTapSound(soundEffects);
                  setSelectedEmail(mail);
                }}
                className={`p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors ${
                  mail.unread ? 'bg-white/5 font-semibold' : 'opacity-85'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => toggleStar(mail.id, e)}
                    className="text-white/40 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        mail.starred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>
                  <div className="flex flex-col text-right flex-1 min-w-0">
                    <span className="text-xs text-white/90 truncate">{mail.sender}</span>
                    <span className="text-xs text-white font-medium truncate">{mail.title}</span>
                    <span className="text-[11px] text-white/50 truncate">{mail.body}</span>
                  </div>
                </div>
                <span className="text-[10px] text-white/40 shrink-0">{mail.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
