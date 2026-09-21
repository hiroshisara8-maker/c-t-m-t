import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import { 
  Palette, 
  Eraser, 
  Trash2, 
  Download, 
  Sparkles, 
  RotateCcw,
  Stamp
} from 'lucide-react';

const PASTEL_COLORS = [
  { name: 'Hồng phấn', hex: '#f472b6' },
  { name: 'Xanh mint', hex: '#4ade80' },
  { name: 'Xanh da trời', hex: '#60a5fa' },
  { name: 'Tím oải hương', hex: '#c084fc' },
  { name: 'Vàng bơ', hex: '#facc15' },
  { name: 'Cam đào', hex: '#fb923c' },
  { name: 'Nâu ấm', hex: '#854d0e' },
  { name: 'Xám đậm', hex: '#44403c' },
];

const STAMPS = ['⭐', '💖', '🌱', '☁️', '🌈', '☀️', '🐱', '🌸'];

export const DoodleCanvasGame: React.FC<{ onSaveToDiary?: (dataUrl: string) => void }> = ({
  onSaveToDiary,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>(PASTEL_COLORS[0].hex);
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    }
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (activeStamp) {
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, x, y);
      soundManager.playPop(100);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    soundManager.playPaperRip();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `xa-di-doodle-${Date.now()}.png`;
    a.click();
    soundManager.playComfortChime();
  };

  const saveToDiary = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSaveToDiary) return;
    const url = canvas.toDataURL('image/png');
    onSaveToDiary(url);
    setSavedSuccess(true);
    soundManager.playComfortChime();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-amber-100 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Vẽ Tự Do & Tô Màu Giải Tỏa
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Không cần vẽ đẹp, hãy để bàn tay bạn tự do nguệch ngoạc những gam màu xoa dịu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Xóa bảng vẽ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vẽ lại</span>
          </button>
          <button
            onClick={downloadImage}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Tải tranh về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải về</span>
          </button>
        </div>
      </div>

      {/* Tools Toolbar */}
      <div className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200/70 mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Color Palette */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Palette className="w-4 h-4 text-stone-400 mr-1 hidden sm:block" />
          {PASTEL_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                setIsEraser(false);
                setActiveStamp(null);
                soundManager.playClick();
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-6 h-6 rounded-full transition-transform cursor-pointer shadow-2xs ${
                !isEraser && !activeStamp && color === c.hex
                  ? 'ring-2 ring-offset-2 ring-stone-500 scale-110'
                  : 'hover:scale-105'
              }`}
              title={c.name}
            />
          ))}

          <div className="h-4 w-px bg-stone-300 mx-1" />

          {/* Eraser */}
          <button
            onClick={() => {
              setIsEraser(true);
              setActiveStamp(null);
              soundManager.playClick();
            }}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              isEraser
                ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
            title="Tẩy xóa"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tẩy</span>
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-500 font-medium">Nét vẽ:</span>
          {[2, 5, 10].map((sz) => (
            <button
              key={sz}
              onClick={() => setLineWidth(sz)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                lineWidth === sz
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: `${sz}px`, height: `${sz}px` }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Stickers / Stamps Bar */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-stone-400 font-semibold flex items-center gap-1 whitespace-nowrap">
          <Stamp className="w-3 h-3" /> Con dấu cảm xúc:
        </span>
        {STAMPS.map((st) => (
          <button
            key={st}
            onClick={() => {
              if (activeStamp === st) {
                setActiveStamp(null);
              } else {
                setActiveStamp(st);
                setIsEraser(false);
              }
              soundManager.playClick();
            }}
            className={`px-2 py-1 rounded-xl text-sm transition-all cursor-pointer select-none ${
              activeStamp === st
                ? 'bg-amber-100 border border-amber-300 scale-110 shadow-xs'
                : 'bg-stone-100/70 hover:bg-stone-200/70'
            }`}
          >
            {st}
          </button>
        ))}
        {activeStamp && (
          <span className="text-[10px] text-amber-700 font-medium ml-1">
            (Bấm lên tranh để dán {activeStamp})
          </span>
        )}
      </div>

      {/* Canvas Box */}
      <div className="relative w-full h-[320px] bg-white rounded-2xl border-2 border-stone-200/80 shadow-inner overflow-hidden cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />

        {/* Notebook corner flair */}
        <div className="absolute top-2 right-2 pointer-events-none opacity-40 text-xs text-stone-400 select-none">
          ✨ Góc sáng tạo tự do
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <span className="text-xs text-stone-400">
          Mỗi nét vẽ là một cách gửi gắm cảm xúc mà không cần dùng đến lời nói.
        </span>
        {onSaveToDiary && (
          <button
            onClick={saveToDiary}
            className="bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            <span>{savedSuccess ? 'Đã ghim vào sổ!' : 'Ghim tranh vào tâm sự'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
