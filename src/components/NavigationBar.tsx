/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';

export const NavigationBar: React.FC = () => {
  const {
    handleBackButton,
    minimizeToHome,
    isRecentAppsOpen,
    setRecentAppsOpen,
    activeApp,
    isDrawerOpen,
    isNotificationOpen,
    isWallpaperModalOpen,
  } = useLauncher();

  const handleRecentsClick = () => {
    setRecentAppsOpen(!isRecentAppsOpen);
  };

  const isAnyOverlayOpen =
    isDrawerOpen || isNotificationOpen || isWallpaperModalOpen || isRecentAppsOpen || activeApp;

  return (
    <nav
      className="h-12 w-full z-40 bg-black/40 backdrop-blur-md flex items-center justify-around px-8 md:px-24 select-none border-t border-white/5"
      dir="ltr"
    >
      {/* Recents Button (|||) */}
      <button
        type="button"
        onClick={handleRecentsClick}
        aria-label="Recent Apps"
        className="w-14 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 active:scale-90 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-[5px]">
          <span className="w-[3px] h-4 bg-white/80 group-hover:bg-white rounded-full transition-colors" />
          <span className="w-[3px] h-4 bg-white/80 group-hover:bg-white rounded-full transition-colors" />
          <span className="w-[3px] h-4 bg-white/80 group-hover:bg-white rounded-full transition-colors" />
        </div>
      </button>

      {/* Home Button (○ Circle / Pill) */}
      <button
        type="button"
        onClick={minimizeToHome}
        aria-label="Home"
        className="w-16 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 active:scale-90 transition-all cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-full border-2 border-white/80 group-hover:border-white transition-colors flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80" />
        </div>
      </button>

      {/* Back Button (<) */}
      <button
        type="button"
        onClick={handleBackButton}
        aria-label="Back"
        className={`w-14 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 active:scale-90 transition-all cursor-pointer group ${
          !isAnyOverlayOpen ? 'opacity-40 hover:opacity-70' : 'opacity-100'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-none stroke-white/80 group-hover:stroke-white stroke-[2.5] stroke-linecap-round stroke-linejoin-round transition-colors"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </nav>
  );
};
