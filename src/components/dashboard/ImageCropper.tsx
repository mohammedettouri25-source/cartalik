"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut, Check } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  t: {
    cropImage: string;
    positionScale: string;
    cancel: string;
    saveImage: string;
  };
}

export default function ImageCropper({ image, onCropComplete, onCancel, t }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col h-[80vh] md:h-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t.cropImage}</h3>
            <p className="text-sm text-slate-500 font-medium">{t.positionScale}</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-slate-50 min-h-[300px] md:h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6 bg-white">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <ZoomIn className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-all"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 rounded-2xl gradient-accent text-white text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              <Check className="w-4 h-4" />
              {t.saveImage}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
