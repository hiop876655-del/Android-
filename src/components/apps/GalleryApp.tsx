/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Trash2,
  ArrowRight,
  Share2,
  Heart,
  Image as ImageIcon,
  Upload,
  Plus,
  FolderPlus,
  RotateCcw,
  Sparkles,
  Check,
  Folder,
  Move,
  X,
  Smartphone,
  MoreVertical,
} from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

export interface PhotoItem {
  id: string;
  url: string;
  album: string; // e.g. "الكاميرا", "الدروس والمذاكرة", "الرحلات"
  isTrash?: boolean;
  createdAt: number;
}

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    album: 'الكاميرا',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    album: 'الدروس والمذاكرة',
    createdAt: Date.now() - 200000,
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    album: 'الكاميرا',
    createdAt: Date.now() - 300000,
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    album: 'الرحلات',
    createdAt: Date.now() - 400000,
  },
];

export const GalleryApp: React.FC = () => {
  const { soundEffects, setCustomHomeWallpaper, setCustomLockWallpaper } = useLauncher();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Albums state
  const [albums, setAlbums] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('samsung_gallery_albums') || '[]');
      return saved.length > 0 ? saved : ['الكاميرا', 'الدروس والمذاكرة', 'الرحلات'];
    } catch {
      return ['الكاميرا', 'الدروس والمذاكرة', 'الرحلات'];
    }
  });

  // Photos state
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('samsung_gallery_photos_v2') || '[]');
      return saved.length > 0 ? saved : DEFAULT_PHOTOS;
    } catch {
      return DEFAULT_PHOTOS;
    }
  });

  const [activeTab, setActiveTab] = useState<'photos' | 'albums' | 'trash'>('photos');
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [wallpaperNotice, setWallpaperNotice] = useState<string | null>(null);

  // Modals & Popups
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const savePhotosToStorage = (updated: PhotoItem[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem('samsung_gallery_photos_v2', JSON.stringify(updated));
    } catch {}
  };

  const saveAlbumsToStorage = (updated: string[]) => {
    setAlbums(updated);
    try {
      localStorage.setItem('samsung_gallery_albums', JSON.stringify(updated));
    } catch {}
  };

  // Upload photo from device/phone
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playTapSound(soundEffects);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newPhoto: PhotoItem = {
        id: `photo-${Date.now()}`,
        url: dataUrl,
        album: activeAlbum || 'الكاميرا',
        createdAt: Date.now(),
      };

      const updated = [newPhoto, ...photos];
      savePhotosToStorage(updated);
      setSelectedPhoto(newPhoto);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  // Move photo to trash bin
  const handleMoveToTrash = (photoId: string) => {
    playTapSound(soundEffects);
    const updated = photos.map((p) => (p.id === photoId ? { ...p, isTrash: true } : p));
    savePhotosToStorage(updated);
    setSelectedPhoto(null);
    setShowMoreMenu(false);
  };

  // Restore photo from trash bin
  const handleRestoreFromTrash = (photoId: string) => {
    playTapSound(soundEffects);
    const updated = photos.map((p) => (p.id === photoId ? { ...p, isTrash: false } : p));
    savePhotosToStorage(updated);
    setSelectedPhoto(null);
    setShowMoreMenu(false);
  };

  // Permanent delete
  const handlePermanentDelete = (photoId: string) => {
    playTapSound(soundEffects);
    const updated = photos.filter((p) => p.id !== photoId);
    savePhotosToStorage(updated);
    setSelectedPhoto(null);
    setShowMoreMenu(false);
  };

  // Create new album
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    playTapSound(soundEffects);
    const name = newAlbumName.trim();
    if (!albums.includes(name)) {
      saveAlbumsToStorage([...albums, name]);
    }
    setShowNewAlbumModal(false);
    setNewAlbumName('');
  };

  // Move photo to album
  const handleMoveToAlbum = (targetAlbum: string) => {
    if (!selectedPhoto) return;
    playTapSound(soundEffects);
    const updated = photos.map((p) => (p.id === selectedPhoto.id ? { ...p, album: targetAlbum } : p));
    savePhotosToStorage(updated);
    setSelectedPhoto({ ...selectedPhoto, album: targetAlbum });
    setShowMoveModal(false);
    setShowMoreMenu(false);
  };

  // Set photo as Home or Lock Wallpaper
  const handleSetWallpaper = (target: 'home' | 'lock') => {
    if (!selectedPhoto) return;
    playTapSound(soundEffects);
    if (target === 'home') {
      setCustomHomeWallpaper(selectedPhoto.url);
      setWallpaperNotice('تم تعيين الصورة كخلفية للشاشة الرئيسية بنجاح 🖼️');
    } else {
      setCustomLockWallpaper(selectedPhoto.url);
      setWallpaperNotice('تم تعيين الصورة كخلفية لشاشة القفل بنجاح 🔒');
    }
    setShowMoreMenu(false);
    setTimeout(() => setWallpaperNotice(null), 3000);
  };

  // Active list filters
  const activePhotos = photos.filter((p) => {
    if (activeTab === 'trash') return p.isTrash === true;
    if (p.isTrash) return false;
    if (activeAlbum) return p.album === activeAlbum;
    return true;
  });

  const trashPhotosCount = photos.filter((p) => p.isTrash).length;

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col select-none overflow-hidden" dir="rtl">
      {/* Hidden File Input for Device Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">الاستوديو</h1>
          {/* Tabs */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setActiveTab('photos');
                setActiveAlbum(null);
              }}
              className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'photos' && !activeAlbum
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              جميع الصور ({photos.filter((p) => !p.isTrash).length})
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setActiveTab('albums');
              }}
              className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'albums' ? 'bg-rose-500 text-white shadow' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              الألبومات ({albums.length})
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound(soundEffects);
                setActiveTab('trash');
                setActiveAlbum(null);
              }}
              className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'trash' ? 'bg-red-600 text-white shadow' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>سلة المحذوفات ({trashPhotosCount})</span>
            </button>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>رفع صورة من الهاتف</span>
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Active Album Breadcrumb */}
        {activeAlbum && activeTab === 'photos' && (
          <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Folder className="w-4 h-4 text-rose-400" />
              <span>ألبوم: {activeAlbum}</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveAlbum(null)}
              className="text-xs text-white/60 hover:text-white cursor-pointer"
            >
              عرض جميع الصور ✕
            </button>
          </div>
        )}

        {/* View 1: Albums Tab */}
        {activeTab === 'albums' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 font-semibold">ألبومات الصور المخصصة:</span>
              <button
                type="button"
                onClick={() => setShowNewAlbumModal(true)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء ألبوم جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {albums.map((albumName) => {
                const count = photos.filter((p) => p.album === albumName && !p.isTrash).length;
                const coverPhoto = photos.find((p) => p.album === albumName && !p.isTrash);

                return (
                  <div
                    key={albumName}
                    onClick={() => {
                      playTapSound(soundEffects);
                      setActiveAlbum(albumName);
                      setActiveTab('photos');
                    }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 cursor-pointer hover:border-rose-500/50 transition-all active:scale-95 shadow"
                  >
                    <div className="w-full h-32 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                      {coverPhoto ? (
                        <img src={coverPhoto.url} alt={albumName} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-white/30" />
                      )}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-sm text-white truncate">{albumName}</span>
                      <span className="text-xs text-white/50">{count} عنصر</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activePhotos.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto gap-3 text-white/50">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-white">
              {activeTab === 'trash' ? 'سلة المحذوفات فارغة حالياً' : 'لا توجد صور متوفرة'}
            </p>
            <span className="text-xs text-white/50 leading-relaxed">
              {activeTab === 'trash'
                ? 'عند حذف أي صورة، تُنقل إلى هنا مؤقتاً قبل الحذف النهائي'
                : 'اضغط على زر "رفع صورة من الهاتف" بالأعلى لإضافة صورك الخاصة'}
            </span>

            {activeTab !== 'trash' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer shadow"
              >
                <Upload className="w-4 h-4" />
                <span>رفع أول صورة الآن</span>
              </button>
            )}
          </div>
        ) : (
          /* Photos Grid */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {activePhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => {
                  playTapSound(soundEffects);
                  setSelectedPhoto(photo);
                  setShowMoreMenu(false);
                }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer group active:scale-95 transition-all shadow hover:border-rose-400/50"
              >
                <img
                  src={photo.url}
                  alt="Gallery Item"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white/80">
                  {photo.album}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          onClick={() => {
            setSelectedPhoto(null);
            setShowMoreMenu(false);
          }}
          className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Wallpaper Notification Banner */}
          {wallpaperNotice && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl animate-bounce">
              {wallpaperNotice}
            </div>
          )}

          {/* Clean Top Bar with 3-Dots Menu Button */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setSelectedPhoto(null);
                setShowMoreMenu(false);
              }}
              className="p-2 rounded-full hover:bg-white/10 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowRight className="w-5 h-5" />
              <span>رجوع للاستوديو</span>
            </button>

            <div className="relative flex items-center gap-3">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/80">
                ألبوم: {selectedPhoto.album}
              </span>

              {/* 3-Dots Menu Button (⋮) */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(soundEffects);
                  setShowMoreMenu(!showMoreMenu);
                }}
                className="p-2 rounded-full hover:bg-white/20 bg-white/10 transition-colors cursor-pointer text-white"
                title="خيارات الصورة"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* 3-Dots Dropdown Popup Menu */}
              {showMoreMenu && (
                <div
                  className="absolute left-0 top-12 z-50 bg-slate-900/95 border border-white/20 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[210px] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!selectedPhoto.isTrash ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSetWallpaper('home')}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/20 rounded-xl transition-colors cursor-pointer w-full text-right"
                      >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>تعيين كخلفية للشاشة الرئيسية</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetWallpaper('lock')}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/20 rounded-xl transition-colors cursor-pointer w-full text-right"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>تعيين كخلفية لشاشة القفل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowMoveModal(true);
                        }}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 rounded-xl transition-colors cursor-pointer w-full text-right border-t border-white/10 pt-2"
                      >
                        <Move className="w-4 h-4 text-white/60" />
                        <span>نقل إلى ألبوم آخر</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveToTrash(selectedPhoto.id)}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer w-full text-right border-t border-white/10 pt-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                        <span>نقل لسلة المحذوفات</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRestoreFromTrash(selectedPhoto.id)}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600/20 rounded-xl transition-colors cursor-pointer w-full text-right"
                      >
                        <RotateCcw className="w-4 h-4 text-emerald-400" />
                        <span>استعادة الصورة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePermanentDelete(selectedPhoto.id)}
                        className="flex items-center justify-start gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer w-full text-right border-t border-white/10 pt-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                        <span>حذف نهائي</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Clean Photo Display without floating bottom buttons */}
          <div className="flex-1 flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt="Viewing"
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Create New Album Modal */}
      {showNewAlbumModal && (
        <div
          onClick={() => setShowNewAlbumModal(false)}
          className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-rose-400" />
              <span>إنشاء ألبوم جديد</span>
            </h3>

            <form onSubmit={handleCreateAlbum} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">اسم الألبوم:</label>
                <input
                  type="text"
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="مثلاً: صور المذاكرة والرحلات..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAlbumModal(false)}
                  className="px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow cursor-pointer"
                >
                  إنشاء الألبوم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Photo to Album Modal */}
      {showMoveModal && selectedPhoto && (
        <div
          onClick={() => setShowMoveModal(false)}
          className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white animate-in zoom-in-95 duration-200"
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <Move className="w-5 h-5 text-blue-400" />
              <span>اختر الألبوم المراد النقل إليه:</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {albums.map((albumName) => (
                <button
                  key={albumName}
                  type="button"
                  onClick={() => handleMoveToAlbum(albumName)}
                  className={`w-full p-3 rounded-xl border text-right text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    selectedPhoto.album === albumName
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <span>{albumName}</span>
                  {selectedPhoto.album === albumName && <Check className="w-4 h-4 text-rose-400" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 text-xs text-white/60 hover:text-white cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
