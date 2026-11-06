/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ExternalLink, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AppDefinition } from '../../types';
import { useLauncher } from '../../context/LauncherContext';
import { playTapSound } from '../../utils/sound';

export const AndroidWebActivity: React.FC<{ app: AppDefinition }> = ({ app }) => {
  const { soundEffects, minimizeToHome } = useLauncher();
  const directUrl = app.webUrl || 'https://www.google.com';

  const handleLaunch = () => {
    playTapSound(soundEffects);
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black pointer-events-none" />

      {/* Main Activity Card */}
      <div className="z-10 w-full max-w-md bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200">
        {/* App Icon */}
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl ${app.iconBg}`}>
          {app.id === 'youtube' && (
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          )}
          {app.id === 'google' && (
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {app.id === 'chrome' && (
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <circle cx="50" cy="50" r="46" fill="#ffffff" />
              <path d="M50 50 L50 4 A46 46 0 0 1 89.8 27 L50 50 Z" fill="#EA4335" />
              <path d="M50 50 L89.8 27 A46 46 0 0 1 50 96 L50 50 Z" fill="#FBBC05" />
              <path d="M50 50 L50 96 A46 46 0 0 1 10.2 27 L50 50 Z" fill="#34A853" />
              <circle cx="50" cy="50" r="22" fill="#ffffff" />
              <circle cx="50" cy="50" r="17" fill="#4285F4" />
            </svg>
          )}
          {!['youtube', 'google', 'chrome'].includes(app.id) && (
            <span className="text-2xl font-bold">{app.titleAr[0]}</span>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-1.5">
          <span>{app.titleAr} الرسمي</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </h2>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>الموقع الرسمي الأصلي المباشر</span>
        </div>

        <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-xs">
          تم تشغيل {app.titleAr} بكامل الميزات والبحث الفعلي وحسابك الشخصي.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3 px-6 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>فتح {app.titleAr} الرسمي الآن</span>
          </button>

          <button
            type="button"
            onClick={minimizeToHome}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium text-xs py-2.5 px-6 rounded-2xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لشاشة التابلت الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
