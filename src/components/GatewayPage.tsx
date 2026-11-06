/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';
import {
  Tablet,
  Play,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Wifi,
  HardDrive,
  Cpu,
  Lock,
  LogOut,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { playTapSound } from '../utils/sound';

export const GatewayPage: React.FC = () => {
  const { user, launchSimulator, exitToLanding, logout, lockType, soundEffects } = useLauncher();

  const handleLaunch = () => {
    playTapSound(soundEffects);
    launchSimulator();
  };

  const handleExit = () => {
    playTapSound(soundEffects);
    exitToLanding();
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between font-sans select-none overflow-x-hidden p-4 sm:p-8"
      dir="rtl"
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={handleExit}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمنصة الرئيسية</span>
        </button>

        <div className="flex items-center gap-2">
          <Tablet className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-tight text-white">بوابة الطالب الذكية</span>
        </div>

        <button
          type="button"
          onClick={() => {
            playTapSound(soundEffects);
            logout();
            exitToLanding();
          }}
          className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>تسجيل خروج</span>
        </button>
      </div>

      {/* Main Gateway Card */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-auto py-8">
        <div className="bg-slate-900/90 border border-white/15 rounded-[36px] p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
          {/* Student Avatar & Welcome */}
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Student'}
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-4 border-blue-400/40 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                {user?.displayName ? user.displayName[0] : 'S'}
              </div>
            )}
            <div className="absolute -bottom-1 -left-1 bg-emerald-500 w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center shadow">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mt-5">
            <span className="text-xs font-semibold px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>جاهز لبدء جلسة التابلت</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
              مرحباً بك، {user?.displayName || 'عزيزي الطالب'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              تم إعداد جهازك اللوحي <span className="text-cyan-400 font-semibold">Samsung Galaxy Tab A11</span> بنجاح، وهو جاهز الآن لفتح شاشة القفل والبدء.
            </p>
          </div>

          {/* Device System Readiness Specs Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
              <Cpu className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-[11px] text-slate-400">نظام التشغيل</span>
              <span className="text-xs font-bold text-white mt-0.5">Android 16</span>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
              <BatteryCharging className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-[11px] text-slate-400">البطارية</span>
              <span className="text-xs font-bold text-white mt-0.5">100% مشحونة</span>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
              <Wifi className="w-5 h-5 text-cyan-400 mb-1" />
              <span className="text-[11px] text-slate-400">الإنترنت</span>
              <span className="text-xs font-bold text-white mt-0.5">5G فائق السرعة</span>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center">
              <Lock className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-[11px] text-slate-400">حماية القفل</span>
              <span className="text-xs font-bold text-white mt-0.5">
                {lockType === 'swipe' ? 'سحب عادي' : lockType === 'pin' ? 'رمز PIN' : lockType === 'pattern' ? 'نمط مؤمن' : 'كلمة مرور'}
              </span>
            </div>
          </div>

          {/* Main Action Launch Button (Directly enters Lock Screen) */}
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-base sm:text-lg shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer group"
          >
            <Play className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>الدخول إلى المحاكي (تشغيل التابلت)</span>
          </button>

          <p className="mt-4 text-[11px] text-slate-400">
            عند الضغط سيتم الانتقال مباشرة إلى شاشة القفل الخاصة بتابلت سامسونج
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-center text-[11px] text-slate-500 pb-2">
        معرّف الطالب: {user?.uid || 'STUDENT-GALAXY-A11'} • Samsung Knox Security Active
      </div>
    </div>
  );
};
