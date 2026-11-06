/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppDefinition } from '../types';
import { useLauncher } from '../context/LauncherContext';
import { Trash2, Info, ExternalLink } from 'lucide-react';

interface AppIconProps {
  app: AppDefinition;
  size?: 'normal' | 'dock' | 'large';
  showLabel?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, size = 'normal', showLabel = true }) => {
  const { openApp, uninstallGame, currentTime } = useLauncher();
  const [showMenu, setShowMenu] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const isGame = app.type === 'game';

  const handlePointerDown = () => {
    if (!isGame) return;
    const t = setTimeout(() => {
      setShowMenu(true);
    }, 600);
    setPressTimer(t);
  };

  const handlePointerUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    e.stopPropagation();
    openApp(app.id);
  };

  // Icon dimensions based on size
  const iconDimensions =
    size === 'dock'
      ? 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20'
      : size === 'large'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-15 h-15 sm:w-16 sm:h-16 md:w-18 md:h-18';

  const renderIconGraphic = () => {
    switch (app.iconType) {
      case 'google':
        return (
          <div className="w-full h-full flex items-center justify-center p-2.5">
            <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
        );

      case 'chrome':
        return (
          <div className="w-full h-full flex items-center justify-center p-2.5">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <circle cx="50" cy="50" r="46" fill="#ffffff" />
              {/* Chrome Pie Segments */}
              <path d="M50 50 L50 4 A46 46 0 0 1 89.8 27 L50 50 Z" fill="#EA4335" />
              <path d="M50 50 L89.8 27 A46 46 0 0 1 50 96 L50 50 Z" fill="#FBBC05" />
              <path d="M50 50 L50 96 A46 46 0 0 1 10.2 27 L50 50 Z" fill="#34A853" />
              {/* Chrome Center */}
              <circle cx="50" cy="50" r="22" fill="#ffffff" />
              <circle cx="50" cy="50" r="17" fill="#4285F4" />
            </svg>
          </div>
        );

      case 'youtube':
        return (
          <div className="w-full h-full flex items-center justify-center bg-red-600 rounded-[20px] shadow-sm">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        );

      case 'gmail':
        return (
          <div className="w-full h-full flex items-center justify-center p-3">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6l8 5 8-5v2l-8 5-8-5V6z"/>
              <path fill="#EA4335" d="M22 6l-10 6.25L2 6v-.5a1.5 1.5 0 0 1 1.5-1.5h17a1.5 1.5 0 0 1 1.5 1.5V6z"/>
            </svg>
          </div>
        );

      case 'maps':
        return (
          <div className="w-full h-full flex items-center justify-center p-2.5">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              <circle cx="12" cy="9" r="2.5" fill="#EA4335" />
            </svg>
          </div>
        );

      case 'drive':
        return (
          <div className="w-full h-full flex items-center justify-center p-3">
            <svg viewBox="0 0 87.3 78" className="w-full h-full">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
        );

      case 'translate':
        return (
          <div className="w-full h-full flex items-center justify-center p-2.5">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <rect width="24" height="24" rx="5" fill="#4285F4" />
              <path fill="#ffffff" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-green-700 rounded-[20px] text-white p-2">
            <div className="grid grid-cols-2 gap-1.5 text-xs font-bold font-mono">
              <span className="bg-white/20 rounded px-1.5 py-0.5 text-center">+</span>
              <span className="bg-white/20 rounded px-1.5 py-0.5 text-center">−</span>
              <span className="bg-white/20 rounded px-1.5 py-0.5 text-center">×</span>
              <span className="bg-emerald-400 text-slate-900 rounded px-1.5 py-0.5 text-center">=</span>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-red-600 to-rose-500 rounded-[20px] shadow-sm">
            <div className="w-10 h-10 rounded-full border-4 border-white/90 bg-neutral-900 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-inner"></div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-rose-500 to-red-400 rounded-[20px]">
            {/* Samsung Gallery Flower Logo */}
            <div className="relative w-8 h-8">
              <span className="absolute top-0 left-2 w-4 h-4 bg-white/90 rounded-full"></span>
              <span className="absolute bottom-0 left-2 w-4 h-4 bg-white/90 rounded-full"></span>
              <span className="absolute top-2 left-0 w-4 h-4 bg-white/90 rounded-full"></span>
              <span className="absolute top-2 right-0 w-4 h-4 bg-white/90 rounded-full"></span>
              <span className="absolute top-2 left-2 w-4 h-4 bg-yellow-300 rounded-full"></span>
            </div>
          </div>
        );

      case 'clock': {
        const sec = currentTime.getSeconds();
        const min = currentTime.getMinutes();
        const hr = currentTime.getHours() % 12;
        const secAngle = sec * 6;
        const minAngle = min * 6 + sec * 0.1;
        const hrAngle = hr * 30 + min * 0.5;

        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-[20px] border border-white/20 shadow-sm relative overflow-hidden">
            <div className="relative w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
              {/* Hour Hand */}
              <div
                className="absolute w-1 h-3.5 bg-white rounded-full origin-bottom bottom-5 left-[18px]"
                style={{ transform: `rotate(${hrAngle}deg)` }}
              />
              {/* Minute Hand */}
              <div
                className="absolute w-0.5 h-4.5 bg-white/80 rounded-full origin-bottom bottom-5 left-[19px]"
                style={{ transform: `rotate(${minAngle}deg)` }}
              />
              {/* Second Hand */}
              <div
                className="absolute w-0.5 h-4.5 bg-red-500 rounded-full origin-bottom bottom-5 left-[19px]"
                style={{ transform: `rotate(${secAngle}deg)` }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
            </div>
          </div>
        );
      }

      case 'settings':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-700 to-slate-900 rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-slate-200">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </div>
        );

      case 'store':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white drop-shadow">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/>
            </svg>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#25D366] rounded-[20px] text-white p-2.5">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29z"/>
            </svg>
          </div>
        );

      case 'telegram':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#229ED9] rounded-[20px] text-white p-2">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </div>
        );

      case 'facebook':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#1877F2] rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );

      case 'messenger':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#00B2FF] via-[#006AFF] to-[#9900FF] rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.735 7.21V22l3.383-1.857c.92.255 1.895.394 2.882.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.433l-2.55-2.723-4.975 2.723 5.474-5.814 2.616 2.723 4.908-2.723-5.473 5.814z"/>
            </svg>
          </div>
        );

      case 'instagram':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FFB900] via-[#D62976] to-[#4F5BD5] rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );

      case 'twitter':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        );

      case 'tiktok':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.75 1.54-.04 2.9-1.1 3.25-2.6.14-.54.19-1.1.18-1.66V.02h-.01z"/>
            </svg>
          </div>
        );

      case 'chatgpt':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#10a37f] rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.487a4.47 4.47 0 0 1 2.34-1.974V12.1a.776.776 0 0 0 .392.677l5.828 3.37-2.02 1.168a.07.07 0 0 1-.072 0L4.008 14.59A4.504 4.504 0 0 1 2.34 8.487zm16.597 3.855l-5.833-3.37L15.124 7.8a.076.076 0 0 1 .072 0l4.801 2.768a4.5 4.5 0 0 1-.676 8.35v-5.583a.79.79 0 0 0-.384-.677zm2.724-3.855l-.141-.085-4.774-2.78a.776.776 0 0 0-.785 0L10.098 9.01V6.677a.08.08 0 0 1 .033-.062l4.839-2.793a4.5 4.5 0 0 1 6.69 4.316v.504zM10.87 14.977l-2.616-1.51 2.616-1.51 2.617 1.51-2.617 1.51z"/>
            </svg>
          </div>
        );

      case 'gemini':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500 rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
              <path d="M12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24Z"/>
            </svg>
          </div>
        );

      case 'claude':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#D97757] rounded-[20px] text-white">
            <span className="font-serif font-black text-2xl tracking-tighter">C</span>
          </div>
        );

      case 'perplexity':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#22B8CF] rounded-[20px] text-white font-bold text-xl">
            P
          </div>
        );

      case 'pinterest':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#E60023] rounded-[20px] text-white font-bold text-2xl">
            P
          </div>
        );

      case 'ekb':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-[20px] text-white p-1">
            <span className="text-[10px] font-black leading-none">EKB</span>
            <span className="text-[9px] font-bold mt-0.5">مصر</span>
          </div>
        );

      case 'madrasatna':
        return (
          <div className="w-full h-full flex items-center justify-center bg-blue-700 rounded-[20px] text-white font-bold text-xs p-1 text-center">
            مدرستنا
          </div>
        );

      case 'notion':
        return (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 rounded-[20px] text-white font-mono font-bold text-2xl border border-white/20">
            N
          </div>
        );

      case 'duolingo':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#58cc02] rounded-[20px] text-white font-extrabold text-2xl">
            D
          </div>
        );

      case 'wikipedia':
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-[20px] text-slate-900 font-serif font-bold text-2xl">
            W
          </div>
        );

      case 'canva':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] rounded-[20px] text-white font-serif italic font-bold text-xl">
            Canva
          </div>
        );

      case 'docs':
        return (
          <div className="w-full h-full flex items-center justify-center bg-blue-600 rounded-[20px] text-white p-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </div>
        );

      case 'sheets':
        return (
          <div className="w-full h-full flex items-center justify-center bg-emerald-600 rounded-[20px] text-white p-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
            </svg>
          </div>
        );

      case 'slides':
        return (
          <div className="w-full h-full flex items-center justify-center bg-amber-500 rounded-[20px] text-white p-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h14v14zM9 8h6v2H9zm0 3h6v2H9z"/>
            </svg>
          </div>
        );

      case 'spotify':
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#1DB954] rounded-[20px] text-white p-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.333.076-.666-.135-.742-.467-.076-.333.136-.666.468-.742 3.815-.872 7.086-.496 9.717 1.112.294.18.386.563.207.853zm1.23-2.737c-.226.367-.707.482-1.074.256-2.688-1.652-6.785-2.131-9.965-1.166-.413.125-.848-.107-.973-.52-.125-.413.107-.848.52-.973 3.632-1.102 8.147-.568 11.238 1.329.367.226.482.707.254 1.074zm.105-2.853C14.694 8.95 9.387 8.773 6.308 9.708c-.487.147-1.001-.127-1.148-.614-.147-.487.127-1.001.614-1.148 3.535-1.073 9.404-.866 13.015 1.277.438.26.581.829.321 1.267-.26.438-.829.581-1.267.321z"/>
            </svg>
          </div>
        );

      case 'game':
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-[20px] text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none group">
      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => {
          if (isGame) {
            e.preventDefault();
            setShowMenu(true);
          }
        }}
        className={`relative ${iconDimensions} rounded-[22px] transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105 shadow-md shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/25 border border-white/20 focus:outline-none flex items-center justify-center p-0 overflow-hidden relative after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/25 after:via-transparent after:to-black/10 after:pointer-events-none ${
          app.iconBg
        }`}
        title={app.titleAr}
      >
        {renderIconGraphic()}
      </button>

      {/* App Label */}
      {showLabel && (
        <span className="mt-1.5 text-xs md:text-sm font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] text-center line-clamp-1 max-w-[84px] tracking-wide">
          {app.titleAr}
        </span>
      )}

      {/* Long press contextual menu for games / uninstalls */}
      {showMenu && isGame && (
        <div
          className="absolute z-50 -top-20 right-0 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              uninstallGame(app.id);
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-right w-full cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>إلغاء التثبيت</span>
          </button>
          <button
            type="button"
            onClick={() => {
              openApp(app.id);
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 rounded-xl transition-colors text-right w-full cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>فتح اللعبة</span>
          </button>
        </div>
      )}
    </div>
  );
};
