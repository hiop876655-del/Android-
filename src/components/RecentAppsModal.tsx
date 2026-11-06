/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLauncher } from '../context/LauncherContext';
import { AppIcon } from './AppIcon';
import { X, Trash2, Pin, Lock, Play, Search, Sun, Image as ImageIcon, ShoppingBag, MessageSquare, Mail, Calculator as CalcIcon, Clock as ClockIcon, Camera as CameraIcon, ShieldAlert } from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { AppDefinition } from '../types';

export const RecentAppsModal: React.FC = () => {
  const {
    isRecentAppsOpen,
    setRecentAppsOpen,
    recentApps,
    openApp,
    closeApp,
    soundEffects,
  } = useLauncher();

  // Pinned / Locked apps state
  const [pinnedAppIds, setPinnedAppIds] = useState<string[]>([]);
  const [activeDragAppId, setActiveDragAppId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [shakingAppId, setShakingAppId] = useState<string | null>(null);

  if (!isRecentAppsOpen) return null;

  const togglePinApp = (appId: string) => {
    playTapSound(soundEffects);
    setPinnedAppIds((prev) => {
      const isPinned = prev.includes(appId);
      if (isPinned) {
        setNoticeMessage('تم إلغاء تثبيت التطبيق 🔓');
        setTimeout(() => setNoticeMessage(null), 2000);
        return prev.filter((id) => id !== appId);
      } else {
        setNoticeMessage('تم تثبيت التطبيق بنجاح 📌! لن يُغلق بزر إغلاق الكل');
        setTimeout(() => setNoticeMessage(null), 2500);
        return [...prev, appId];
      }
    });
  };

  const handleCloseAllUnpinned = () => {
    playTapSound(soundEffects);
    const unpinnedApps = recentApps.filter((a) => !pinnedAppIds.includes(a.id));
    unpinnedApps.forEach((a) => closeApp(a.id));
  };

  // Card Touch / Drag Handlers
  const handleCardTouchStart = (appId: string, e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setActiveDragAppId(appId);
    setDragStartY(y);
  };

  const handleCardTouchMove = (appId: string, e: React.TouchEvent | React.MouseEvent) => {
    if (activeDragAppId !== appId || dragStartY === null) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffY = y - dragStartY; // negative = dragging UP, positive = dragging DOWN
    setDragOffsetY(diffY);
  };

  const handleCardTouchEnd = (appId: string) => {
    if (activeDragAppId === appId && dragOffsetY !== 0) {
      // Swipe UP -> Close App (if not pinned)
      if (dragOffsetY < -70) {
        if (pinnedAppIds.includes(appId)) {
          setShakingAppId(appId);
          setNoticeMessage('التطبيق مثبت 📌! اسحبه للأسفل أولاً لإلغاء التثبيت');
          setTimeout(() => {
            setShakingAppId(null);
            setNoticeMessage(null);
          }, 2000);
        } else {
          playTapSound(soundEffects);
          closeApp(appId);
        }
      }
      // Swipe DOWN -> Toggle Pin / Lock App 📌
      else if (dragOffsetY > 70) {
        togglePinApp(appId);
      }
    }

    setActiveDragAppId(null);
    setDragStartY(null);
    setDragOffsetY(0);
  };

  // Render Realistic Preview per App Type
  const renderAppPreviewContent = (app: AppDefinition) => {
    switch (app.id) {
      case 'settings':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-3 flex flex-col gap-2 text-right text-[11px] text-white/80 select-none pointer-events-none">
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
              <span>شاشة القفل والأمان</span>
              <Lock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
              <span>السطوع والشبكة</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
              <span>أصوات One UI 7</span>
              <div className="w-6 h-3 bg-blue-500 rounded-full" />
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 grid grid-cols-2 gap-1.5 pointer-events-none">
            <div className="bg-rose-500/30 rounded-lg flex items-center justify-center text-rose-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="bg-blue-500/30 rounded-lg flex items-center justify-center text-blue-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="bg-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="bg-amber-500/30 rounded-lg flex items-center justify-center text-amber-300">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 flex flex-col gap-2 text-right text-[10px] pointer-events-none">
            <div className="bg-blue-600/30 border border-blue-500/30 p-2 rounded-lg flex items-center justify-between">
              <span className="font-bold text-white">تطبيقات الويب والألعاب</span>
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
              <span>ChatGPT</span>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">تثبيت</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg">
              <span>الشطرنج الاحترافي</span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full">تشغيل</span>
            </div>
          </div>
        );

      case 'youtube':
        return (
          <div className="w-full h-full bg-slate-950 rounded-xl p-2 flex flex-col gap-2 pointer-events-none">
            <div className="w-full h-24 bg-red-950/60 border border-red-500/30 rounded-lg flex items-center justify-center text-red-500">
              <Play className="w-8 h-8 fill-red-500" />
            </div>
            <div className="text-right px-1">
              <span className="font-bold text-[11px] text-white block truncate">يوتيوب - بث مباشر وثائقي</span>
              <span className="text-[9px] text-white/50 block">1.2 مليون مشاهدة • قناة مصر</span>
            </div>
          </div>
        );

      case 'google':
      case 'chrome':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 flex flex-col gap-2 pointer-events-none">
            <div className="w-full bg-white/10 p-2 rounded-xl flex items-center gap-2 text-[10px] text-white/70">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>البحث في Google...</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg text-right text-[10px] flex flex-col gap-1">
              <span className="text-blue-400 font-bold">المعرفة والعلوم مصر</span>
              <span className="text-white/50 text-[9px] line-clamp-2">نتائج البحث المباشرة والمعتمدة للطلاب والمعلمين...</span>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 flex flex-col justify-between font-mono text-white pointer-events-none">
            <div className="text-right text-base font-bold bg-black/40 p-2 rounded-lg">
              1,450 + 850 = 2,300
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold">
              <span className="bg-white/10 p-1 rounded">7</span>
              <span className="bg-white/10 p-1 rounded">8</span>
              <span className="bg-white/10 p-1 rounded">9</span>
              <span className="bg-emerald-600 p-1 rounded">÷</span>
              <span className="bg-white/10 p-1 rounded">4</span>
              <span className="bg-white/10 p-1 rounded">5</span>
              <span className="bg-white/10 p-1 rounded">6</span>
              <span className="bg-emerald-600 p-1 rounded">×</span>
            </div>
          </div>
        );

      case 'clock':
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <ClockIcon className="w-12 h-12 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-white font-sans">تنبيه الساعة والساعة العالمية</span>
          </div>
        );

      case 'camera':
        return (
          <div className="w-full h-full bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-between pointer-events-none border border-white/10">
            <span className="text-[10px] text-white/50">كاميرا HD تابلت سامسونج</span>
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-red-600 shadow-lg">
              <CameraIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-white/40">صورة عريضة 16:9</span>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 pointer-events-none">
            <span className="text-xs font-bold text-white">{app.titleAr}</span>
            <span className="text-[10px] text-white/50">نافذة التطبيق النشط</span>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => setRecentAppsOpen(false)}
      className="absolute inset-0 z-45 bg-black/70 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-200 overflow-hidden"
      dir="rtl"
    >
      {/* Notice Message Banner */}
      {noticeMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-2xl animate-bounce">
          {noticeMessage}
        </div>
      )}

      {/* Main Apps Switcher Deck */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        {recentApps.length === 0 ? (
          <div className="text-white/60 text-center flex flex-col items-center gap-3">
            <p className="text-lg font-bold">لا توجد تطبيقات مفتوحة مؤخراً</p>
            <p className="text-xs text-white/40">افتح أي تطبيق لتجده هنا في قائمة المهام الأخيرة</p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-6 overflow-x-auto py-8 px-4 snap-x no-scrollbar">
            {recentApps.map((app) => {
              const isPinned = pinnedAppIds.includes(app.id);
              const isDragging = activeDragAppId === app.id;
              const currentOffsetY = isDragging ? dragOffsetY : 0;
              const isShaking = shakingAppId === app.id;

              return (
                <div
                  key={app.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openApp(app.id);
                  }}
                  onTouchStart={(e) => handleCardTouchStart(app.id, e)}
                  onTouchMove={(e) => handleCardTouchMove(app.id, e)}
                  onTouchEnd={() => handleCardTouchEnd(app.id)}
                  onMouseDown={(e) => handleCardTouchStart(app.id, e)}
                  onMouseMove={(e) => handleCardTouchMove(app.id, e)}
                  onMouseUp={() => handleCardTouchEnd(app.id)}
                  style={{
                    transform: `translateY(${currentOffsetY}px)`,
                  }}
                  className={`relative w-64 sm:w-72 md:w-80 h-96 sm:h-[420px] bg-slate-900/90 border rounded-3xl p-4 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing transition-transform duration-100 group snap-center shrink-0 ${
                    isPinned ? 'border-amber-400/80 shadow-amber-500/20' : 'border-white/20'
                  } ${isShaking ? 'animate-shake' : ''}`}
                >
                  {/* Card Header: Real App Icon, Title, Pin Indicator, and Close Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 pointer-events-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center">
                        <AppIcon app={app} size="normal" showLabel={false} />
                      </div>
                      <span className="text-sm font-bold text-white truncate max-w-[120px]">{app.titleAr}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Pin Toggle Button / Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinApp(app.id);
                        }}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                          isPinned ? 'bg-amber-500 text-slate-900 font-bold' : 'text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                        title={isPinned ? 'إلغاء تثبيت التطبيق' : 'تثبيت التطبيق 📌'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>

                      {/* Close Single App Button */}
                      {!isPinned && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTapSound(soundEffects);
                            closeApp(app.id);
                          }}
                          className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="إغلاق التطبيق"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Realistic App Content Preview */}
                  <div className="flex-1 my-3 bg-slate-950/90 rounded-2xl border border-white/10 p-2 overflow-hidden shadow-inner flex items-center justify-center">
                    {renderAppPreviewContent(app)}
                  </div>

                  {/* Card Swipe Hint Footer */}
                  <div className="flex items-center justify-between text-[11px] text-white/60 px-1 font-medium">
                    <span className="text-blue-400">⬆️ اسحب للأعلى للإغلاق</span>
                    <span className="text-amber-400">⬇️ اسحب للأسفل للتثبيت</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Close All Unpinned Apps Button */}
      {recentApps.length > 0 && (
        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAllUnpinned();
            }}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-6 py-2.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>إغلاق الكل</span>
          </button>
        </div>
      )}
    </div>
  );
};
