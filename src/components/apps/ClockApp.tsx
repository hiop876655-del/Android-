/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AlarmClock, Globe, Timer, Watch, Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

export const ClockApp: React.FC = () => {
  const { soundEffects, currentTime } = useLauncher();
  const [activeTab, setActiveTab] = useState<'alarm' | 'world' | 'stopwatch' | 'timer'>('stopwatch');

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Stopwatch tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
      milliseconds
    ).padStart(2, '0')}`;
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col justify-between select-none">
      {/* Top Tabs (One UI Clock) */}
      <div className="flex items-center justify-around border-b border-white/10 bg-slate-900/50 py-3">
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEffects);
            setActiveTab('alarm');
          }}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
            activeTab === 'alarm' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <AlarmClock className="w-4 h-4" />
          <span>المنبه</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(soundEffects);
            setActiveTab('world');
          }}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
            activeTab === 'world' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>الساعة العالمية</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(soundEffects);
            setActiveTab('stopwatch');
          }}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
            activeTab === 'stopwatch' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <Watch className="w-4 h-4" />
          <span>ساعة الإيقاف</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(soundEffects);
            setActiveTab('timer');
          }}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
            activeTab === 'timer' ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>المؤقت</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        {activeTab === 'stopwatch' && (
          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="text-6xl sm:text-7xl font-mono font-light tracking-tight text-white drop-shadow-md">
              {formatStopwatch(stopwatchTime)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setIsStopwatchRunning(!isStopwatchRunning);
                }}
                className={`w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer ${
                  isStopwatchRunning ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isStopwatchRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  if (isStopwatchRunning) {
                    setLaps([stopwatchTime, ...laps]);
                  } else {
                    setStopwatchTime(0);
                    setLaps([]);
                  }
                }}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              >
                {isStopwatchRunning ? (
                  <span className="text-xs font-bold">دورة</span>
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="w-full flex flex-col gap-2 max-h-48 overflow-y-auto border-t border-white/10 pt-4">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-white/70 py-1 px-4 bg-white/5 rounded-lg">
                    <span>الدورة {laps.length - idx}</span>
                    <span className="font-mono text-white">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="text-6xl sm:text-7xl font-mono font-light tracking-tight text-white">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer ${
                  isTimerRunning ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setIsTimerRunning(false);
                  setTimerSeconds(300);
                }}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              {[60, 300, 600, 1800].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    playTapSound(soundEffects);
                    setTimerSeconds(sec);
                    setIsTimerRunning(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-full text-white cursor-pointer"
                >
                  +{sec / 60} دقيقة
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alarm' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-2xl font-light">07:00 ص</span>
                <p className="text-xs text-white/50">منبه الصباح للدروس والمذاكرة</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle accent-blue-500 w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-2xl font-light">02:30 م</span>
                <p className="text-xs text-white/50">استراحة الغداء</p>
              </div>
              <input type="checkbox" className="toggle accent-blue-500 w-5 h-5" />
            </div>
          </div>
        )}

        {activeTab === 'world' && (
          <div className="w-full max-w-md flex flex-col gap-3">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">القاهرة، مصر</h3>
                <span className="text-xs text-white/50">التوقيت المحلي</span>
              </div>
              <span className="text-xl font-mono font-light">
                {currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">مكة المكرمة</h3>
                <span className="text-xs text-white/50">+1 ساعة</span>
              </div>
              <span className="text-xl font-mono font-light">
                {new Date(currentTime.getTime() + 3600000).toLocaleTimeString('ar-EG', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
