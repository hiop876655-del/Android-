/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  Search,
  Sparkles,
  TrendingUp,
  Send,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface TweetItem {
  id: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked?: boolean;
}

const INITIAL_TWEETS: TweetItem[] = [
  {
    id: 'tw-1',
    name: 'أخبار التعليم والتكنولوجيا',
    handle: '@EduTechNews',
    time: 'منذ ساعتين',
    content: 'تحديثات هامة: أجهزة سامسونج اللوحية المخصصة للمدارس تدعم الآن أحدث أدوات الذكاء الاصطناعي وبنك المعرفة لخدمة الطلاب في مختلف المراحل الدراسية. 🚀📱 #التعليم_المصري #تكنولوجيا_التعليم',
    likes: 540,
    retweets: 120,
    replies: 45,
  },
  {
    id: 'tw-2',
    name: 'مجتمع البرمجة والذكاء الاصطناعي',
    handle: '@AIEgypt',
    time: 'منذ 4 ساعات',
    content: 'إذا كنت طالباً، فتعلم كيفية صياغة الأوامر (Prompt Engineering) لأنظمة ChatGPT و Gemini سيوفر عليك مئات الساعات في البحث والمذاكرة! 💡',
    likes: 820,
    retweets: 240,
    replies: 68,
  },
];

export const TwitterApp: React.FC = () => {
  const { soundEffects, user } = useLauncher();
  const [tweets, setTweets] = useState(INITIAL_TWEETS);
  const [tweetText, setTweetText] = useState('');

  const handleLike = (id: string) => {
    playTapSound(soundEffects);
    setTweets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isLiked: !t.isLiked,
              likes: t.isLiked ? t.likes - 1 : t.likes + 1,
            }
          : t
      )
    );
  };

  const handlePostTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;
    playTapSound(soundEffects);

    const newT: TweetItem = {
      id: `tw-${Date.now()}`,
      name: user?.displayName || 'طالب متميز',
      handle: '@StudentA11',
      time: 'الآن',
      content: tweetText.trim(),
      likes: 1,
      retweets: 0,
      replies: 0,
      isLiked: true,
    };

    setTweets([newT, ...tweets]);
    setTweetText('');
  };

  const [viewMode, setViewMode] = useState<'official' | 'tablet'>('official');

  return (
    <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none overflow-hidden" dir="rtl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0 bg-black">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl tracking-tighter">𝕏</span>
          <span className="text-sm font-bold text-white/80">منصة X (تويتر)</span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('official')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'official' ? 'bg-white text-black font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            الموقع الرسمي الحقيقي
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tablet')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              viewMode === 'tablet' ? 'bg-white text-black font-bold shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            واجهة التابلت السريعة
          </button>
        </div>
      </div>

      {viewMode === 'official' ? (
        <div className="flex-1 w-full h-full relative bg-black">
          <iframe
            src="https://x.com"
            title="X Official Web"
            className="w-full h-full border-none bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
        {/* Feed Stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/10">
          {/* Tweet Composer */}
          <form onSubmit={handlePostTweet} className="p-4 flex gap-3 bg-neutral-950">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.displayName ? user.displayName[0] : 'S'}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="ماذا يحدث في مدرستك ودراستك الآن؟"
                className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none resize-none"
                rows={2}
              />
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                  <span>#تعليم</span>
                  <span>#مذاكرة</span>
                </div>
                <button
                  type="submit"
                  disabled={!tweetText.trim()}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    tweetText.trim()
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  نشر التغريدة
                </button>
              </div>
            </div>
          </form>

          {/* Tweets */}
          {tweets.map((t) => (
            <div key={t.id} className="p-4 sm:p-5 flex gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                {t.name[0]}
              </div>
              <div className="flex-1 flex flex-col gap-1.5 text-right">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-white/40" dir="ltr">{t.handle}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/40">{t.time}</span>
                </div>

                <p className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{t.content}</p>

                {/* Tweet Actions */}
                <div className="flex items-center justify-between text-xs text-white/50 pt-2 max-w-md">
                  <button type="button" className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.replies}</span>
                  </button>

                  <button type="button" className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                    <Repeat2 className="w-4 h-4" />
                    <span>{t.retweets}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLike(t.id)}
                    className={`flex items-center gap-1.5 hover:text-pink-500 cursor-pointer ${
                      t.isLiked ? 'text-pink-500 font-bold' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${t.isLiked ? 'fill-pink-500' : ''}`} />
                    <span>{t.likes}</span>
                  </button>

                  <button type="button" className="hover:text-blue-400 cursor-pointer">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Trends Sidebar */}
        <div className="hidden lg:block w-80 p-4 border-r border-white/10 shrink-0 bg-neutral-950">
          <div className="bg-[#16181c] rounded-2xl p-4 border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>المتداول في مصر والعالم العربي</span>
            </h3>

            <div className="flex flex-col gap-3 text-right">
              {[
                { tag: '#التعليم_الذكي', count: '48.2 ألف تغريدة' },
                { tag: '#الثانوية_العامة_2026', count: '125 ألف تغريدة' },
                { tag: '#تابلت_سامسونج', count: '32.1 ألف تغريدة' },
                { tag: '#بنك_المعرفة_المصري', count: '18.9 ألف تغريدة' },
              ].map((tr, i) => (
                <div key={i} className="flex flex-col cursor-pointer hover:bg-white/5 p-1.5 rounded-xl">
                  <span className="text-xs text-white/40">موضوع شائع في التعليم</span>
                  <span className="font-bold text-xs text-white">{tr.tag}</span>
                  <span className="text-[10px] text-white/40">{tr.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
