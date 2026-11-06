/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ThumbsUp, Share2, Bookmark, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  category: string;
  thumbnail: string;
}

const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    youtubeId: 'W1Yf7tM31fA',
    title: 'أسرار الكون والمجرات - وثائقي علمي مشوق للطلاب',
    channel: 'ناشيونال جيوغرافيك العربية',
    views: '1.2 مليون مشاهدة',
    time: 'منذ أسبوعين',
    duration: '24:18',
    category: 'علوم',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid-2',
    youtubeId: 'rfscVS0vtbw',
    title: 'تاريخ الحضارة المصرية القديمة وبناء الأهرامات',
    channel: 'معرفة وتاريخ',
    views: '850 ألف مشاهدة',
    time: 'منذ 3 أشهر',
    duration: '18:45',
    category: 'تاريخ',
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid-3',
    youtubeId: 'e-ORhEE9VVg',
    title: 'كيف يعمل الذكاء الاصطناعي؟ رحلة داخل التكنولوجيا الحديثة',
    channel: 'عالم البرمجة والذكاء الاصطناعي',
    views: '540 ألف مشاهدة',
    time: 'منذ شهر',
    duration: '15:20',
    category: 'تكنولوجيا',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid-4',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'طرق المذاكرة الفعالة وتنظيم وقت الدراسة للطلاب المتفوقين',
    channel: 'أكاديمية النجاح والتفوق',
    views: '2.1 مليون مشاهدة',
    time: 'منذ 6 أشهر',
    duration: '12:05',
    category: 'تعليم',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid-5',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'عجائب الحياة البحرية والمحيطات العميقة بجودة 4K',
    channel: 'أعماق البحار',
    views: '3.4 مليون مشاهدة',
    time: 'منذ سنة',
    duration: '32:10',
    category: 'علوم',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid-6',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'أساسيات اللغة الإنجليزية في 20 دقيقة - للمبتدئين والطلاب',
    channel: 'تعلم الإنجليزية ببساطة',
    views: '920 ألف مشاهدة',
    time: 'منذ 4 أشهر',
    duration: '21:30',
    category: 'تعليم',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
  },
];

export const YouTubeApp: React.FC = () => {
  const { soundEffects } = useLauncher();
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [likesCount, setLikesCount] = useState<number>(1420);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const categories = ['الكل', 'تعليم', 'علوم', 'تكنولوجيا', 'تاريخ', 'وثائقيات'];

  const filteredVideos = FEATURED_VIDEOS.filter((v) => {
    const matchesCategory = activeCategory === 'الكل' || v.category === activeCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectVideo = (video: VideoItem) => {
    playTapSound(soundEffects);
    setSelectedVideo(video);
  };

  const handleLike = () => {
    playTapSound(soundEffects);
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0f0f0f] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* YouTube Tablet Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#0f0f0f] border-b border-white/10 shrink-0">
        {/* Left: YouTube Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedVideo(null)}>
          <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
          <span className="font-bold text-lg tracking-tight">YouTube</span>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="flex items-center bg-[#222222] border border-[#303030] rounded-full overflow-hidden focus-within:border-blue-500">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في YouTube..."
              className="flex-1 bg-transparent px-4 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none text-right"
            />
            <button
              type="button"
              className="bg-[#303030] px-4 py-2 hover:bg-[#3f3f3f] text-white/70 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-8" />
      </div>

      {/* Main Video Player or Video Grid */}
      {selectedVideo ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto p-4 sm:p-6 gap-6">
          {/* Main Video Column */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Back button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white w-max px-3 py-1.5 rounded-full bg-white/10 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة الفيديوهات</span>
            </button>

            {/* Video Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Title & Info */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {selectedVideo.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                <span>{selectedVideo.views}</span>
                <span>•</span>
                <span>{selectedVideo.time}</span>
              </div>
            </div>

            {/* Channel Bar & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow">
                  {selectedVideo.channel[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-sm">
                    <span>{selectedVideo.channel}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                  </div>
                  <span className="text-[11px] text-white/50">قناة موثقة • 450 ألف مشترك</span>
                </div>
                <button
                  type="button"
                  className="mr-3 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors"
                >
                  اشتراك
                </button>
              </div>

              {/* Like / Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    hasLiked ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => playTapSound(soundEffects)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>

                <button
                  type="button"
                  onClick={() => playTapSound(soundEffects)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>حفظ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
            <h3 className="font-bold text-sm text-white/90">فيديوهات مقترحة للطلاب</h3>
            <div className="flex flex-col gap-3">
              {FEATURED_VIDEOS.filter((v) => v.id !== selectedVideo.id).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className="flex gap-2.5 cursor-pointer group hover:bg-white/5 p-1.5 rounded-xl transition-colors"
                >
                  <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start">
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 line-clamp-2 leading-tight">
                      {video.title}
                    </h4>
                    <span className="text-[11px] text-white/50 mt-1">{video.channel}</span>
                    <span className="text-[10px] text-white/40">{video.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Video Grid Mode */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categories Row */}
          <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto border-b border-white/5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 max-w-6xl mx-auto">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className="flex flex-col gap-2.5 cursor-pointer group"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow group-hover:scale-[1.02] transition-transform duration-200">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/80 font-mono px-1.5 py-0.5 rounded-md text-[11px] text-white font-medium">
                      {video.duration}
                    </span>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Channel avatar & Title */}
                  <div className="flex items-start gap-3 px-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 shrink-0 flex items-center justify-center text-white text-xs font-bold shadow">
                      {video.channel[0]}
                    </div>
                    <div className="flex flex-col text-right">
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      <span className="text-xs text-white/60 mt-1">{video.channel}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                        <span>{video.views}</span>
                        <span>•</span>
                        <span>{video.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
