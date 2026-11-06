/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  Search,
  Bell,
  Home,
  Users,
  Video,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface PostItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'fb-1',
    author: 'الصفحة الرسمية لوزارة التربية والتعليم',
    avatar: '🏛️',
    time: 'منذ ساعتين',
    content: 'أهلاً بأبنائنا الطلاب مع بداية العام الدراسي الجديد! تم توفير جميع الكتب المدرسية والمناهج التفاعلية عبر أجهزة التابلت والمنصات التعليمية المعتمدة مجاناً لكافة الطلاب. نتمنى لكم عاماً حافلاً بالتميز والتفوق.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&auto=format&fit=crop&q=80',
    likes: 1240,
    comments: 310,
  },
  {
    id: 'fb-2',
    author: 'أكاديمية العلوم والبرمجة',
    avatar: '💻',
    time: 'منذ 5 ساعات',
    content: 'هل تعلم أن تعلم أساسيات البرمجة في سن مبكرة يطور مهارات التفكير المنطقي وحل المشكلات بنسبة تتجاوز 70%؟ شاركونا في التعليقات: ما هي لغتكم البرمجية المفضلة؟',
    likes: 890,
    comments: 145,
  },
];

export const FacebookApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [postText, setPostText] = useState('');

  const handleLike = (id: string) => {
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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    playTapSound(soundEffects);

    const newP: PostItem = {
      id: `fb-${Date.now()}`,
      author: user?.displayName || 'طالب متميز',
      avatar: '👨‍🎓',
      time: 'الآن',
      content: postText.trim(),
      likes: 1,
      comments: 0,
      isLiked: true,
    };

    setPosts([newP, ...posts]);
    setPostText('');
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-[#18191a] text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Top Facebook Header */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#242526] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white font-black text-2xl flex items-center justify-center shadow">
            f
          </div>
          <span className="font-bold text-sm sm:text-base text-white">Facebook</span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#18191a] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-[#1877F2] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-[#1877F2] text-white font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>
      </div>

      {viewMode === 'official' ? (
        <div className="flex-1 w-full h-full relative bg-black">
          <iframe
            src="https://m.facebook.com"
            title="Facebook Official Web"
            className="w-full h-full border-none bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4">
        {/* Create Post Card */}
        <div className="bg-[#242526] border border-white/5 rounded-2xl p-4 shadow flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow">
              {user?.displayName ? user.displayName[0] : 'S'}
            </div>
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="بماذا تفكر يا صديقي؟ شارك زملاءك..."
              className="flex-1 bg-[#3a3b3c] hover:bg-[#4e4f50] rounded-full px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs text-white/70">
            <button
              type="button"
              onClick={handleCreatePost}
              className="flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-lg text-emerald-400 font-semibold cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>نشر صورة</span>
            </button>
            <button
              type="button"
              onClick={handleCreatePost}
              className="px-5 py-1.5 bg-[#1877F2] hover:bg-blue-600 text-white font-bold rounded-lg cursor-pointer"
            >
              نشر
            </button>
          </div>
        </div>

        {/* Posts Stream */}
        {posts.map((post) => (
          <div key={post.id} className="bg-[#242526] border border-white/5 rounded-2xl p-4 shadow flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg shadow">
                  {post.avatar}
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-xs sm:text-sm text-white">{post.author}</span>
                  <span className="text-[10px] text-white/50">{post.time}</span>
                </div>
              </div>
              <button type="button" className="text-white/40 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{post.content}</p>

            {post.image && (
              <div className="rounded-xl overflow-hidden aspect-video w-full bg-slate-900 border border-white/5">
                <img src={post.image} alt="post" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-white/50 border-b border-white/5 pb-2">
              <div className="flex items-center gap-1">
                <span>👍</span>
                <span>{post.likes}</span>
              </div>
              <span>{post.comments} تعليقاً</span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-xs font-semibold text-white/70">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ${
                  post.isLiked ? 'text-[#1877F2] font-bold' : ''
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>إعجاب</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تعليق</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
