/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GameItem } from '../../types';
import { SYSTEM_APPS } from '../../data/systemApps';
import { useLauncher } from '../../context/LauncherContext';
import { AppIcon } from '../AppIcon';
import { Search, Download, Check, Trash2, Sparkles, FolderPlus, ShoppingBag, ExternalLink } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

export const StoreApp: React.FC = () => {
  const {
    soundEffects,
    installedAppIds,
    installWebApp,
    uninstallWebApp,
    openApp,
    installedGames,
    installGame,
    uninstallGame,
  } = useLauncher();

  const [games, setGames] = useState<GameItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/games.json')
      .then((res) => res.json())
      .then((data: GameItem[]) => {
        setGames(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.warn('Error loading games.json:', err);
        setGames([]);
      });
  }, []);

  const categories = [
    'all',
    'الذكاء الاصطناعي',
    'التواصل الاجتماعي',
    'التعليم والأدوات',
    'المحتوى والترفيه',
    'الإنترنت والأدوات',
    'ألعاب الطلاب',
  ];

  // Store Web Apps list (excluding internal non-installable system apps like settings & clock)
  const storeWebApps = SYSTEM_APPS.filter(
    (app) => app.id !== 'settings' && app.id !== 'store' && app.id !== 'calculator' && app.id !== 'gallery' && app.id !== 'clock'
  );

  const filteredApps = storeWebApps.filter((app) => {
    const matchesSearch =
      app.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.category && app.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || activeCategory === 'ألعاب الطلاب' || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col select-none overflow-hidden" dir="rtl">
      {/* Store Header / Search Bar */}
      <div className="p-4 sm:p-6 bg-slate-900/90 border-b border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">متجر تطبيقات الويب والألعاب</h1>
              <span className="text-xs text-white/60">تثبيت وإلغاء تثبيت تطبيقات الويب المعتمدة وأشهر الألعاب</span>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="w-full flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 shadow-inner">
          <Search className="w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تطبيق أو خدمة ويب (ChatGPT, واتساب, Gemini...)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {cat === 'all' ? 'جميع الأقسام' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Web Apps Section */}
        {activeCategory !== 'ألعاب الطلاب' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>تطبيقات الويب المتاحة ({filteredApps.length})</span>
              </h2>
            </div>

            {filteredApps.length === 0 ? (
              <p className="text-xs text-white/40 py-4">لا توجد تطبيقات مطابقة لمحددات البحث.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredApps.map((app) => {
                  const isInstalled = installedAppIds.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      className="bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow hover:border-white/25 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AppIcon app={app} size="normal" showLabel={false} />
                        <div className="flex flex-col text-right min-w-0">
                          <span className="font-bold text-sm text-white truncate">{app.titleAr}</span>
                          <span className="text-[11px] text-white/50 truncate">{app.category || 'تطبيق ويب'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isInstalled ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                playTapSound(soundEffects);
                                openApp(app.id);
                              }}
                              className="flex items-center gap-1 bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-600/50 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>فتح</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => uninstallWebApp(app.id)}
                              className="flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-red-500/40 transition-colors"
                              title="إلغاء التثبيت"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => installWebApp(app.id, app.titleAr)}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow transition-transform active:scale-95 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تثبيت</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* HTML Games Section */}
        {(activeCategory === 'all' || activeCategory === 'ألعاب الطلاب') && (
          <div>
            <div className="flex items-center justify-between mb-3 mt-4">
              <h2 className="text-sm font-bold text-white/80 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-purple-400" />
                <span>ألعاب الطلاب والويب الخفيفة ({filteredGames.length})</span>
              </h2>
            </div>

            {filteredGames.length === 0 ? (
              <p className="text-xs text-white/40 py-4">لا توجد ألعاب متوفرة.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredGames.map((game) => {
                  const isInstalled = installedGames.some((g) => g.id === game.id);
                  return (
                    <div
                      key={game.id}
                      className="bg-slate-900/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow hover:border-white/25 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={game.icon || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80'}
                          alt={game.name}
                          className="w-12 h-12 rounded-2xl object-cover bg-slate-800 border border-white/10 flex-shrink-0"
                        />
                        <div className="flex flex-col text-right min-w-0">
                          <span className="font-bold text-sm text-white truncate">{game.name}</span>
                          <span className="text-[11px] text-white/50 truncate">{game.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isInstalled ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openApp(`game-${game.id}`)}
                              className="flex items-center gap-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-600/40"
                            >
                              <Check className="w-3 h-3" />
                              <span>تشغيل</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => uninstallGame(game.id)}
                              className="flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-red-500/40 transition-colors"
                              title="إلغاء التثبيت"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              playTapSound(soundEffects);
                              installGame(game);
                            }}
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow transition-transform active:scale-95 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تثبيت</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
