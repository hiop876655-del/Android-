/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { playTapSound } from '../utils/sound';

interface PatternPadProps {
  onComplete: (patternStr: string) => void;
  soundEffects: boolean;
  isError?: boolean;
  size?: number; // width/height in px, default 260
}

const DOT_COORDINATES: Record<number, { x: number; y: number }> = {
  0: { x: 45, y: 45 },
  1: { x: 130, y: 45 },
  2: { x: 215, y: 45 },
  3: { x: 45, y: 130 },
  4: { x: 130, y: 130 },
  5: { x: 215, y: 130 },
  6: { x: 45, y: 215 },
  7: { x: 130, y: 215 },
  8: { x: 215, y: 215 },
};

export const PatternPad: React.FC<PatternPadProps> = ({
  onComplete,
  soundEffects,
  isError = false,
  size = 260,
}) => {
  const [selectedDots, setSelectedDots] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addDot = (dot: number) => {
    if (!selectedDots.includes(dot)) {
      playTapSound(soundEffects);
      setSelectedDots((prev) => [...prev, dot]);
    }
  };

  const handlePointerDown = (dot: number, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsDrawing(true);
    setSelectedDots([dot]);
    playTapSound(soundEffects);
  };

  const handlePointerEnter = (dot: number) => {
    if (!isDrawing) return;
    addDot(dot);
  };

  const handlePointerUp = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!isDrawing) return;
    setIsDrawing(false);
    if (selectedDots.length > 0) {
      onComplete(selectedDots.join('-'));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dotAttr = element?.getAttribute('data-dot-index');
    if (dotAttr !== null && dotAttr !== undefined) {
      const dotIndex = parseInt(dotAttr, 10);
      if (!isNaN(dotIndex)) {
        addDot(dotIndex);
      }
    }
  };

  const strokeColor = isError ? '#ef4444' : '#3b82f6';
  const dotColor = isError ? '#ef4444' : '#60a5fa';

  return (
    <div
      ref={containerRef}
      dir="ltr"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={handlePointerUp}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerUp}
      className="relative select-none touch-none flex items-center justify-center p-3 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl"
      style={{ width: size, height: size, touchAction: 'none' }}
    >
      {/* SVG Connecting Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 260 260"
      >
        {selectedDots.map((dot, idx) => {
          if (idx === 0) return null;
          const prevDot = selectedDots[idx - 1];
          const from = DOT_COORDINATES[prevDot];
          const to = DOT_COORDINATES[dot];
          return (
            <line
              key={`${prevDot}-${dot}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={strokeColor}
              strokeWidth="5"
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          );
        })}
      </svg>

      {/* 3x3 Dots Grid forced LTR so column 0 is left and column 2 is right */}
      <div className="grid grid-cols-3 gap-10 w-full h-full place-items-center relative z-10" dir="ltr">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const isSelected = selectedDots.includes(index);
          return (
            <div
              key={index}
              data-dot-index={index}
              onMouseDown={() => handlePointerDown(index)}
              onMouseEnter={() => handlePointerEnter(index)}
              onTouchStart={() => handlePointerDown(index)}
              className="w-14 h-14 flex items-center justify-center cursor-pointer rounded-full"
            >
              <div
                data-dot-index={index}
                className={`rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'w-6 h-6 ring-8 ring-blue-500/25 scale-125'
                    : 'w-4 h-4 bg-white/70 hover:bg-white hover:scale-110'
                }`}
                style={{
                  backgroundColor: isSelected ? dotColor : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
