/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useLauncher } from '../context/LauncherContext';
import { WALLPAPERS } from '../data/wallpapers';
import { Palette, Check, X, Upload, Trash2, Image as ImageIcon, Lock, Home } from 'lucide-react';
import { playTapSound } from '../utils/sound';

export const WallpaperModal: React.FC = () => {
  const {
    isWallpaperModalOpen,
    setWallpaperModalOpen,
    currentWallpaper,
    setWallpaper,
    customHomeWallpaper,
    setCustomHomeWallpaper,
    customLockWallpaper,
    setCustomLockWallpaper,
    soundEffects,
  } = useLauncher();

  const [activeTab, setActiveTab] = useState<'home' | 'lock' | 'presets'>('home');
  const homeFileInputRef = useRef<HTMLInputElement>(null);
  const lockFileInputRef = useRef<HTMLInputElement>(null);

  if (!isWallpaperModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'home' | 'lock') => {
    const file = e.target.files?.[0];
    if (!file) return;

    playTapSound(soundEffects);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'home') {
        setCustomHomeWallpaper(result);
      } else {
        setCustomLockWallpaper(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustom = (target: 'home' | 'lock') => {
    playTapSound(soundEffects);
    if (target === 'home') {
      setCustomHomeWallpaper(null);
    } else {
      setCustomLockWallpaper(null);
    }
  };

  return (
    <div
      onClick={() => setWallpaperModalOpen(false)}
      className="absolute inset-0 z-45 bg-black/60 backdrop-blur-xl flex flex-col justify-end sm:justify-center items-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-5 animate-in slide-in-from-bottom duration-250 max-h-[85vh] overflow-y-auto"
      >
        {/* Title Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">الخلفيات والتخصيص</h2>
              <p className="text-xs text-white/60">رفع صور مخصصة أو اختيار نمط Material You</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWallpaperModalOpen(false)}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Home Screen Wallpaper / Lock Screen Wallpaper / Material You Presets */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'home' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>الشاشة الرئيسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lock')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'lock' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>شاشة القفل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'presets' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>أنماط النظام</span>
          </button>
        </div>

        {/* Tab 1: Home Screen Custom Wallpaper */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">خلفية الشاشة الرئيسية</span>
              {customHomeWallpaper && (
                <button
                  type="button"
                  onClick={() => handleRemoveCustom('home')}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الصورة والرجوع للنمط</span>
                </button>
              )}
            </div>

            {/* Current Preview or Upload Box */}
            {customHomeWallpaper ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video w-full border-2 border-blue-500 shadow-xl">
                <img src={customHomeWallpaper} alt="Custom Home Wallpaper" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => homeFileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    تغيير الصورة
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => homeFileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-400 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-bold text-white block">اضغط هنا لرفع صورة من جهازك</span>
                  <span className="text-[11px] text-white/50">PNG, JPG, WEBP (حجم مثالي 1920 × 1200)</span>
                </div>
              </div>
            )}

            <input
              ref={homeFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'home')}
            />

            <p className="text-[11px] text-white/50 text-center">
              تظهر هذه الصورة في خلفية سطح المكتب لتابلت سامسونج فقط.
            </p>
          </div>
        )}

        {/* Tab 2: Lock Screen Custom Wallpaper */}
        {activeTab === 'lock' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">خلفية شاشة القفل المستقلة</span>
              {customLockWallpaper && (
                <button
                  type="button"
                  onClick={() => handleRemoveCustom('lock')}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الصورة المخصصة</span>
                </button>
              )}
            </div>

            {/* Current Preview or Upload Box */}
            {customLockWallpaper ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video w-full border-2 border-purple-500 shadow-xl">
                <img src={customLockWallpaper} alt="Custom Lock Wallpaper" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => lockFileInputRef.current?.click()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    تغيير صورة شاشة القفل
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => lockFileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-bold text-white block">اضغط لرفع صورة مستقلة لشاشة القفل</span>
                  <span className="text-[11px] text-white/50">يمكنك وضع صورة مختلفة تماماً عن الشاشة الرئيسية</span>
                </div>
              </div>
            )}

            <input
              ref={lockFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'lock')}
            />

            <p className="text-[11px] text-white/50 text-center">
              تظهر هذه الصورة في شاشة القفل مع الساعة الكبيرة وأيقونة القفل.
            </p>
          </div>
        )}

        {/* Tab 3: Material You Presets */}
        {activeTab === 'presets' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs text-white/60">اختر نمطاً لتغيير ألوان النظام وجماليات One UI 7:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper.id === wp.id && !customHomeWallpaper;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => {
                      setWallpaper(wp);
                      setCustomHomeWallpaper(null);
                    }}
                    className={`relative h-28 rounded-2xl overflow-hidden border-2 text-right p-3 flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected ? 'border-blue-400 scale-[1.02] shadow-xl' : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ background: wp.gradient }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold drop-shadow text-white">{wp.nameAr}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full w-max">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wp.theme.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wp.theme.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
