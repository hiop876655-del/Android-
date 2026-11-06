/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlatformView = 'landing' | 'gateway' | 'simulator';

export type LockType = 'swipe' | 'pin' | 'password' | 'pattern';

export type SystemAppId =
  | 'youtube'
  | 'google'
  | 'chrome'
  | 'gmail'
  | 'maps'
  | 'drive'
  | 'translate'
  | 'calculator'
  | 'camera'
  | 'gallery'
  | 'settings'
  | 'clock'
  | 'store'
  | 'whatsapp'
  | 'telegram'
  | 'facebook'
  | 'messenger'
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'chatgpt'
  | 'gemini';

export interface AppDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  iconType: string;
  iconBg: string;
  iconColor?: string;
  type: 'system' | 'web' | 'game';
  webUrl?: string;
  isCore: boolean;
  inDock?: boolean;
  category?: string;
}

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: string;
  installed?: boolean;
}

export interface WallpaperOption {
  id: string;
  nameAr: string;
  nameEn: string;
  gradient: string;
  theme: {
    primary: string; // Dynamic Material You primary
    primarySoft: string;
    accent: string;
    surface: string;
    cardBg: string;
    text: string;
    pillBg: string;
    glow: string;
  };
}

export interface NotificationItem {
  id: string;
  appId: string;
  appName: string;
  title: string;
  body: string;
  time: string;
}
