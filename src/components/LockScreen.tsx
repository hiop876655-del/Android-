/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useLauncher } from '../context/LauncherContext';
import { Camera, Phone, ChevronUp, Lock, Delete, KeyRound, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { playTapSound } from '../utils/sound';
import { PatternPad } from './PatternPad';

export const LockScreen: React.FC = () => {
  const {
    isLocked,
    unlock,
    currentTime,
    openApp,
    currentWallpaper,
    customLockWallpaper,
    customHomeWallpaper,
    lockType,
    lockSecret,
    verifyLockSecret,
    soundEffects,
  } = useLauncher();

  // Two-stage lock screen state: 'quiet' vs 'challenge'
  const [lockStage, setLockStage] = useState<'quiet' | 'challenge'>('quiet');

  // Swipe gesture state
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  // Security Challenge States (PIN / Password / Pattern)
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  // Track target app to launch after successful security unlock
  const [pendingAppTarget, setPendingAppTarget] = useState<string | null>(null);

  if (!isLocked && !isDismissing) return null;

  const hours = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', hour12: false });
  const minutes = currentTime.toLocaleTimeString('ar-EG', { minute: '2-digit', hour12: false });
  const dateStr = currentTime.toLocaleDateString('ar-EG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const backgroundStyle: React.CSSProperties = customLockWallpaper
    ? {
        backgroundImage: `url(${customLockWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : customHomeWallpaper
    ? {
        backgroundImage: `url(${customHomeWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: currentWallpaper.gradient,
      };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setErrorMessage('');
    }, 1200);
  };
  const handleUnlockSuccess = () => {
    setIsDismissing(true);
    setDragOffsetY(window.innerHeight || 800);
    setTimeout(() => {
      unlock();
      if (pendingAppTarget) {
        openApp(pendingAppTarget);
        setPendingAppTarget(null);
      }
      setIsDismissing(false);
      setLockStage('quiet');
      setDragOffsetY(0);
      setEnteredPin('');
      setEnteredPassword('');
    }, 280);
  };

  const handleShortcutClick = (appId: string) => {
    playTapSound(soundEffects);
    if (lockType === 'swipe') {
      handleUnlockSuccess();
      openApp(appId);
    } else {
      setPendingAppTarget(appId);
      setLockStage('challenge');
    }
  };

  // --- SWIPE / DRAG HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (lockStage === 'challenge') return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (lockStage === 'challenge' || dragStartY === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = dragStartY - clientY;
    if (diff > 0) {
      setDragOffsetY(diff);
      if (diff > 90) {
        if (lockType === 'swipe') {
          handleUnlockSuccess();
        } else if (lockStage === 'quiet') {
          playTapSound(soundEffects);
          setLockStage('challenge');
          setDragOffsetY(0);
          setDragStartY(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (lockStage === 'challenge') {
      setDragOffsetY(0);
      setDragStartY(null);
      return;
    }
    if (dragOffsetY > 70) {
      if (lockType === 'swipe') {
        handleUnlockSuccess();
      } else if (lockStage === 'quiet') {
        playTapSound(soundEffects);
        setLockStage('challenge');
      }
    }
    setDragOffsetY(0);
    setDragStartY(null);
  };

  // --- PIN KEYPAD HANDLERS ---
  const handlePinPress = (digit: string) => {
    playTapSound(soundEffects);
    if (enteredPin.length >= 8) return;
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);

    if (newPin === lockSecret) {
      handleUnlockSuccess();
    } else if (newPin.length >= lockSecret.length && lockSecret.length >= 4) {
      triggerError('رمز PIN غير صحيح');
      setEnteredPin('');
    }
  };

  const handlePinDelete = () => {
    playTapSound(soundEffects);
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  // --- PASSWORD HANDLER ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound(soundEffects);
    if (verifyLockSecret(enteredPassword)) {
      handleUnlockSuccess();
    } else {
      triggerError('كلمة المرور غير صحيحة');
      setEnteredPassword('');
    }
  };

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(-${dragOffsetY}px)`,
        ...backgroundStyle,
      }}
      className="absolute inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 text-white select-none transition-transform duration-200 ease-out backdrop-blur-md overflow-hidden cursor-grab active:cursor-grabbing"
      dir="rtl"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Header: Lock Indicator */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/90">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {lockStage === 'quiet'
              ? 'سامسونج Galaxy Tab A11'
              : lockType === 'pin'
              ? 'أدخل رمز PIN'
              : lockType === 'password'
              ? 'أدخل كلمة المرور'
              : 'ارسم النمط لفتح القفل'}
          </span>
        </div>

        {lockStage === 'challenge' && lockType !== 'swipe' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playTapSound(soundEffects);
              setLockStage('quiet');
            }}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white/80 cursor-pointer"
          >
            إلغاء ✕
          </button>
        )}
      </div>

      {/* Center Section */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto">
        {/* Clock & Date */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-6xl sm:text-7xl md:text-8xl font-light tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] font-sans">
            <span>{hours}</span>
            <span className="text-white/60 animate-pulse">:</span>
            <span>{minutes}</span>
          </div>

          <div className="mt-2 text-sm sm:text-base font-medium text-white/90 drop-shadow-md">
            {dateStr}
          </div>
        </div>

        {/* Stage 1: Quiet Screen Prompt */}
        {lockStage === 'quiet' && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              playTapSound(soundEffects);
              if (lockType === 'swipe') {
                handleUnlockSuccess();
              } else {
                setLockStage('challenge');
              }
            }}
            className="mt-12 flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="p-3.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-blue-300 animate-bounce shadow-xl">
              <ChevronUp className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white/90 drop-shadow">
              اسحب للأعلى لفتح القفل 🔓
            </span>
          </div>
        )}

        {/* Stage 2: Security Challenge Screen */}
        {lockStage === 'challenge' && lockType !== 'swipe' && (
          <div className="mt-6 flex flex-col items-center w-full animate-in slide-in-from-bottom-8 duration-200">
            {/* Error message banner */}
            {errorMessage && (
              <div className="mb-3 flex items-center gap-1.5 bg-red-500/20 text-red-300 border border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold animate-bounce">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Challenge 1: PIN Keypad */}
            {lockType === 'pin' && (
              <div className={`flex flex-col items-center gap-4 ${isShaking ? 'animate-shake' : ''}`}>
                <div className="flex items-center gap-3 h-6">
                  {Array.from({ length: Math.max(4, lockSecret.length) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-full border border-white/40 transition-all ${
                        i < enteredPin.length ? 'bg-white scale-125' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-64 pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handlePinPress(digit)}
                      className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95 cursor-pointer shadow"
                    >
                      {digit}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setEnteredPin('')}
                    className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-xs font-semibold text-white/70 transition-all cursor-pointer"
                  >
                    مسح
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePinPress('0')}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl font-bold text-white transition-all active:scale-95 cursor-pointer shadow"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handlePinDelete}
                    className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 transition-all cursor-pointer"
                    title="تراجع"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Challenge 2: Password Input */}
            {lockType === 'password' && (
              <form
                onSubmit={handlePasswordSubmit}
                className={`w-full max-w-xs flex flex-col gap-3 ${isShaking ? 'animate-shake' : ''}`}
              >
                <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 focus-within:border-blue-400 shadow-xl">
                  <KeyRound className="w-4 h-4 text-white/50 ml-2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none text-right"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  فتح القفل
                </button>
              </form>
            )}

            {/* Challenge 3: Pattern Grid */}
            {lockType === 'pattern' && (
              <div className={`flex flex-col items-center ${isShaking ? 'animate-shake' : ''}`}>
                <PatternPad
                  key={isShaking ? 'shaking' : 'normal'}
                  onComplete={(patternStr) => {
                    if (verifyLockSecret(patternStr)) {
                      handleUnlockSuccess();
                    } else {
                      triggerError('النمط غير صحيح');
                    }
                  }}
                  soundEffects={soundEffects}
                  isError={isShaking}
                  size={260}
                />
                <span className="text-xs text-white/80 mt-3 font-medium">ارسم النمط بالتمرير عبر النقاط</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Shortcuts */}
      <div className="relative z-10 w-full flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleShortcutClick('google');
          }}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="فتح جوجل"
        >
          <Phone className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleShortcutClick('camera');
          }}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="فتح الكاميرا"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

