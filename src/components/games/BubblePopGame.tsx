import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';
import { Sparkles, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Bubble {
  id: string;
  label: string;
  color: string;
  border: string;
  size: number;
  x: number;
  y: number;
  popped: boolean;
}

const DEFAULT_STRESSORS = [
  'Deadline bài tập',
  'Điểm thi kém',
  'Áp lực đồng trang lứa',
  'Kỳ vọng gia đình',
  'Bất đồng với bạn bè',
  'Mệt mỏi rã rời',
  'Nỗi sợ thất bại',
  'Lời nhận xét tiêu cực',
  'Cảm giác cô đơn',
  'Sự trì hoãn',
  'Lo lắng tương lai',
  'Tức giận uất ức',
];

const PASTEL_PALETTES = [
  { color: 'bg-rose-100/90 hover:bg-rose-200', border: 'border-rose-300 text-rose-800' },
  { color: 'bg-sky-100/90 hover:bg-sky-200', border: 'border-sky-300 text-sky-800' },
  { color: 'bg-amber-100/90 hover:bg-amber-200', border: 'border-amber-300 text-amber-800' },
  { color: 'bg-emerald-100/90 hover:bg-emerald-200', border: 'border-emerald-300 text-emerald-800' },
  { color: 'bg-purple-100/90 hover:bg-purple-200', border: 'border-purple-300 text-purple-800' },
  { color: 'bg-teal-100/90 hover:bg-teal-200', border: 'border-teal-300 text-teal-800' },
];

export const BubblePopGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [customWord, setCustomWord] = useState<string>('');
  const [mode, setMode] = useState<'stress_words' | 'bubble_wrap'>('stress_words');
  const [wrapGrid, setWrapGrid] = useState<boolean[]>(Array(36).fill(false));

  const generateBubbles = () => {
    const list = [...DEFAULT_STRESSORS].sort(() => Math.random() - 0.5);
    const newBubbles: Bubble[] = list.slice(0, 10).map((label, idx) => {
      const pal = PASTEL_PALETTES[idx % PASTEL_PALETTES.length];
      return {
        id: `bubble-${idx}-${Date.now()}`,
        label,
        color: pal.color,
        border: pal.border,
        size: 90 + Math.floor(Math.random() * 30),
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 15,
        popped: false,
      };
    });
    setBubbles(newBubbles);
  };

  useEffect(() => {
    generateBubbles();
  }, []);

  const handlePop = (id: string, idx: number) => {
    soundManager.playPop(idx * 20);
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount((c) => {
      const next = c + 1;
      if (next % 10 === 0) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#fbcfe8', '#bfdbfe', '#fef08a', '#bbf7d0'],
        });
      }
      return next;
    });
  };

  const handleWrapPop = (index: number) => {
    soundManager.playPop((index % 6) * 35);
    setWrapGrid((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setPoppedCount((c) => c + 1);
  };

  const resetWrap = () => {
    setWrapGrid(Array(36).fill(false));
    soundManager.playClick();
  };

  const addCustomBubble = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWord.trim()) return;
    const pal = PASTEL_PALETTES[Math.floor(Math.random() * PASTEL_PALETTES.length)];
    const newB: Bubble = {
      id: `custom-${Date.now()}`,
      label: customWord.trim(),
      color: pal.color,
      border: pal.border,
      size: 100,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      popped: false,
    };
    setBubbles((prev) => [newB, ...prev]);
    setCustomWord('');
    soundManager.playClick();
  };

  const allPopped = bubbles.length > 0 && bubbles.every((b) => b.popped);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-rose-100 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🫧</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Nổ Bong Bóng Xả Bực
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Mỗi lần bấm nổ là một áp lực được đập tan và bay biến khỏi tâm trí bạn.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Đã nổ: {poppedCount} bóng</span>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
            <button
              onClick={() => setMode('stress_words')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === 'stress_words' ? 'bg-white text-stone-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Bóng áp lực
            </button>
            <button
              onClick={() => setMode('bubble_wrap')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === 'bubble_wrap' ? 'bg-white text-stone-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Màng xốp hơi
            </button>
          </div>
        </div>
      </div>

      {mode === 'stress_words' ? (
        <div>
          {/* Custom Input */}
          <form onSubmit={addCustomBubble} className="flex gap-2 mb-4">
            <input
              type="text"
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value)}
              placeholder="Nhập điều đang làm bạn tức/buồn để bắn nổ (vd: Điểm Hóa thấp)..."
              maxLength={35}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2 text-xs md:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
            />
            <button
              type="submit"
              className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bóng</span>
            </button>
          </form>

          {/* Bubble Arena */}
          <div className="relative min-h-[360px] bg-gradient-to-b from-sky-50/50 via-rose-50/40 to-amber-50/50 rounded-2xl border border-stone-200/60 p-4 flex flex-wrap items-center justify-center gap-3.5 overflow-hidden">
            {bubbles.map((b, idx) => {
              if (b.popped) {
                return (
                  <div
                    key={b.id}
                    className="w-16 h-16 rounded-full border border-dashed border-stone-200 flex items-center justify-center opacity-40 scale-75 transition-all"
                  >
                    <span className="text-[10px] text-stone-400">Đã nổ ✨</span>
                  </div>
                );
              }
              return (
                <button
                  key={b.id}
                  onClick={() => handlePop(b.id, idx)}
                  style={{
                    animationDelay: `${idx * 0.2}s`,
                  }}
                  className={`group relative ${b.color} ${b.border} border-2 rounded-full p-3 shadow-md hover:shadow-lg transition-transform transform active:scale-90 hover:scale-105 cursor-pointer flex flex-col items-center justify-center text-center animate-float select-none`}
                >
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80 pointer-events-none" />
                  <span className="text-xs md:text-sm font-bold leading-tight max-w-[110px] break-words">
                    {b.label}
                  </span>
                  <span className="text-[10px] opacity-70 mt-0.5 group-hover:opacity-100">
                    Bấm nổ! 💥
                  </span>
                </button>
              );
            })}

            {allPopped && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
                <span className="text-4xl mb-2">🎉</span>
                <h4 className="text-lg font-bold text-stone-800 mb-1">
                  Tuyệt vời! Bạn đã nổ tung mọi áp lực!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mb-4">
                  Cảm giác có nhẹ nhõm hơn đôi chút không? Bạn hoàn toàn làm chủ cảm xúc của mình.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={generateBubbles}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Bơm bóng mới
                  </button>
                  {onComplete && (
                    <button
                      onClick={onComplete}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã nhẹ lòng hơn
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 text-xs text-stone-500">
            <span>💡 Mẹo: Bật âm thanh để nghe tiếng nổ &apos;pop&apos; đã tai nhé!</span>
            <button
              onClick={generateBubbles}
              className="text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm mới bóng
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-stone-100/80 p-4 rounded-2xl border border-stone-200">
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 justify-items-center">
              {wrapGrid.map((popped, idx) => (
                <button
                  key={idx}
                  onClick={() => !popped && handleWrapPop(idx)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer select-none ${
                    popped
                      ? 'bg-stone-200 border border-stone-300 scale-90 opacity-40 shadow-inner'
                      : 'bg-gradient-to-br from-sky-200 to-sky-100 border-2 border-sky-300 shadow-md hover:scale-105 active:scale-90 hover:brightness-105'
                  }`}
                >
                  {!popped && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white/70 self-start ml-1 mt-1 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-200">
              <span className="text-xs text-stone-500">
                Bóp màng xốp khí liên tục để xả cơ bắp và định tâm lại.
              </span>
              <button
                onClick={resetWrap}
                className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                Làm phẳng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
