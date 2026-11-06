/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLauncher } from '../context/LauncherContext';
import { AppIcon } from './AppIcon';
import { CloudSun, Mic, Search, Camera as CameraIcon } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    allApps,
    openApp,
    setDrawerOpen,
    setNotificationOpen,
    setWallpaperModalOpen,
    currentTime,
    currentWallpaper,
  } = useLauncher();

  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [googleQuery, setGoogleQuery] = useState<string>('');

  // Time & Date format
  const hours = currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', hour12: false });
  const minutes = currentTime.toLocaleTimeString('ar-EG', { minute: '2-digit', hour12: false });
  const dateFormatted = currentTime.toLocaleDateString('ar-EG', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Fixed Dock apps (4 basic apps: Google, Camera, YouTube, Gmail)
  const dockAppIds = ['google', 'camera', 'youtube', 'gmail'];
  const dockApps = dockAppIds
    .map((id) => allApps.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);

  // Main Grid apps (6 basic apps requested: Calculator, Gallery, Translate, Clock, Settings, Store)
  const homeGridIds = ['calculator', 'gallery', 'translate', 'clock', 'settings', 'store'];
  const gridApps = homeGridIds
    .map((id) => allApps.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);

  // Touch and swipe gestures
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setTouchStartY(clientY);

    // Long press to open wallpaper picker
    const timer = setTimeout(() => {
      setWallpaperModalOpen(true);
    }, 700);
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (touchStartY === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = touchStartY - clientY;

    // Swipe up -> open App Drawer
    if (deltaY > 60) {
      setDrawerOpen(true);
    }
    // Swipe down -> open Notifications
    else if (deltaY < -60) {
      setNotificationOpen(true);
    }
    setTouchStartY(null);
  };

  return (
    <div
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex-1 w-full flex flex-col justify-between px-4 sm:px-8 md:px-14 py-3 select-none overflow-hidden"
    >
      {/* Top Section: Samsung Clock/Weather Widget & Google Search Bar */}
      <div className="w-full flex flex-col items-center gap-3 max-w-4xl mx-auto pt-2">
        {/* Weather & Clock Widget */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            openApp('clock');
          }}
          className="w-full sm:w-auto bg-black/25 hover:bg-black/35 backdrop-blur-md border border-white/10 rounded-3xl p-4 sm:px-8 sm:py-4 flex items-center justify-between sm:gap-12 cursor-pointer transition-all active:scale-[0.98] shadow-lg"
        >
          {/* Digital Time */}
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-4xl sm:text-5xl font-light tracking-tight">{hours}</span>
            <span className="text-3xl font-light text-white/60">:</span>
            <span className="text-4xl sm:text-5xl font-light tracking-tight">{minutes}</span>
            <span className="mr-3 text-xs sm:text-sm font-medium text-white/80">{dateFormatted}</span>
          </div>

          {/* Weather status */}
          <div className="flex items-center gap-3 text-white border-r border-white/15 pr-4 mr-2">
            <CloudSun className="w-9 h-9 text-amber-300 drop-shadow" />
            <div className="flex flex-col text-right">
              <span className="text-xl font-medium tracking-tight">27°C</span>
              <span className="text-xs text-white/80">مشمس • القاهرة</span>
            </div>
          </div>
        </div>

        {/* Google Search Bar Widget with In-Frame Google App integration */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openApp('google');
          }}
          onClick={(e) => {
            e.stopPropagation();
            openApp('google');
          }}
          className="w-full max-w-2xl bg-white/95 hover:bg-white text-slate-700 rounded-full h-12 px-4 flex items-center justify-between shadow-xl transition-all cursor-pointer"
        >
          {/* Google 'G' icon */}
          <div className="flex items-center gap-3 flex-1">
            <svg viewBox="0 0 48 48" className="w-6 h-6 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <input
              type="text"
              value={googleQuery}
              onChange={(e) => setGoogleQuery(e.target.value)}
              placeholder="ابحث في Google مباشرة أو اكتب عنواناً..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-500 focus:outline-none text-right px-1 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <button
              type="button"
              onClick={() => openApp('google')}
              className="hover:text-blue-600 transition-colors p-1"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => openApp('camera')}
              className="hover:text-blue-600 transition-colors p-1"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Middle Grid: Core Apps, Social Apps, AI & Installed Games */}
      <div className="my-auto py-2 w-full max-w-5xl mx-auto overflow-y-auto max-h-[54vh] px-2">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-y-5 gap-x-3 place-items-center">
          {gridApps.map((app) => (
            <AppIcon key={app.id} app={app} size="normal" showLabel={true} />
          ))}
        </div>
      </div>

      {/* Bottom Fixed Dock: 4 Apps */}
      <div className="w-full flex items-center justify-center pb-2">
        <div className="bg-black/30 backdrop-blur-xl border border-white/15 px-6 py-2.5 rounded-[32px] flex items-center justify-center gap-5 sm:gap-8 shadow-2xl">
          {dockApps.map((app) => (
            <AppIcon key={app.id} app={app} size="dock" showLabel={false} />
          ))}
        </div>
      </div>
    </div>
  );
};
