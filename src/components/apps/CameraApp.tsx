/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Zap, ZapOff, Image as ImageIcon } from 'lucide-react';
import { playShutterSound } from '../../utils/sound';
import { useLauncher } from '../../context/LauncherContext';

export const CameraApp: React.FC = () => {
  const { soundEffects, openApp } = useLauncher();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(() => {
    try {
      const photos = JSON.parse(localStorage.getItem('samsung_gallery_photos') || '[]');
      return photos[0] || null;
    } catch {
      return null;
    }
  });

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
      setHasPermission(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  const takePhoto = () => {
    playShutterSound(soundEffects);
    setFlashScreen(true);
    setTimeout(() => setFlashScreen(false), 150);

    // Capture frame to canvas
    if (videoRef.current && hasPermission) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setLastPhoto(dataUrl);

        try {
          const prev = JSON.parse(localStorage.getItem('samsung_gallery_photos') || '[]');
          localStorage.setItem('samsung_gallery_photos', JSON.stringify([dataUrl, ...prev]));
        } catch {}
      }
    } else {
      // Fallback synthetic photo
      const mockPhoto =
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80';
      setLastPhoto(mockPhoto);
    }
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Shutter White Flash effect */}
      {flashScreen && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}

      {/* Top Camera Controls */}
      <div className="z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/70 to-transparent">
        <button
          type="button"
          onClick={() => setFlashActive(!flashActive)}
          className="p-2 text-white/80 hover:text-white"
        >
          {flashActive ? <Zap className="w-5 h-5 text-amber-400" /> : <ZapOff className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-white/90">
          <span className="bg-white/20 px-2 py-0.5 rounded-full">3:4</span>
          <span>صورة</span>
          <span className="text-white/40">فيديو</span>
          <span className="text-white/40">بورتريه</span>
        </div>

        <div className="w-5" />
      </div>

      {/* Camera Viewfinder */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-900">
        {hasPermission === false ? (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <Camera className="w-12 h-12 text-white/40" />
            <p className="text-sm font-medium text-white/80">الكاميرا غير متصلة أو تم رفض الإذن</p>
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-full cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}

        {/* Viewfinder focus box */}
        <div className="absolute w-28 h-28 border border-white/40 rounded-lg pointer-events-none opacity-60 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* Bottom Camera Controls (Samsung Circular Shutter) */}
      <div className="z-20 flex items-center justify-around px-8 py-6 bg-gradient-to-t from-black/90 to-transparent">
        {/* Gallery Preview Thumbnail */}
        <button
          type="button"
          onClick={() => openApp('gallery')}
          className="w-13 h-13 rounded-2xl bg-neutral-800 border-2 border-white/40 overflow-hidden flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow"
        >
          {lastPhoto ? (
            <img src={lastPhoto} alt="Gallery" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-white/50" />
          )}
        </button>

        {/* Big Samsung Shutter Button */}
        <button
          type="button"
          onClick={takePhoto}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition-transform cursor-pointer shadow-2xl"
        >
          <div className="w-full h-full rounded-full bg-white active:bg-white/80 transition-colors" />
        </button>

        {/* Flip Camera Button */}
        <button
          type="button"
          onClick={switchCamera}
          className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:rotate-180 transition-all cursor-pointer shadow"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
