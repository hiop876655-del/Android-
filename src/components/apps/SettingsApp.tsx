/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Volume2,
  Tablet,
  LogIn,
  LogOut,
  ChevronLeft,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Lock,
  KeyRound,
  ShieldCheck,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { WALLPAPERS } from '../../data/wallpapers';
import { playTapSound } from '../../utils/sound';
import { LockType } from '../../types';
import { PatternPad } from '../PatternPad';

export const SettingsApp: React.FC = () => {
  const {
    user,
    login,
    logout,
    isLoggingIn,
    currentWallpaper,
    setWallpaper,
    customHomeWallpaper,
    setCustomHomeWallpaper,
    customLockWallpaper,
    setCustomLockWallpaper,
    brightness,
    setBrightness,
    soundMode,
    setSoundMode,
    soundEffects,
    setSoundEffects,
    autoRotate,
    setAutoRotate,
    setWallpaperModalOpen,
    lockType,
    lockSecret,
    updateLockSecurity,
    exitToLanding,
  } = useLauncher();

  const [activeSection, setActiveSection] = useState<
    'main' | 'wallpaper' | 'security' | 'display' | 'sound' | 'about'
  >('main');

  // Security configuration form state
  const [selectedLockType, setSelectedLockType] = useState<LockType>(lockType);
  const [oldSecretInput, setOldSecretInput] = useState<string>('');
  const [newSecretInput, setNewSecretInput] = useState<string>('');
  const [confirmSecretInput, setConfirmSecretInput] = useState<string>('');
  const [securityStatusMsg, setSecurityStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [patternStep, setPatternStep] = useState<'draw' | 'confirm' | 'matched'>('draw');
  const [tempDrawnPattern, setTempDrawnPattern] = useState<string>('');
  const [isOldVerified, setIsOldVerified] = useState<boolean>(lockType === 'swipe' || !lockSecret);

  const handleVerifyOldSecret = (inputToTest: string) => {
    playTapSound(soundEffects);
    if (inputToTest.trim() === lockSecret.trim()) {
      setIsOldVerified(true);
      setSecurityStatusMsg({ type: 'success', text: 'تم التحقق من الرمز القديم بنجاح! يمكنك الآن اختيار وتعديل قفل الشاشة.' });
    } else {
      setSecurityStatusMsg({ type: 'error', text: 'الرمز أو النمط القديم غير صحيح! يرجى المحاولة مجدداً.' });
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound(soundEffects);

    if (!isOldVerified && lockType !== 'swipe' && lockSecret) {
      setSecurityStatusMsg({ type: 'error', text: 'يرجى التحقق من الرمز القديم أولاً' });
      return;
    }

    if (selectedLockType !== 'swipe') {
      if (!newSecretInput.trim()) {
        setSecurityStatusMsg({ type: 'error', text: 'يرجى إدخال الرمز أو كلمة المرور الجديدة' });
        return;
      }
      if (newSecretInput !== confirmSecretInput) {
        setSecurityStatusMsg({ type: 'error', text: 'الرمز غير متطابق مع تأكيد الرمز' });
        return;
      }
    }

    const effectiveOldSecret = isOldVerified ? lockSecret : oldSecretInput;
    const res = updateLockSecurity(selectedLockType, newSecretInput, effectiveOldSecret);
    if (!res.success) {
      setSecurityStatusMsg({ type: 'error', text: res.error || 'فشل التحديث' });
    } else {
      setSecurityStatusMsg({ type: 'success', text: 'تم تحديث وسيلة قفل الشاشة بنجاح 🔒!' });
      setOldSecretInput('');
      setNewSecretInput('');
      setConfirmSecretInput('');
      setPatternStep('draw');
      setTempDrawnPattern('');
      setIsOldVerified(selectedLockType === 'swipe' || !newSecretInput);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col select-none overflow-hidden" dir="rtl">
      {/* Settings Top Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-slate-900/60 shrink-0">
        {activeSection !== 'main' && (
          <button
            type="button"
            onClick={() => {
              playTapSound(soundEffects);
              setActiveSection('main');
              setSecurityStatusMsg(null);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 rotate-180" />
          </button>
        )}
        <h1 className="text-xl font-bold">
          {activeSection === 'main' && 'الضبط'}
          {activeSection === 'wallpaper' && 'الخلفية والتخصيص'}
          {activeSection === 'security' && 'شاشة القفل والأمان'}
          {activeSection === 'display' && 'الشاشة والإضاءة'}
          {activeSection === 'sound' && 'الأصوات والاهتزاز'}
          {activeSection === 'about' && 'حول الجهاز'}
        </h1>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {activeSection === 'main' && (
          <div className="flex flex-col gap-4">
            {/* User Profile / Google Sign-in Card */}
            <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-5 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover shadow"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow">
                    {user?.displayName ? user.displayName[0] : 'S'}
                  </div>
                )}

                <div className="flex flex-col text-right">
                  <span className="font-bold text-base text-white">
                    {user ? user.displayName : 'حساب Google للطلاب'}
                  </span>
                  <span className="text-xs text-white/60">
                    {user ? user.email : 'سجل الدخول لحفظ بياناتك ومزامنتها بأمان'}
                  </span>
                </div>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs px-4 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span>{isLoggingIn ? 'جارِ الدخول...' : 'دخول بحساب Google'}</span>
                </button>
              )}
            </div>

            {/* Menu Sections List */}
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden">
              {/* Lock Screen & Security */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setSelectedLockType(lockType);
                  setSecurityStatusMsg(null);
                  setActiveSection('security');
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">شاشة القفل والأمان (PIN / نمط / كلمة مرور)</h3>
                    <p className="text-xs text-white/50">
                      النوع الحالي: {lockType === 'swipe' ? 'سحب بدون قفل' : lockType === 'pin' ? 'رمز PIN' : lockType === 'pattern' ? 'نمط' : 'كلمة مرور'}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </button>

              {/* Wallpaper & Theme */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveSection('wallpaper');
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">الخلفية والتخصيص</h3>
                    <p className="text-xs text-white/50">رفع صور مخصصة للشاشة الرئيسية وشاشة القفل بشكل مستقل</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </button>

              {/* Display & Brightness */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveSection('display');
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">الشاشة والإضاءة</h3>
                    <p className="text-xs text-white/50">السطوع، الوضع الداكن، والتدوير التلقائي</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </button>

              {/* Sound & Vibration */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveSection('sound');
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">الأصوات والاهتزاز</h3>
                    <p className="text-xs text-white/50">صوت قطرة ماء سامسونج عند اللمس وفتح القفل</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </button>

              {/* About Tablet */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveSection('about');
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-slate-700 text-white">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">حول الجهاز</h3>
                    <p className="text-xs text-white/50">Samsung Galaxy Tab A11 • One UI 7 • Android 16</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {/* Exit to Landing Platform Button */}
            <button
              type="button"
              onClick={exitToLanding}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>الخروج إلى صفحة المنصة الرئيسية</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security & Lock Screen Section */}
        {activeSection === 'security' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 flex flex-col gap-5">
            {!isOldVerified && lockType !== 'swipe' && lockSecret ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">التحقق الإجباري من القفل الحالي</h2>
                  <p className="text-xs text-white/60 mt-1 max-w-sm">
                    لحماية بياناتك، يرجى إدخال الرمز أو رسم النمط الحالي أولاً قبل تعديل أو إلغاء قفل الشاشة.
                  </p>
                </div>

                {lockType === 'pattern' ? (
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <PatternPad
                      size={240}
                      soundEffects={soundEffects}
                      onComplete={(patternStr) => handleVerifyOldSecret(patternStr)}
                    />
                    <span className="text-xs text-amber-300 font-semibold mt-1">ارسم النمط القديم للتحقق</span>
                  </div>
                ) : (
                  <div className="w-full max-w-xs flex flex-col gap-3 pt-2">
                    <input
                      type="password"
                      value={oldSecretInput}
                      onChange={(e) => setOldSecretInput(e.target.value)}
                      placeholder={lockType === 'pin' ? 'أدخل رمز PIN الحالي...' : 'أدخل كلمة المرور الحالية...'}
                      className="bg-black/50 border border-white/15 focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none text-right"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyOldSecret(oldSecretInput)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                    >
                      تأكيد والبدء بالتعديل
                    </button>
                  </div>
                )}

                {securityStatusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold w-full max-w-xs ${
                      securityStatusMsg.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {securityStatusMsg.text}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveSecurity} className="flex flex-col gap-5">
                <div>
                  <h2 className="text-base font-bold text-white">نوع قفل الشاشة</h2>
                  <p className="text-xs text-white/60 mt-0.5">اختر طريقة تأمين شاشة قفل تابلت سامسونج</p>
                </div>

                {/* Lock type choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: 'swipe', label: 'سحب عادي', desc: 'دون حماية' },
                    { type: 'pin', label: 'رمز PIN', desc: 'أرقام فقط' },
                    { type: 'password', label: 'كلمة مرور', desc: 'حروف وأرقام' },
                    { type: 'pattern', label: 'نمط', desc: 'رسم تسلسلي' },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSelectedLockType(opt.type as LockType)}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                        selectedLockType === opt.type
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow'
                          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-bold text-xs">{opt.label}</span>
                      <span className="text-[10px] text-white/50 block mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Pattern Setup Wizard */}
                {selectedLockType === 'pattern' && (
                  <div className="flex flex-col items-center gap-3 p-5 bg-black/40 rounded-3xl border border-white/10">
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-bold text-white block">
                        {patternStep === 'draw' && 'ارسم النمط الجديد (صل 4 نقاط على الأقل):'}
                        {patternStep === 'confirm' && 'أعد رسم النمط مرة أخرى للتأكيد:'}
                        {patternStep === 'matched' && '✓ تم تطابق النمط الجديد بنجاح!'}
                      </span>
                      <span className="text-[11px] text-white/50 block mt-1">
                        {patternStep === 'draw' && 'مرر إصبعك أو الماوس بين النقاط لتحديد النمط'}
                        {patternStep === 'confirm' && 'كرر رسم نفس النمط للتأكيد'}
                        {patternStep === 'matched' && 'اضغط «حفظ إعدادات الأمان» أدناه لتثبيت القفل'}
                      </span>
                    </div>

                    {patternStep !== 'matched' ? (
                      <PatternPad
                        key={patternStep}
                        size={240}
                        soundEffects={soundEffects}
                        onComplete={(patternStr) => {
                          const dotsCount = patternStr.split('-').length;
                          if (patternStep === 'draw') {
                            if (dotsCount < 4) {
                              setSecurityStatusMsg({ type: 'error', text: 'النمط قصير جداً! يرجى توصيل 4 نقاط على الأقل.' });
                              return;
                            }
                            setTempDrawnPattern(patternStr);
                            setPatternStep('confirm');
                            setSecurityStatusMsg(null);
                          } else if (patternStep === 'confirm') {
                            if (patternStr === tempDrawnPattern) {
                              setNewSecretInput(patternStr);
                              setConfirmSecretInput(patternStr);
                              setPatternStep('matched');
                              setSecurityStatusMsg({ type: 'success', text: 'تم تطابق النمط بنجاح! اضغط «حفظ إعدادات الأمان» أدناه.' });
                            } else {
                              setSecurityStatusMsg({ type: 'error', text: 'النمط غير مطابق للنمط الأول، يرجى المحاولة من جديد.' });
                              setPatternStep('draw');
                              setTempDrawnPattern('');
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold my-2">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span>تم تسجيل النمط وتأكيده بنجاح!</span>
                      </div>
                    )}

                    {(patternStep === 'confirm' || patternStep === 'matched') && (
                      <button
                        type="button"
                        onClick={() => {
                          setPatternStep('draw');
                          setTempDrawnPattern('');
                          setNewSecretInput('');
                          setConfirmSecretInput('');
                          setSecurityStatusMsg(null);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer mt-1"
                      >
                        إعادة رسم النمط من البداية
                      </button>
                    )}
                  </div>
                )}

                {/* PIN Inputs */}
                {selectedLockType === 'pin' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white">أدخل رمز PIN الجديد (أرقام فقط):</label>
                      <input
                        type="number"
                        value={newSecretInput}
                        onChange={(e) => setNewSecretInput(e.target.value)}
                        placeholder="4 إلى 6 أرقام..."
                        className="bg-black/50 border border-white/15 focus:border-blue-400 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none text-right"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white">تأكيد رمز PIN الجديد:</label>
                      <input
                        type="number"
                        value={confirmSecretInput}
                        onChange={(e) => setConfirmSecretInput(e.target.value)}
                        placeholder="أعد إدخال الأرقام للتأكيد..."
                        className="bg-black/50 border border-white/15 focus:border-blue-400 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Password Inputs */}
                {selectedLockType === 'password' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white">أدخل كلمة المرور الجديدة:</label>
                      <input
                        type="password"
                        value={newSecretInput}
                        onChange={(e) => setNewSecretInput(e.target.value)}
                        placeholder="كلمة مرور قوية..."
                        className="bg-black/50 border border-white/15 focus:border-blue-400 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none text-right"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white">تأكيد كلمة المرور الجديدة:</label>
                      <input
                        type="password"
                        value={confirmSecretInput}
                        onChange={(e) => setConfirmSecretInput(e.target.value)}
                        placeholder="أعد إدخال كلمة المرور للتأكيد..."
                        className="bg-black/50 border border-white/15 focus:border-blue-400 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Status message */}
                {securityStatusMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      securityStatusMsg.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {securityStatusMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  حفظ إعدادات الأمان
                </button>
              </form>
            )}
          </div>
        )}


        {/* Wallpaper & Theme Section */}
        {activeSection === 'wallpaper' && (
          <div className="flex flex-col gap-5">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">تخصيص الخلفيات المرفوعة</h3>
                  <p className="text-xs text-white/50">يمكنك وضع صورتين مختلفتين للشاشة الرئيسية وشاشة القفل</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWallpaperModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                >
                  فتح لوحة التخصيص
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 rounded-2xl p-3 flex flex-col gap-2">
                  <span className="text-xs text-white/80 font-semibold">الشاشة الرئيسية:</span>
                  {customHomeWallpaper ? (
                    <span className="text-[11px] text-emerald-400 font-semibold">صورة مخصصة نشطة ✓</span>
                  ) : (
                    <span className="text-[11px] text-white/40">نمط {currentWallpaper.nameAr}</span>
                  )}
                </div>

                <div className="bg-white/5 rounded-2xl p-3 flex flex-col gap-2">
                  <span className="text-xs text-white/80 font-semibold">شاشة القفل:</span>
                  {customLockWallpaper ? (
                    <span className="text-[11px] text-purple-400 font-semibold">صورة قفل مستقلة نشطة ✓</span>
                  ) : (
                    <span className="text-[11px] text-white/40">مطابقة للشاشة الرئيسية</span>
                  )}
                </div>
              </div>
            </div>

            {/* Material You Themes */}
            <div className="flex flex-col gap-3">
              <span className="text-xs text-white/60 font-semibold">أنماط ألوان النظام:</span>
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
                      className={`h-28 rounded-2xl p-3 flex flex-col justify-between border-2 text-right transition-all cursor-pointer ${
                        isSelected ? 'border-blue-500 scale-[1.02] shadow-xl' : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ background: wp.gradient }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-white drop-shadow">{wp.nameAr}</span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Display Section */}
        {activeSection === 'display' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">مستوى السطوع</span>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                <Sun className="w-5 h-5 text-amber-400" />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="text-xs font-mono">{brightness}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="text-sm font-semibold">تدوير الشاشة التلقائي</span>
                <p className="text-xs text-white/50">دعم الوضع الأفقي والرأسي تلقائياً للتابلت</p>
              </div>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
          </div>
        )}

        {/* Sound Section */}
        {activeSection === 'sound' && (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">وضع الصوت</span>
              <div className="grid grid-cols-3 gap-2 bg-white/5 p-2 rounded-2xl">
                {(['sound', 'vibrate', 'mute'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSoundMode(mode)}
                    className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      soundMode === mode ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode === 'sound' ? 'رنين' : mode === 'vibrate' ? 'اهتزاز' : 'صامت'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="text-sm font-semibold">أصوات النظام وتفاعلات اللمس</span>
                <p className="text-xs text-white/50">صوت قطرة الماء المميز لواجهة One UI عند النقر وفتح القفل</p>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
          </div>
        )}

        {/* About Tablet Section */}
        {activeSection === 'about' && (
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-950 border border-blue-500/30 rounded-3xl p-6 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/30 text-blue-400 mx-auto flex items-center justify-center mb-3">
                <Tablet className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Samsung Galaxy Tab A11</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-400/30">
                Android 16 • One UI 7.0
              </span>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden text-sm">
              <div className="flex justify-between p-4">
                <span className="text-white/60">اسم الجهاز</span>
                <span className="font-semibold text-white">Samsung Galaxy Tab A11</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">رقم الطراز</span>
                <span className="font-mono text-white">SM-X210</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">إصدار One UI</span>
                <span className="font-semibold text-white">One UI 7.0</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">إصدار Android</span>
                <span className="font-semibold text-emerald-400">Android 16</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">الشاشة والمقاس</span>
                <span className="text-white">11.0 بوصة (1920 × 1200)</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">الذاكرة العشوائية (RAM)</span>
                <span className="text-white">6.00 جيجابايت</span>
              </div>
              <div className="flex justify-between p-4">
                <span className="text-white/60">سعة التخزين</span>
                <span className="text-white">128 جيجابايت (المتاح 104 جيجابايت)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
