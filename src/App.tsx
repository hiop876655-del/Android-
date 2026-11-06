/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LauncherProvider, useLauncher } from './context/LauncherContext';
import { StatusBar } from './components/StatusBar';
import { NavigationBar } from './components/NavigationBar';
import { HomeScreen } from './components/HomeScreen';
import { LockScreen } from './components/LockScreen';
import { AppDrawer } from './components/AppDrawer';
import { NotificationPanel } from './components/NotificationPanel';
import { RecentAppsModal } from './components/RecentAppsModal';
import { WallpaperModal } from './components/WallpaperModal';
import { AppWindow } from './components/AppWindow';
import { LandingPage } from './components/LandingPage';
import { GatewayPage } from './components/GatewayPage';

const TabletViewport: React.FC = () => {
  const { currentWallpaper, customHomeWallpaper, brightness } = useLauncher();

  // Screen dimming calculation based on brightness slider
  const dimOpacity = Math.max(0, (100 - brightness) * 0.007);

  // Background style: prefers custom user uploaded wallpaper if set, otherwise Material You gradient
  const backgroundStyle: React.CSSProperties = customHomeWallpaper
    ? {
        backgroundImage: `url(${customHomeWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: currentWallpaper.gradient,
      };

  return (
    <div
      className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden select-none relative"
      dir="rtl"
    >
      {/* Main Tablet Display Frame - Clean full viewport without intrusive floating buttons */}
      <div
        className="relative flex flex-col justify-between overflow-hidden transition-all duration-300 w-full h-full"
        style={backgroundStyle}
      >
        {/* Dynamic Material You Accent Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500 opacity-20"
          style={{
            boxShadow: `inset ${currentWallpaper.theme.glow}`,
          }}
        />

        {/* Top Status Bar */}
        <StatusBar />

        {/* Main Desktop Workspace / Home Screen & In-Frame App Runner */}
        <main className="relative flex-1 w-full h-full flex flex-col overflow-hidden">
          <HomeScreen />
          <AppWindow />
        </main>

        {/* Bottom One UI Navigation Bar */}
        <NavigationBar />

        {/* Fullscreen System Overlays */}
        <AppDrawer />
        <NotificationPanel />
        <RecentAppsModal />
        <WallpaperModal />
        <LockScreen />

        {/* Screen Brightness Dimming Overlay */}
        <div
          className="absolute inset-0 bg-black pointer-events-none z-60 transition-opacity duration-150"
          style={{ opacity: dimOpacity }}
        />
      </div>
    </div>
  );
};

const PlatformRouter: React.FC = () => {
  const { platformView } = useLauncher();

  if (platformView === 'landing') {
    return <LandingPage />;
  }

  if (platformView === 'gateway') {
    return <GatewayPage />;
  }

  return <TabletViewport />;
};

export default function App() {
  return (
    <LauncherProvider>
      <PlatformRouter />
    </LauncherProvider>
  );
}
