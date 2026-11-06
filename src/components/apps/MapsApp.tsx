/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Navigation, Compass, Layers, Plus, Minus } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

export const MapsApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [searchLocation, setSearchLocation] = useState('القاهرة، مصر');
  const [mapQuery, setMapQuery] = useState('Cairo, Egypt');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    playTapSound(soundEffects);
    setMapQuery(searchLocation.trim());
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col select-none overflow-hidden relative">
      {/* Floating Google Maps Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 max-w-md mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white text-slate-800 rounded-full px-4 py-2.5 shadow-2xl border border-black/10"
        >
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="ابحث عن مدينة أو مدرسة أو معلم..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-right px-2 font-medium"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full cursor-pointer shadow font-semibold"
          >
            بحث
          </button>
        </form>
      </div>

      {/* Embedded Live Map Frame */}
      <div className="flex-1 w-full h-full bg-neutral-900">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          title="Google Maps"
          className="w-full h-full border-none"
          loading="lazy"
        />
      </div>

      {/* Quick Location Chips */}
      <div className="absolute bottom-6 right-4 left-4 z-20 flex items-center justify-center gap-2 overflow-x-auto pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 pointer-events-auto">
          {['القاهرة', 'الإسكندرية', 'الجيزة', 'مكة المكرمة', 'الرياض'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setSearchLocation(city);
                setMapQuery(city);
              }}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
