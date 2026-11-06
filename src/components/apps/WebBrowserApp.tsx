/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppDefinition } from '../../types';
import { useLauncher } from '../../context/LauncherContext';
import { ExternalLink, RefreshCw, Maximize2, ArrowRight, Gamepad2, ShieldAlert } from 'lucide-react';

interface WebBrowserAppProps {
  app: AppDefinition;
}

export const WebBrowserApp: React.FC<WebBrowserAppProps> = ({ app }) => {
  const { closeApp } = useLauncher();
  const directUrl = app.webUrl || 'https://www.google.com';
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleOpenStandalone = () => {
    if (directUrl) {
      window.open(directUrl, '_blank');
    }
  };

  const handleRefresh = () => {
    setHasError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col select-none overflow-hidden relative" dir="rtl">
      {/* One UI 7 Top Tablet Control Bar for Web Apps and Games */}
      <div className="h-12 bg-slate-900 border-b border-white/10 px-4 flex items-center justify-between gap-2 shadow-md z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => closeApp(app.id)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
            title="رجوع"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow">
              {app.iconType === 'game' ? (
                <Gamepad2 className="w-4 h-4 text-white" />
              ) : (
                <span className="text-xs font-bold">{app.titleAr.slice(0, 1)}</span>
              )}
            </div>
            <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[160px] sm:max-w-xs">
              {app.titleAr}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="إعادة تحميل الصفحة"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          <button
            type="button"
            onClick={handleOpenStandalone}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            title="فتح في نافذة مستقلة بدقة كاملة"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>تشغيل في نافذة جديدة</span>
          </button>
        </div>
      </div>

      {/* Main Content View with Frame & Standalone Fallback */}
      <div className="flex-1 w-full h-full relative bg-slate-900">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 space-y-4 z-10">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-white mb-1">يُفضل تشغيل اللعبة في نافذة جديدة</h3>
              <p className="text-xs text-white/60 mb-4">
                هذا الموقع يفرض حماية تمنع العرض داخل الإطارات التفاعلية. اضغط على الزر بالأسفل لفتح اللعبة في نافذة مستقيلة وبأعلى سرعة.
              </p>
              <button
                type="button"
                onClick={handleOpenStandalone}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer flex items-center gap-2 justify-center mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح اللعبة الآن في نافذة جديدة مستقلة</span>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={directUrl}
            title={app.titleEn || app.titleAr}
            className="w-full h-full border-none bg-slate-900"
            onError={() => setHasError(true)}
            allow="accelerometer; autoplay; clipboard-write; clipboard-read; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone; geolocation"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation allow-downloads allow-top-navigation-by-user-activation"
          />
        )}
      </div>
    </div>
  );
};
