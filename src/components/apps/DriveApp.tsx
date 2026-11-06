/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Folder, FileText, HardDrive, Search, Plus, MoreVertical, Download } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'doc';
  size: string;
  updated: string;
}

const DRIVE_ITEMS: DriveFile[] = [
  { id: '1', name: 'ملخصات ومذكرات الفصل الأول', type: 'folder', size: '12 ملف', updated: 'أمس' },
  { id: '2', name: 'الكتب المدرسية الرقمية 2026', type: 'folder', size: '8 كتب', updated: 'منذ 3 أيام' },
  { id: '3', name: 'جدول الامتحانات والمراجعة.pdf', type: 'pdf', size: '2.4 MB', updated: 'اليوم' },
  { id: '4', name: 'بحث العلوم: الطاقة المتجددة.docx', type: 'doc', size: '1.1 MB', updated: 'منذ أسبوع' },
  { id: '5', name: 'نماذج اختبارات بنك المعرفة.pdf', type: 'pdf', size: '4.8 MB', updated: '28 أكتوبر' },
];

export const DriveApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [items, setItems] = useState(DRIVE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#181a1b] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Header */}
      <div className="p-3 bg-[#242729] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex-1 max-w-xl mx-auto flex items-center bg-[#181a1b] border border-white/15 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-white/50 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في Drive..."
            className="flex-1 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none text-right"
          />
        </div>
      </div>

      {/* Main Files Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-white/70">
          <span>ملفاتي ومستندات التابلت</span>
          <span>المساحة المستخدمة: 2.1 GB من 15 GB</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => playTapSound(soundEffects)}
              className="bg-[#242729] hover:bg-[#2c3033] border border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all shadow group active:scale-95"
            >
              <div className="flex items-center justify-between">
                {item.type === 'folder' ? (
                  <Folder className="w-9 h-9 text-amber-400 fill-amber-400/20" />
                ) : (
                  <FileText className="w-9 h-9 text-blue-400" />
                )}
                <button type="button" className="text-white/30 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="font-semibold text-xs text-white group-hover:text-blue-400 line-clamp-1">
                  {item.name}
                </span>
                <div className="flex justify-between items-center text-[10px] text-white/40 mt-1">
                  <span>{item.size}</span>
                  <span>{item.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
