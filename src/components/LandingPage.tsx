/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';
import {
  Tablet,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  ArrowLeft,
  LogIn,
  UserPlus,
  Play,
  CheckCircle2,
  Lock,
  Cpu,
} from 'lucide-react';
import { playTapSound } from '../utils/sound';

export const LandingPage: React.FC = () => {
  const { user, login, setPlatformView, soundEffects, isLoggingIn } = useLauncher();

  const handleAuthAction = async () => {
    playTapSound(soundEffects);
    if (!user) {
      await login();
    } else {
      setPlatformView('gateway');
    }
  };

  const handleGoToGateway = () => {
    playTapSound(soundEffects);
    setPlatformView('gateway');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Tablet className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">منصة تابلت المستقبل</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Android 16
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Samsung Galaxy Tab A11 • One UI 7 للطلاب</p>
            </div>
          </div>

          {/* User Auth Buttons in Header */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={handleAuthAction}
                  disabled={isLoggingIn}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>تسجيل جديد</span>
                </button>

                <button
                  type="button"
                  onClick={handleAuthAction}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoggingIn ? 'جارِ الدخول...' : 'تسجيل الدخول'}</span>
                </button>
              </>
            ) : (
              /* When logged in: The two buttons merge into one single personalized gateway entry button */
              <button
                type="button"
                onClick={handleGoToGateway}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                    {user.displayName ? user.displayName[0] : 'S'}
                  </div>
                )}
                <span>متابعة كـ {user.displayName} ↗</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-blue-300 text-xs font-medium mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>الجيل الجديد من منصة محاكاة التابلت التعليمي للطلاب</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.15]">
          حوّل متصفحك إلى تابلت{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
            سامسونج جالاكسي A11
          </span>{' '}
          التعليمي الحقيقي
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
          نظام أندرويد 16 مع واجهة One UI 7 كاملة داخل متصفحك. تصفح يوتيوب، وابحث في جوجل، واستعن بـ ChatGPT و Gemini، واستخدم واتساب وتليجرام وتطبيقات الدراسة بحرية وأمان تام داخل فريم التابلت.
        </p>

        {/* Hero CTA Box */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          {!user ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleAuthAction}
                disabled={isLoggingIn}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-2xl shadow-blue-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>{isLoggingIn ? 'جارِ الدخول...' : 'تسجيل الدخول بحساب Google'}</span>
              </button>

              <button
                type="button"
                onClick={handleAuthAction}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-semibold text-sm transition-colors cursor-pointer"
              >
                تسجيل جديد
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoToGateway}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-2xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>متابعة إلى بوابة التابلت كـ {user.displayName}</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Trust & Specs tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تسجيل آمن عبر Google</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>واجهة One UI 7 عربية 100%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>قفل PIN ونمط وخلفيات مخصصة</span>
          </div>
        </div>

        {/* Tablet Mockup Interactive Preview */}
        <div className="mt-14 w-full max-w-5xl rounded-[36px] p-2 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-transparent border border-white/10 shadow-2xl overflow-hidden">
          <div className="relative rounded-[28px] overflow-hidden bg-slate-900 border border-white/5 aspect-[16/10] flex flex-col justify-between p-6 sm:p-10 text-right group">
            {/* Ambient Background Gradient of Tablet */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-950/60 to-purple-950/40 pointer-events-none" />

            {/* Simulated Tablet Status Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold">18:00</span>
                <span>• تابلت سامسونج للطلاب</span>
              </div>
              <div className="flex items-center gap-2">
                <span>100% 🔋</span>
                <span>5G 📶</span>
              </div>
            </div>

            {/* Simulated Desktop Center with App Icons */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-6">
              <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
                <div className="text-3xl sm:text-5xl font-light text-white font-sans">18:00</div>
                <div className="text-xs text-white/70 mt-1">الأربعاء، 5 نوفمبر • تابلت مدرسي معتمد</div>
              </div>

              {/* Grid of Apps Preview */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 place-items-center max-w-2xl">
                {[
                  { name: 'جوجل', color: 'bg-white text-slate-900', icon: '🔍' },
                  { name: 'يوتيوب', color: 'bg-red-600 text-white', icon: '▶' },
                  { name: 'ChatGPT', color: 'bg-emerald-600 text-white', icon: '⚡' },
                  { name: 'Gemini', color: 'bg-indigo-600 text-white', icon: '✨' },
                  { name: 'واتساب', color: 'bg-green-500 text-white', icon: '💬' },
                  { name: 'تليجرام', color: 'bg-sky-500 text-white', icon: '✈' },
                  { name: 'تيك توك', color: 'bg-black text-white', icon: '🎵' },
                  { name: 'الضبط', color: 'bg-slate-700 text-white', icon: '⚙' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className={`w-12 h-12 rounded-[16px] ${item.color} flex items-center justify-center text-xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium text-white/80">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button Preview Overlay */}
            <div className="relative z-10 flex items-center justify-center pt-4">
              <button
                type="button"
                onClick={handleAuthAction}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl transition-all cursor-pointer active:scale-95"
              >
                <span>ابدأ تجربة التابلت الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className="py-20 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">مميزات مصممة خصيصاً لاحتياجات الطالب</h2>
            <p className="mt-3 text-slate-400 text-sm">
              تجربة تابلت سامسونج الأصلية بنظام Android 16 تجمع بين الدراسة والذكاء الاصطناعي والتواصل الفوري
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">تشغيل التطبيقات داخل الفريم مباشرة</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                جميع التطبيقات (يوتيوب، جوجل، واتساب، تليجرام، وتيك توك) تعمل بسلاسة تامة داخل إطار التابلت دون الحاجة للخروج إلى نوافذ خارجية.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">ذكاء اصطناعي مدمج (ChatGPT & Gemini)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                مساعد دراسي ذكي يساعدك في فهم الدروس، حل المسائل المعقدة، والترجمة الفورية، وتلخيص المناهج الدراسية.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">شاشة قفل وأمان كامل (PIN / نمط)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                عيّن رمز PIN أو كلمة مرور أو نمط لحماية التابلت الخاص بك، مع إمكانية التغيير عبر إدخال الرمز القديم.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">رفع خلفيات مخصصة ومستقلة</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يمكنك رفع صور مخصصة من جهازك لتكون خلفية للشاشة الرئيسية وصورة مختلفة تماماً لشاشة القفل مع ألوان Material You.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">محاكاة دقيقة لـ One UI 7 وأندرويد 16</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                شريط الحالة، لوحة الإشعارات والاختصارات، مبدل التطبيقات، شريط التنقل السفلي، وأصوات قطرة الماء الأصلية.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">حفظ سحابي لبيانات الطالب عبر Google</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يتم حفظ ملفك الشخصي وإعدادات التابلت والتطبيقات المثبتة تلقائياً في قاعدة البيانات السحابية بأمان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 منصة تابلت سامسونج التعليمي للطلاب • نظام أندرويد 16 و One UI 7</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>دعم فني</span>
            <span>سياسة الخصوصية</span>
            <span>دليل الطالب</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
