/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

export const CalculatorApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const handlePress = (char: string) => {
    playTapSound(soundEffects);
    if (isCalculated) {
      if (['+', '−', '×', '÷'].includes(char)) {
        setEquation(display + ' ' + char + ' ');
        setDisplay('0');
      } else {
        setDisplay(char);
        setEquation('');
      }
      setIsCalculated(false);
      return;
    }

    if (display === '0' && !isNaN(Number(char))) {
      setDisplay(char);
    } else {
      setDisplay((prev) => prev + char);
    }
  };

  const handleOperator = (op: string) => {
    playTapSound(soundEffects);
    setEquation((prev) => prev + display + ' ' + op + ' ');
    setDisplay('0');
    setIsCalculated(false);
  };

  const handleClear = () => {
    playTapSound(soundEffects);
    setDisplay('0');
    setEquation('');
    setIsCalculated(false);
  };

  const handleBackspace = () => {
    playTapSound(soundEffects);
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleCalculate = () => {
    playTapSound(soundEffects);
    try {
      const fullExp = (equation + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      // eslint-disable-next-line no-eval
      const result = eval(fullExp);
      setEquation((equation + display + ' ='));
      setDisplay(String(result));
      setIsCalculated(true);
    } catch {
      setDisplay('خطأ');
      setIsCalculated(true);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 max-w-lg mx-auto select-none">
      {/* Display Screen */}
      <div className="flex-1 flex flex-col justify-end items-end p-4 text-right">
        <div className="text-sm font-mono text-white/50 h-6 overflow-hidden">{equation}</div>
        <div className="text-5xl sm:text-6xl font-light font-mono tracking-tight text-white mt-2 overflow-x-auto w-full text-right">
          {display}
        </div>
      </div>

      {/* Calculator Buttons Grid (Samsung One UI Green / Dark Theme) */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 pb-4">
        {/* Row 1 */}
        <button
          type="button"
          onClick={handleClear}
          className="h-16 rounded-full bg-red-500/20 text-red-400 font-semibold text-xl active:scale-95 transition-all"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handlePress('(')}
          className="h-16 rounded-full bg-white/10 text-emerald-400 font-semibold text-xl active:scale-95 transition-all"
        >
          ( )
        </button>
        <button
          type="button"
          onClick={() => handlePress('%')}
          className="h-16 rounded-full bg-white/10 text-emerald-400 font-semibold text-xl active:scale-95 transition-all"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => handleOperator('÷')}
          className="h-16 rounded-full bg-emerald-600/40 text-emerald-300 font-semibold text-2xl active:scale-95 transition-all"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => handlePress('7')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handlePress('8')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handlePress('9')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleOperator('×')}
          className="h-16 rounded-full bg-emerald-600/40 text-emerald-300 font-semibold text-2xl active:scale-95 transition-all"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => handlePress('4')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handlePress('5')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handlePress('6')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleOperator('−')}
          className="h-16 rounded-full bg-emerald-600/40 text-emerald-300 font-semibold text-2xl active:scale-95 transition-all"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => handlePress('1')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handlePress('2')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handlePress('3')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => handleOperator('+')}
          className="h-16 rounded-full bg-emerald-600/40 text-emerald-300 font-semibold text-2xl active:scale-95 transition-all"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => handlePress('+/-')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xl active:scale-95 transition-all"
        >
          +/-
        </button>
        <button
          type="button"
          onClick={() => handlePress('0')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handlePress('.')}
          className="h-16 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-2xl active:scale-95 transition-all"
        >
          .
        </button>
        <button
          type="button"
          onClick={handleCalculate}
          className="h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
};
