/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLauncher } from '../context/LauncherContext';
import { Wifi, WifiOff, Battery, BatteryCharging, Bluetooth, Volume2, VolumeX, Bell } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    currentTime,
    batteryLevel,
    isCharging,
    wifiEnabled,
    bluetoothEnabled,
    soundMode,
    notifications,
    setNotificationOpen,
    isNotificationOpen,
  } = useLauncher();

  const formattedTime = currentTime.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <header
      onClick={() => setNotificationOpen(!isNotificationOpen)}
      className="h-8 w-full z-40 px-4 md:px-6 flex items-center justify-between text-white select-none cursor-pointer transition-colors hover:bg-black/10 text-xs font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
      title="اسحب أو اضغط لفتح لوحة الإشعارات والإعدادات السريعة"
    >
      {/* Right side in RTL (Time & Notifications) */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[13px] tracking-wider">{formattedTime}</span>

        {/* Small notification indicator */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
            <Bell className="w-2.5 h-2.5 fill-white" />
            <span>{notifications.length}</span>
          </div>
        )}
      </div>

      {/* Center drag pill handle for pulling notification shade */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="w-12 h-1 bg-white/30 rounded-full hover:bg-white/60 transition-colors" />
      </div>

      {/* Left side in RTL (Hardware status icons) */}
      <div className="flex items-center gap-2.5">
        {bluetoothEnabled && <Bluetooth className="w-3.5 h-3.5 text-white/90" />}
        
        {soundMode === 'mute' && <VolumeX className="w-3.5 h-3.5 text-red-400" />}
        {soundMode === 'sound' && <Volume2 className="w-3.5 h-3.5 text-white/80" />}

        {wifiEnabled ? (
          <Wifi className="w-3.5 h-3.5 text-white" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-white/50" />
        )}

        {/* Cellular Signal Bars */}
        <div className="flex items-end gap-[1.5px] h-3 px-0.5" title="الشبكة 5G">
          <span className="w-[2px] h-1 bg-white rounded-full" />
          <span className="w-[2px] h-1.5 bg-white rounded-full" />
          <span className="w-[2px] h-2 bg-white rounded-full" />
          <span className="w-[2px] h-3 bg-white rounded-full" />
        </div>

        {/* Battery with percentage */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono">{batteryLevel}%</span>
          <div className="relative flex items-center">
            {isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="relative">
                <Battery className="w-4 h-4 text-white" />
                <div
                  className="absolute top-[4.5px] left-[2.5px] h-[7px] bg-white rounded-[1px]"
                  style={{ width: `${Math.max(2, (batteryLevel / 100) * 8)}px` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
