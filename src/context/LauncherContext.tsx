/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { AppDefinition, GameItem, NotificationItem, WallpaperOption, PlatformView, LockType } from '../types';
import { SYSTEM_APPS } from '../data/systemApps';
import { WALLPAPERS } from '../data/wallpapers';
import { getPersistedUser, signInWithGoogle, signInStudentAccount, signOutUser, StudentUserProfile } from '../firebase';
import { playTapSound, playUnlockSound } from '../utils/sound';

interface LauncherContextType {
  // Platform View Navigation: landing -> gateway -> simulator
  platformView: PlatformView;
  setPlatformView: (view: PlatformView) => void;
  launchSimulator: () => void;
  exitToLanding: () => void;

  // Navigation & Screen States
  isLocked: boolean;
  unlock: () => void;
  lock: () => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  isRecentAppsOpen: boolean;
  setRecentAppsOpen: (open: boolean) => void;
  isWallpaperModalOpen: boolean;
  setWallpaperModalOpen: (open: boolean) => void;

  // Apps Management
  allApps: AppDefinition[];
  activeApp: AppDefinition | null;
  recentApps: AppDefinition[];
  installedGames: GameItem[];
  installedAppIds: string[];
  installWebApp: (appId: string, appNameAr: string) => void;
  uninstallWebApp: (appId: string) => void;
  openApp: (appId: string) => void;
  closeApp: (appId?: string) => void;
  closeAllApps: () => void;
  minimizeToHome: () => void;
  handleBackButton: () => void;
  installGame: (game: GameItem) => void;
  uninstallGame: (gameId: string) => void;

  // Theming & Custom Wallpapers (Separate for Home and Lock Screen)
  currentWallpaper: WallpaperOption;
  setWallpaper: (wp: WallpaperOption) => void;
  customHomeWallpaper: string | null;
  setCustomHomeWallpaper: (dataUrl: string | null) => void;
  customLockWallpaper: string | null;
  setCustomLockWallpaper: (dataUrl: string | null) => void;

  // Lock Screen Security (PIN / Password / Pattern)
  lockType: LockType;
  lockSecret: string;
  updateLockSecurity: (newType: LockType, newSecret: string, oldSecret?: string) => { success: boolean; error?: string };
  verifyLockSecret: (input: string) => boolean;

  // System Controls & Hardware Emulation
  currentTime: Date;
  batteryLevel: number;
  isCharging: boolean;
  wifiEnabled: boolean;
  setWifiEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  bluetoothEnabled: boolean;
  setBluetoothEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  soundMode: 'sound' | 'vibrate' | 'mute';
  setSoundMode: (mode: 'sound' | 'vibrate' | 'mute') => void;
  soundEffects: boolean;
  setSoundEffects: (enabled: boolean) => void;
  airplaneMode: boolean;
  setAirplaneMode: React.Dispatch<React.SetStateAction<boolean>>;
  autoRotate: boolean;
  setAutoRotate: React.Dispatch<React.SetStateAction<boolean>>;
  brightness: number;
  setBrightness: (val: number) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // Notifications
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // User Authentication
  user: StudentUserProfile | null;
  login: () => Promise<void>;
  loginWithStudent: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
}

const LauncherContext = createContext<LauncherContextType | null>(null);

export const LauncherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, startTransition] = useTransition();

  // Platform Navigation: starts on 'landing'
  const [platformView, setPlatformViewState] = useState<PlatformView>(() => {
    try {
      const saved = localStorage.getItem('samsung_platform_view') as PlatformView;
      return saved === 'simulator' ? 'simulator' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const setPlatformView = (view: PlatformView) => {
    setPlatformViewState(view);
    try {
      localStorage.setItem('samsung_platform_view', view);
    } catch {}
  };

  // Screen states
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isRecentAppsOpen, setIsRecentAppsOpen] = useState<boolean>(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState<boolean>(false);

  // Active / running app
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [recentAppIds, setRecentAppIds] = useState<string[]>([]);

  // Default 18 Apps requested by user
  const DEFAULT_18_APPS = [
    'gallery',
    'calculator',
    'maps',
    'clock',
    'settings',
    'camera',
    'store',
    'instagram',
    'gmail',
    'telegram',
    'twitter',
    'tiktok',
    'google',
    'drive',
    'facebook',
    'messenger',
    'whatsapp',
    'youtube',
  ];

  // Installed Web Apps state (persisted)
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('samsung_installed_web_apps_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_18_APPS;
  });

  const installWebApp = (appId: string, appNameAr: string) => {
    playTapSound(soundEffects);
    setInstalledAppIds((prev) => {
      if (prev.includes(appId)) return prev;
      const updated = [...prev, appId];
      try {
        localStorage.setItem('samsung_installed_web_apps', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `install-app-${Date.now()}`,
        appId: 'store',
        appName: 'المتجر',
        title: `تم تثبيت ${appNameAr}`,
        body: 'تمت إضافة التطبيق إلى درج التطبيقات بنجاح.',
        time: 'الآن',
      },
      ...prev,
    ]);
  };

  const uninstallWebApp = (appId: string) => {
    playTapSound(soundEffects);
    setInstalledAppIds((prev) => {
      const updated = prev.filter((id) => id !== appId);
      try {
        localStorage.setItem('samsung_installed_web_apps', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    closeApp(appId);
  };

  // Installed Games from localStorage
  const [installedGames, setInstalledGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem('samsung_installed_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wallpaper Theme
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperOption>(() => {
    try {
      const savedWpId = localStorage.getItem('samsung_launcher_wallpaper');
      const found = WALLPAPERS.find((w) => w.id === savedWpId);
      return found || WALLPAPERS[0];
    } catch {
      return WALLPAPERS[0];
    }
  });

  // Custom User Uploaded Wallpapers (Separate for Home and Lock)
  const [customHomeWallpaper, setCustomHomeWallpaperState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('samsung_custom_home_wallpaper');
    } catch {
      return null;
    }
  });

  const [customLockWallpaper, setCustomLockWallpaperState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('samsung_custom_lock_wallpaper');
    } catch {
      return null;
    }
  });

  const setCustomHomeWallpaper = (dataUrl: string | null) => {
    setCustomHomeWallpaperState(dataUrl);
    try {
      if (dataUrl) localStorage.setItem('samsung_custom_home_wallpaper', dataUrl);
      else localStorage.removeItem('samsung_custom_home_wallpaper');
    } catch {}
  };

  const setCustomLockWallpaper = (dataUrl: string | null) => {
    setCustomLockWallpaperState(dataUrl);
    try {
      if (dataUrl) localStorage.setItem('samsung_custom_lock_wallpaper', dataUrl);
      else localStorage.removeItem('samsung_custom_lock_wallpaper');
    } catch {}
  };

  // Lock Screen Security (PIN / Password / Pattern)
  const [lockType, setLockType] = useState<LockType>(() => {
    try {
      return (localStorage.getItem('samsung_lock_type') as LockType) || 'swipe';
    } catch {
      return 'swipe';
    }
  });

  const [lockSecret, setLockSecret] = useState<string>(() => {
    try {
      return localStorage.getItem('samsung_lock_secret') || '';
    } catch {
      return '';
    }
  });

  const updateLockSecurity = (
    newType: LockType,
    newSecret: string,
    oldSecret?: string
  ): { success: boolean; error?: string } => {
    // If a secret is already configured and newType is not 'swipe', must verify old secret
    if (lockType !== 'swipe' && lockSecret) {
      if (oldSecret !== lockSecret) {
        return { success: false, error: 'الرمز الحالي غير صحيح! يرجى إدخال الرمز القديم أولاً' };
      }
    }

    setLockType(newType);
    setLockSecret(newSecret);
    try {
      localStorage.setItem('samsung_lock_type', newType);
      localStorage.setItem('samsung_lock_secret', newSecret);
    } catch {}

    return { success: true };
  };

  const verifyLockSecret = (input: string): boolean => {
    if (lockType === 'swipe') return true;
    return input.trim() === lockSecret.trim();
  };

  // System Controls
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [wifiEnabled, setWifiEnabled] = useState<boolean>(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(true);
  const [soundMode, setSoundMode] = useState<'sound' | 'vibrate' | 'mute'>('sound');
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [airplaneMode, setAirplaneMode] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // User Auth
  const [user, setUser] = useState<StudentUserProfile | null>(() => getPersistedUser());
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // System Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      appId: 'settings',
      appName: 'نظام أندرويد 16',
      title: 'مرحباً بك في Samsung Galaxy Tab A11',
      body: 'تم تشغيل واجهة One UI 7 المخصصة للطلاب بنجاح.',
      time: 'الآن',
    },
  ]);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Battery status API
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).getBattery?.().then((bat: any) => {
        setBatteryLevel(Math.round(bat.level * 100));
        setIsCharging(bat.charging);
      }).catch(() => {});
    }
  }, []);

  // Combine system/web apps (filtered by installedAppIds) and installed games
  const allApps: AppDefinition[] = React.useMemo(() => {
    const installedSystemApps = SYSTEM_APPS.filter((app) => installedAppIds.includes(app.id));
    const gamesAsApps: AppDefinition[] = installedGames.map((game) => ({
      id: `game-${game.id}`,
      titleAr: game.name,
      titleEn: game.name,
      iconType: 'game',
      iconBg: 'bg-indigo-600 shadow-md text-white',
      type: 'game',
      webUrl: game.url,
      isCore: false,
      inDock: false,
    }));
    return [...installedSystemApps, ...gamesAsApps];
  }, [installedAppIds, installedGames]);

  const activeApp = allApps.find((a) => a.id === activeAppId) || null;

  const recentApps = recentAppIds
    .map((id) => allApps.find((a) => a.id === id))
    .filter((a): a is AppDefinition => !!a);

  // Sounds & unlock
  const unlock = () => {
    playUnlockSound(soundEffects);
    setIsLocked(false);
  };

  const lock = () => {
    playTapSound(soundEffects);
    setIsLocked(true);
    setIsDrawerOpen(false);
    setIsNotificationOpen(false);
    setIsRecentAppsOpen(false);
    setActiveAppId(null);
  };

  const launchSimulator = () => {
    playTapSound(soundEffects);
    setPlatformView('simulator');
    setIsLocked(true);
  };

  const exitToLanding = () => {
    playTapSound(soundEffects);
    setPlatformView('landing');
  };

  const openApp = (appId: string) => {
    playTapSound(soundEffects);

    // Launch all official web apps (YouTube, Google, ChatGPT, etc.) in real window
    const appToLaunch = allApps.find((a) => a.id === appId);
    if (appToLaunch && appToLaunch.type === 'web' && appToLaunch.webUrl) {
      window.open(appToLaunch.webUrl, '_blank');
      setRecentAppIds((prev) => [appId, ...prev.filter((id) => id !== appId)]);
      return;
    }

    startTransition(() => {
      setActiveAppId(appId);
      setIsDrawerOpen(false);
      setIsNotificationOpen(false);
      setIsRecentAppsOpen(false);
      setRecentAppIds((prev) => {
        const filtered = prev.filter((id) => id !== appId);
        return [appId, ...filtered];
      });
    });
  };

  const closeApp = (appId?: string) => {
    playTapSound(soundEffects);
    const target = appId || activeAppId;
    if (target === activeAppId) {
      setActiveAppId(null);
    }
    if (target) {
      setRecentAppIds((prev) => prev.filter((id) => id !== target));
    }
  };

  const closeAllApps = () => {
    playTapSound(soundEffects);
    setActiveAppId(null);
    setRecentAppIds([]);
    setIsRecentAppsOpen(false);
  };

  const minimizeToHome = () => {
    playTapSound(soundEffects);
    setActiveAppId(null);
    setIsDrawerOpen(false);
    setIsNotificationOpen(false);
    setIsRecentAppsOpen(false);
    setIsWallpaperModalOpen(false);
  };

  const handleBackButton = () => {
    playTapSound(soundEffects);
    if (isWallpaperModalOpen) {
      setIsWallpaperModalOpen(false);
      return;
    }
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
      return;
    }
    if (isRecentAppsOpen) {
      setIsRecentAppsOpen(false);
      return;
    }
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      return;
    }
    if (activeAppId) {
      setActiveAppId(null);
      return;
    }
  };

  const setWallpaper = (wp: WallpaperOption) => {
    playTapSound(soundEffects);
    setCurrentWallpaper(wp);
    try {
      localStorage.setItem('samsung_launcher_wallpaper', wp.id);
    } catch {}
  };

  const installGame = (game: GameItem) => {
    playTapSound(soundEffects);
    setInstalledGames((prev) => {
      const exists = prev.some((g) => g.id === game.id);
      if (exists) return prev;
      const updated = [...prev, { ...game, installed: true }];
      try {
        localStorage.setItem('samsung_installed_games', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setNotifications((prev) => [
      {
        id: `install-${Date.now()}`,
        appId: 'store',
        appName: 'المتجر',
        title: `تم تثبيت ${game.name}`,
        body: 'تمت إضافة اللعبة إلى درج التطبيقات بنجاح.',
        time: 'الآن',
      },
      ...prev,
    ]);
  };

  const uninstallGame = (gameId: string) => {
    playTapSound(soundEffects);
    setInstalledGames((prev) => {
      const updated = prev.filter((g) => g.id !== gameId && `game-${g.id}` !== gameId);
      try {
        localStorage.setItem('samsung_installed_games', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    closeApp(`game-${gameId}`);
  };

  const dismissNotification = (id: string) => {
    playTapSound(soundEffects);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    playTapSound(soundEffects);
    setNotifications([]);
  };

  const toggleFullscreen = () => {
    playTapSound(soundEffects);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const login = async () => {
    setIsLoggingIn(true);
    try {
      const prof = await signInWithGoogle();
      setUser(prof);
      setNotifications((prev) => [
        {
          id: `login-${Date.now()}`,
          appId: 'google',
          appName: 'حساب Google',
          title: `مرحباً ${prof.displayName || 'يا صديقي'}!`,
          body: `تم تسجيل الدخول بنجاح: ${prof.email}`,
          time: 'الآن',
        },
        ...prev,
      ]);
    } catch (err) {
      console.warn('Google popup blocked, using student Google account fallback:', err);
      const prof = await signInStudentAccount('khaldkhaldsamynajhbdallym@gmail.com', 'خالد سامي');
      setUser(prof);
      setNotifications((prev) => [
        {
          id: `login-${Date.now()}`,
          appId: 'google',
          appName: 'حساب Google',
          title: `مرحباً ${prof.displayName}!`,
          body: `تم تسجيل الدخول بنجاح: ${prof.email}`,
          time: 'الآن',
        },
        ...prev,
      ]);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithStudent = async (email: string, name: string) => {
    setIsLoggingIn(true);
    try {
      const prof = await signInStudentAccount(email, name);
      setUser(prof);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    playTapSound(soundEffects);
    await signOutUser();
    setUser(null);
  };

  return (
    <LauncherContext.Provider
      value={{
        platformView,
        setPlatformView,
        launchSimulator,
        exitToLanding,
        isLocked,
        unlock,
        lock,
        isDrawerOpen,
        setDrawerOpen: setIsDrawerOpen,
        isNotificationOpen,
        setNotificationOpen: setIsNotificationOpen,
        isRecentAppsOpen,
        setRecentAppsOpen: setIsRecentAppsOpen,
        isWallpaperModalOpen,
        setWallpaperModalOpen: setIsWallpaperModalOpen,
        allApps,
        activeApp,
        recentApps,
        installedGames,
        installedAppIds,
        installWebApp,
        uninstallWebApp,
        openApp,
        closeApp,
        closeAllApps,
        minimizeToHome,
        handleBackButton,
        installGame,
        uninstallGame,
        currentWallpaper,
        setWallpaper,
        customHomeWallpaper,
        setCustomHomeWallpaper,
        customLockWallpaper,
        setCustomLockWallpaper,
        lockType,
        lockSecret,
        updateLockSecurity,
        verifyLockSecret,
        currentTime,
        batteryLevel,
        isCharging,
        wifiEnabled,
        setWifiEnabled,
        bluetoothEnabled,
        setBluetoothEnabled,
        soundMode,
        setSoundMode,
        soundEffects,
        setSoundEffects,
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
        user,
        login,
        loginWithStudent,
        logout,
        isLoggingIn,
      }}
    >
      {children}
    </LauncherContext.Provider>
  );
};


export function useLauncher() {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error('useLauncher must be used within a LauncherProvider');
  }
  return context;
}
