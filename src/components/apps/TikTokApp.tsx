/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music2,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface TikTokVideo {
  id: string;
  creator: string;
  tag: string;
  title: string;
  soundTitle: string;
  likes: number;
  comments: number;
  videoUrl: string;
  poster: string;
}

const REELS: TikTokVideo[] = [
  {
    id: 'tk-1',
    creator: 'physics_student',
    tag: '@عالم_الفيزياء',
    title: 'تجربة انكسار الضوء في المنشور الزجاجي وقوس قزح 🌈✨ #فيزياء #ثانوية_عامة #علوم',
    soundTitle: 'الصوت الأصلي - فيزياء للجميع',
    likes: 24500,
    comments: 890,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-4848-large.mp4',
    poster: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tk-2',
    creator: 'study_with_me',
    tag: '@يوميات_طالب_متفوق',
    title: 'أفضل طريقة لتنظيم وقت المذاكرة باستخدام تقنية بومودورو 25 دقيقة ⏰📚 #مذاكرة #تحفيز',
    soundTitle: 'Lofi Study Beats - Focus',
    likes: 48900,
    comments: 1420,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41221-large.mp4',
    poster: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tk-3',
    creator: 'space_facts',
    tag: '@عجائب_الفضاء',
    title: 'كم يستغرق الضوء ليصل من الشمس إلى كوكب الأرض؟ ☀️🚀 #فضاء #معلومات_عامة',
    soundTitle: 'Interstellar Theme - Space Ambient',
    likes: 67200,
    comments: 2100,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-sky-at-night-with-clouds-moving-41133-large.mp4',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
];

export const TikTokApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    REELS.forEach((r) => {
      map[r.id] = r.likes;
    });
    return map;
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentReel = REELS[currentIndex];

  const handleNext = () => {
    playTapSound(soundEffects);
    if (currentIndex < REELS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    playTapSound(soundEffects);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(REELS.length - 1);
    }
  };

  const handleLike = (id: string) => {
    playTapSound(soundEffects);
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesMap((prev) => ({ ...prev, [id]: prev[id] + (isLiked ? -1 : 1) }));
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none overflow-hidden relative">
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black border border-white/20 flex items-center justify-center font-black text-xs text-white">
            TT
          </div>
          <span className="font-bold text-base tracking-wide">TikTok</span>
        </div>

        {/* View Mode Toggle: Official Real Web vs Tablet Client */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/20 text-xs backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {viewMode === 'official' ? (
        <div className="flex-1 w-full h-full relative pt-16 bg-black">
          <iframe
            src="https://www.tiktok.com"
            title="TikTok Official Web"
            className="w-full h-full border-none bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-neutral-950 overflow-hidden">
        {/* Video Player */}
        <video
          key={currentReel.videoUrl}
          src={currentReel.videoUrl}
          poster={currentReel.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover sm:object-contain"
          onClick={() => setIsPlaying(!isPlaying)}
        />

        {/* Play/Pause Overlay indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
              <Play className="w-8 h-8 fill-white text-white ml-1" />
            </div>
          </div>
        )}

        {/* Right Side Vertical Floating Controls */}
        <div className="absolute left-4 bottom-24 sm:bottom-20 z-30 flex flex-col items-center gap-5">
          {/* Creator Avatar with follow plus */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center font-bold text-sm shadow-xl">
              {currentReel.creator[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white font-bold shadow">
              +
            </div>
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={() => handleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
              likedMap[currentReel.id] ? 'bg-red-500/20 text-red-500 scale-110' : 'bg-black/40 text-white hover:bg-black/60'
            }`}>
              <Heart className={`w-7 h-7 ${likedMap[currentReel.id] ? 'fill-red-500 text-red-500' : ''}`} />
            </div>
            <span className="text-xs font-semibold drop-shadow">{likesMap[currentReel.id]?.toLocaleString()}</span>
          </button>

          {/* Comments */}
          <button type="button" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60">
              <MessageCircle className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold drop-shadow">{currentReel.comments}</span>
          </button>

          {/* Bookmark */}
          <button type="button" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60">
              <Bookmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold drop-shadow">حفظ</span>
          </button>

          {/* Share */}
          <button type="button" className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold drop-shadow">مشاركة</span>
          </button>

          {/* Rotating Audio Disc */}
          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin">
            <Music2 className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Video Information & Captions (Bottom Right) */}
        <div className="absolute right-4 bottom-8 sm:bottom-10 z-30 max-w-lg text-right flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base drop-shadow-md text-white">{currentReel.tag}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          </div>

          <p className="text-xs sm:text-sm text-white/90 drop-shadow leading-relaxed">
            {currentReel.title}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/70">
            <Music2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">{currentReel.soundTitle}</span>
          </div>
        </div>

        {/* Swipe Up/Down Navigation Arrows */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow"
            title="السابق"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md cursor-pointer transition-transform active:scale-95 shadow"
            title="التالي"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
