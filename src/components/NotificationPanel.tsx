/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  Volume2,
  VolumeX,
  Volume1,
  Plane,
  RotateCcw,
  Sun,
  Settings as SettingsIcon,
  Maximize,
  Minimize,
  Bell,
  Trash2,
  ChevronUp,
  Lock,
  Globe,
} from 'lucide-react';

export const NotificationPanel: React.FC = () => {
  const {
    isNotificationOpen,
    setNotificationOpen,
    lock,
    exitToLanding,
    currentTime,
    wifiEnabled,
    setWifiEnabled,
    bluetoothEnabled,
    setBluetoothEnabled,
    soundMode,
    setSoundMode,
    airplaneMode,
    setAirplaneMode,
    autoRotate,
    setAutoRotate,
    brightness,
    setBrightness,
    isFullscreen,
    toggleFullscreen,
    notifications,
    dismissNotification,
    clearAllNotifications,
    openApp,
    currentWallpaper,
  } = useLauncher();

  const [startY, setStartY] = React.useState<number | null>(null);

  if (!isNotificationOpen) return null;

  // Touch & Mouse swipe up to dismiss handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(y);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY === null) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffY = startY - y; // positive = dragging upwards
    if (diffY > 60) {
      setNotificationOpen(false);
      setStartY(null);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  const hours = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', hour12: false });
  const minutes = currentTime.toLocaleTimeString('ar-EG', { minute: '2-digit', hour12: false });
  const dateFormatted = currentTime.toLocaleDateString('ar-EG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const cycleSoundMode = () => {
    if (soundMode === 'sound') setSoundMode('vibrate');
    else if (soundMode === 'vibrate') setSoundMode('mute');
    else setSoundMode('sound');
  };

  return (
    <div
      onClick={() => setNotificationOpen(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      className="absolute inset-0 z-45 bg-black/55 backdrop-blur-2xl flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 animate-in slide-in-from-top duration-250 select-none overflow-y-auto cursor-grab active:cursor-grabbing"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-5 text-white"
      >
        {/* Top Action Buttons requested by user: Lock Device & Exit to Landing Platform */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setNotificationOpen(false);
              lock();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg"
            title="الانتقال فوراً لشاشة القفل"
          >
            <Lock className="w-4 h-4 text-purple-300" />
            <span>شاشة القفل 🔒</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNotificationOpen(false);
              exitToLanding();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg"
            title="الخروج من المحاكي إلى الصفحة الرئيسية برا"
          >
            <Globe className="w-4 h-4 text-blue-300" />
            <span>الصفحة الرئيسية 🌐</span>
          </button>
        </div>

        {/* Quick Toggles Grid (One UI 7 Style) */}
        <div className="grid grid-cols-4 gap-3">
          {/* Wi-Fi Toggle */}
          <button
            type="button"
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              wifiEnabled
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            {wifiEnabled ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            <span className="text-[11px] font-medium">Wi-Fi</span>
          </button>

          {/* Sound Mode Toggle */}
          <button
            type="button"
            onClick={cycleSoundMode}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              soundMode !== 'mute'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            {soundMode === 'sound' && <Volume2 className="w-5 h-5" />}
            {soundMode === 'vibrate' && <Volume1 className="w-5 h-5" />}
            {soundMode === 'mute' && <VolumeX className="w-5 h-5" />}
            <span className="text-[11px] font-medium">
              {soundMode === 'sound' ? 'صوت' : soundMode === 'vibrate' ? 'اهتزاز' : 'صامت'}
            </span>
          </button>

          {/* Bluetooth Toggle */}
          <button
            type="button"
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              bluetoothEnabled
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <Bluetooth className="w-5 h-5" />
            <span className="text-[11px] font-medium">بلوتوث</span>
          </button>

          {/* Airplane Mode Toggle */}
          <button
            type="button"
            onClick={() => setAirplaneMode(!airplaneMode)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              airplaneMode
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <Plane className="w-5 h-5" />
            <span className="text-[11px] font-medium">طيران</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              autoRotate
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[11px] font-medium">تدوير تلقائي</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <Maximize className="w-5 h-5" />
            <span className="text-[11px] font-medium">ملء الشاشة</span>
          </button>
        </div>

        {/* Screen Brightness Slider */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl">
          <Sun className="w-5 h-5 text-amber-300" />
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-1 accent-blue-500 cursor-pointer h-2 bg-white/20 rounded-lg"
          />
          <span className="text-xs font-mono w-8 text-center">{brightness}%</span>
        </div>

        {/* Notifications Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-white/70 px-1">
            <span className="font-semibold text-white/90">الإشعارات ({notifications.length})</span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-white/40 text-xs">
                لا توجد إشعارات جديدة حالياً
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-3.5 flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-right flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white/95">{notif.appName}</span>
                        <span className="text-[10px] text-white/50">{notif.time}</span>
                      </div>
                      <span className="text-xs font-medium text-white/90 mt-0.5">{notif.title}</span>
                      <p className="text-[11px] text-white/70 mt-0.5 leading-relaxed">{notif.body}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismissNotification(notif.id)}
                    className="text-white/40 hover:text-white/80 p-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drag-up close button */}
        <div
          onClick={() => setNotificationOpen(false)}
          className="flex flex-col items-center justify-center pt-2 text-white/50 hover:text-white cursor-pointer"
        >
          <ChevronUp className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
