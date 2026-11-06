/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Compass,
  PlusSquare,
  Home,
  User,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface InstaPost {
  id: string;
  user: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  time: string;
  isLiked?: boolean;
}

const POSTS: InstaPost[] = [
  {
    id: 'ig-1',
    user: 'egypt_education_2026',
    avatar: '🇪🇬',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&auto=format&fit=crop&q=80',
    caption: 'لحظات من شغف المعرفة والعمل الجماعي بين الطلاب في المعامل التكنولوجية الحديثة 🎓✨ #تعليم #مستقبل',
    likes: 3840,
    time: 'منذ 3 ساعات',
  },
  {
    id: 'ig-2',
    user: 'science_club',
    avatar: '🪐',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80',
    caption: 'صورة مذهلة التقطها تلسكوب جيمس ويب الفضائي لسديم كوني يبعد آلاف السنين الضوئية! 🔭🌟 #فضاء #علوم',
    likes: 9200,
    time: 'منذ 6 ساعات',
  },
];

export const InstagramApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [posts, setPosts] = useState(POSTS);

  const toggleLike = (id: string) => {
    playTapSound(soundEffects);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0 bg-black">
        <span className="font-serif italic text-2xl tracking-wide font-bold">Instagram</span>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>
      </div>

      {viewMode === 'official' ? (
        <div className="flex-1 w-full h-full relative bg-black">
          <iframe
            src="https://www.instagram.com"
            title="Instagram Official Web"
            className="w-full h-full border-none bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full space-y-6">
        {/* Stories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-white/10">
          {['قصتك', 'بنك المعرفة', 'الفيزياء', 'المكتبة', 'الطلاب'].map((story, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#FFB900] via-[#D62976] to-[#4F5BD5]">
                <div className="w-full h-full rounded-full bg-black border-2 border-black flex items-center justify-center font-bold text-xs">
                  {story[0]}
                </div>
              </div>
              <span className="text-[10px] text-white/70 max-w-[50px] truncate">{story}</span>
            </div>
          ))}
        </div>

        {/* Posts */}
        {posts.map((p) => (
          <div key={p.id} className="flex flex-col gap-3">
            {/* User row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-sm shadow">
                  {p.avatar}
                </div>
                <span className="font-semibold text-xs text-white">{p.user}</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-white/50" />
            </div>

            {/* Post Image */}
            <div
              onDoubleClick={() => toggleLike(p.id)}
              className="rounded-2xl overflow-hidden aspect-square w-full bg-neutral-900 border border-white/10 relative cursor-pointer"
            >
              <img src={p.image} alt="post" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleLike(p.id)}
                  className="cursor-pointer transition-transform active:scale-125"
                >
                  <Heart className={`w-6 h-6 ${p.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <MessageCircle className="w-6 h-6 text-white cursor-pointer" />
                <Send className="w-6 h-6 text-white cursor-pointer rotate-180" />
              </div>
              <Bookmark className="w-6 h-6 text-white cursor-pointer" />
            </div>

            {/* Likes count & caption */}
            <div className="text-right">
              <span className="font-bold text-xs">{p.likes.toLocaleString()} تسجيل إعجاب</span>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                <span className="font-bold ml-1.5">{p.user}</span>
                {p.caption}
              </p>
              <span className="text-[10px] text-white/40 mt-1 block">{p.time}</span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
