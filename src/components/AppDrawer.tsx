/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLauncher } from '../context/LauncherContext';
import { AppIcon } from './AppIcon';
import { Search, X, ChevronDown } from 'lucide-react';

export const AppDrawer: React.FC = () => {
  const { isDrawerOpen, setDrawerOpen, allApps } = useLauncher();
  const [searchQuery, setSearchQuery] = useState('');
  const [startY, setStartY] = useState<number | null>(null);

  if (!isDrawerOpen) return null;

  // Touch & Mouse swipe down to dismiss handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(y);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY === null) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffY = y - startY; // positive = dragging downwards
    if (diffY > 80) {
      setDrawerOpen(false);
      setStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  // Filter apps based on search query
  const filteredApps = allApps
    .filter((app) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        app.titleAr.toLowerCase().includes(q) ||
        app.titleEn.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.titleAr.localeCompare(b.titleAr, 'ar'));

  return (
    <div
      onClick={() => setDrawerOpen(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      className="absolute inset-0 z-45 bg-slate-950/75 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14 animate-in fade-in zoom-in-95 duration-200 select-none overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Top Search Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl mx-auto flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-5 py-3 shadow-xl backdrop-blur-md"
      >
        <Search className="w-5 h-5 text-white/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث في التطبيقات والألعاب..."
          className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Apps Grid */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto my-6 px-4 py-2"
      >
        {filteredApps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/60">
            <p className="text-base font-medium">لم يتم العثور على تطبيقات تطابق البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-8 gap-x-4 place-items-center max-w-5xl mx-auto">
            {filteredApps.map((app) => (
              <AppIcon key={app.id} app={app} size="normal" showLabel={true} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Dismiss Indicator */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="flex flex-col items-center gap-1 text-white/60 hover:text-white cursor-pointer transition-colors pb-2"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
        <span className="text-xs">المس للإغلاق أو اسحب للأسفل ⬇️</span>
      </div>
    </div>
  );
};
