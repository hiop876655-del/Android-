/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';
import { CalculatorApp } from './apps/CalculatorApp';
import { CameraApp } from './apps/CameraApp';
import { GalleryApp } from './apps/GalleryApp';
import { ClockApp } from './apps/ClockApp';
import { SettingsApp } from './apps/SettingsApp';
import { StoreApp } from './apps/StoreApp';
import { GoogleApp } from './apps/GoogleApp';
import { YouTubeApp } from './apps/YouTubeApp';
import { ChatGPTApp } from './apps/ChatGPTApp';
import { GeminiApp } from './apps/GeminiApp';
import { TikTokApp } from './apps/TikTokApp';
import { WhatsAppApp } from './apps/WhatsAppApp';
import { TelegramApp } from './apps/TelegramApp';
import { FacebookApp } from './apps/FacebookApp';
import { MessengerApp } from './apps/MessengerApp';
import { InstagramApp } from './apps/InstagramApp';
import { TwitterApp } from './apps/TwitterApp';
import { GmailApp } from './apps/GmailApp';
import { MapsApp } from './apps/MapsApp';
import { DriveApp } from './apps/DriveApp';
import { TranslateApp } from './apps/TranslateApp';
import { WebBrowserApp } from './apps/WebBrowserApp';

export const AppWindow: React.FC = () => {
  const { activeApp } = useLauncher();

  if (!activeApp) return null;

  const renderAppContent = () => {
    switch (activeApp.id) {
      // Core System Utilities
      case 'calculator':
        return <CalculatorApp />;
      case 'camera':
        return <CameraApp />;
      case 'gallery':
        return <GalleryApp />;
      case 'clock':
        return <ClockApp />;
      case 'settings':
        return <SettingsApp />;
      case 'store':
        return <StoreApp />;

      // Google Suite
      case 'google':
        return <GoogleApp isChrome={false} />;
      case 'chrome':
        return <GoogleApp isChrome={true} />;
      case 'youtube':
        return <YouTubeApp />;
      case 'gmail':
        return <GmailApp />;
      case 'maps':
        return <MapsApp />;
      case 'drive':
        return <DriveApp />;
      case 'translate':
        return <TranslateApp />;

      // AI Assistants
      case 'chatgpt':
        return <ChatGPTApp />;
      case 'gemini':
        return <GeminiApp />;

      // Social & Messaging requested by user
      case 'whatsapp':
        return <WhatsAppApp />;
      case 'telegram':
        return <TelegramApp />;
      case 'facebook':
        return <FacebookApp />;
      case 'messenger':
        return <MessengerApp />;
      case 'instagram':
        return <InstagramApp />;
      case 'twitter':
        return <TwitterApp />;
      case 'tiktok':
        return <TikTokApp />;

      // Custom installed games from the Store
      default:
        return <WebBrowserApp app={activeApp} />;
    }
  };

  return (
    <div
      className="absolute inset-0 z-30 bg-slate-950 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200 select-none"
    >
      {/* 100% In-Frame Real App Runner without top window bars or browser blocks */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {renderAppContent()}
      </div>
    </div>
  );
};
