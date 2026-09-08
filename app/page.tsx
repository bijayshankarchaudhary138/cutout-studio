'use client';

import React, { useState, useRef } from 'react';
import imglyRemoveBackground from '@imgly/background-removal';
import { 
  Upload, Download, Sparkles, ShieldCheck, Zap, RefreshCw, 
  SlidersHorizontal, CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setProcessedImage(null);
      setZoomLevel(1);
      processBackgroundRemoval(file);
    }
  };

  const processBackgroundRemoval = async (imageFile: File) => {
    setLoading(true);
    setProgressText('AI Engine Initialize Ho Raha Hai...');
    
    try {
      const blob = await imglyRemoveBackground(imageFile, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          if (percent < 50) {
            setProgressText(`Subject Scanning (${percent}%)...`);
          } else {
            setProgressText(`Ultra-HD Cutout Generating (${percent}%)...`);
          }
        }
      });
      
      const resultUrl = URL.createObjectURL(blob);
      setProcessedImage(resultUrl);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    } catch (error) {
      console.error(error);
      alert('Photo process nahi ho paayi. Kripya doosri photo try karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setBgColor('transparent');
    setSliderPos(50);
    setZoomLevel(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyImageToClipboard = async () => {
    if (!processedImage) return;
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between font-sans">
      <header className="border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-50 bg-[#090D16]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              CutOut<span className="text-cyan-400">.Studio</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400"/> 100% Private</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400"/> Unlimited 4K</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full flex flex-col items-center">
        <div className="text-center mb-8 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Instant AI Background Removal <br/>
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              100% Free & Unlimited 4K
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            No signup. No hidden charges. Fast on-device browser AI processing.
          </p>
        </div>

        {!originalImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-3xl p-10 text-center bg-slate-900/30 hover:bg-slate-900/60 transition-all cursor-pointer relative shadow-2xl"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-100">Photo yahan drop karein ya click karke upload karein</h3>
            <p className="text-xs text-slate-400">PNG, JPG, WEBP • Full Resolution Retained</p>
          </div>
        ) : (
          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-bold text-slate-300">Studio Live Preview</span>
              {processedImage && (
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                  <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="p-1 hover:bg-slate-800 rounded" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
                  <span className="px-1.5 font-mono text-slate-300">{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))} className="p-1 hover:bg-slate-800 rounded" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setZoomLevel(1)} className="p-1 hover:bg-slate-800 rounded border-l border-slate-800 pl-1"><RotateCcw className="w-3 h-3" /></button>
                </div>
              )}
            </div>

            <div 
              className="w-full h-[380px] sm:h-[480px] bg-[#0d121f] rounded-2xl overflow-hidden relative border border-slate-800 select-none flex items-center justify-center"
              style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
            >
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#090D16]/90 z-30">
                  <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p className="text-sm font-semibold text-slate-200 animate-pulse">{progressText}</p>
                </div>
              )}

              {!loading && processedImage && (
                <div 
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-150"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img src={processedImage} alt="Cutout Result" className="max-h-full max-w-full object-contain" />
                    <div 
                      className="absolute inset-0 overflow-hidden flex items-center justify-center" 
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <img src={originalImage} alt="Original Image" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>

                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />

                  <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                    <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg text-black font-bold">
                      <SlidersHorizontal className="w-4 h-4 text-slate-900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!loading && processedImage && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold mr-1">Background:</span>
                  <button onClick={() => setBgColor('transparent')} className={`px-3 py-1 rounded-lg border text-xs font-bold ${bgColor === 'transparent' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>PNG</button>
                  <button onClick={() => setBgColor('#ffffff')} className="w-6 h-6 rounded-full bg-white border border-slate-600 hover:scale-110 transition-transform" title="Passport White"></button>
                  <button onClick={() => setBgColor('#0f172a')} className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 hover:scale-110 transition-transform" title="Dark Gray"></button>
                  <button onClick={() => setBgColor('#2563eb')} className="w-6 h-6 rounded-full bg-blue-600 hover:scale-110 transition-transform" title="Passport Blue"></button>
                  <button onClick={() => setBgColor('#059669')} className="w-6 h-6 rounded-full bg-emerald-600 hover:scale-110 transition-transform" title="Studio Green"></button>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={copyImageToClipboard} className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleReset} className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white">New Image</button>
                  <a href={processedImage} download="cutout-4k.png" className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 font-bold rounded-xl flex items-center gap-2 text-xs text-white transition-all shadow-lg shadow-cyan-500/20">
                    <Download className="w-4 h-4" /> Download 4K
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Zap className="w-5 h-5 text-amber-400 mb-2" />
            <h3 className="font-bold text-sm mb-1">Fast Client-Side Processing</h3>
            <p className="text-xs text-slate-400">Browser GPU pipeline se instant photo cutout ready hoti hai.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="font-bold text-sm mb-1">Complete Privacy</h3>
            <p className="text-xs text-slate-400">Photos kabhi kisi external server par upload nahi hoti.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-2" />
            <h3 className="font-bold text-sm mb-1">Full HD / 4K Retained</h3>
            <p className="text-xs text-slate-400">Original resolution me zero quality loss ke sath download karein.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        CutOut Studio • Ultra-Fast AI Background Remover
      </footer>
    </div>
  );
}
