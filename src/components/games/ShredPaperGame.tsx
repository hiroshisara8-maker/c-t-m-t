import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';
import { Flame, Trash2, Scissors, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

const QUICK_STRESSORS = [
  'Điểm số không như kỳ vọng',
  'Áp lực đồng trang lứa đè nặng',
  'Bị so sánh với người khác',
  'Deadline dồn dập nghẹt thở',
  'Nỗi sợ thất bại trong tương lai',
  'Lời nhận xét làm tổn thương lòng tự trọng',
];

export const ShredPaperGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [text, setText] = useState<string>('');
  const [state, setState] = useState<'idle' | 'shredding' | 'crumpling' | 'burning' | 'destroyed'>('idle');
  const [destroyedCount, setDestroyedCount] = useState<number>(0);

  const handleAction = (action: 'shred' | 'crumple' | 'burn') => {
    if (!text.trim()) return;

    if (action === 'shred') {
      setState('shredding');
      soundManager.playPaperRip(true);
      setTimeout(() => soundManager.playPaperRip(false), 220);
      setTimeout(() => soundManager.playPaperRip(true), 450);
      setTimeout(() => soundManager.playPaperRip(false), 720);

      setTimeout(() => {
        setState('destroyed');
        setDestroyedCount((c) => c + 1);
        confetti({
          particleCount: 45,
          spread: 85,
          origin: { y: 0.65 },
          colors: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#fecdd3'],
        });
      }, 1250);
    } else if (action === 'crumple') {
      setState('crumpling');
      soundManager.playPaperCrumple();
      setTimeout(() => soundManager.playPaperCrumple(), 320);
      setTimeout(() => soundManager.playPaperCrumple(), 640);

      setTimeout(() => {
        setState('destroyed');
        setDestroyedCount((c) => c + 1);
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#e2e8f0', '#cbd5e1', '#94a3b8'],
        });
      }, 1150);
    } else if (action === 'burn') {
      setState('burning');
      soundManager.playFire();
      setTimeout(() => soundManager.playFire(), 650);

      setTimeout(() => {
        setState('destroyed');
        setDestroyedCount((c) => c + 1);
        confetti({
          particleCount: 50,
          spread: 90,
          origin: { y: 0.65 },
          colors: ['#f97316', '#ef4444', '#f59e0b', '#78716c'],
        });
      }, 1500);
    }
  };

  const handleReset = () => {
    setText('');
    setState('idle');
    soundManager.playClick();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-rose-100 shadow-sm max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Xé Giấy &amp; Tiêu Hủy Áp Lực
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Viết ra những điều bức bối, rồi tận hưởng cảm giác tự tay xé nát, vò nhăn hoặc đốt sạch.
          </p>
        </div>

        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
          Đã tiêu hủy: {destroyedCount} áp lực
        </div>
      </div>

      {state === 'destroyed' ? (
        <div className="min-h-[300px] bg-stone-50/80 rounded-2xl border border-dashed border-stone-200 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
          <span className="text-5xl mb-3 animate-bounce">🕊️</span>
          <h4 className="text-lg font-bold text-stone-800 mb-1">
            Gánh nặng này đã tan biến hoàn toàn!
          </h4>
          <p className="text-xs md:text-sm text-stone-600 max-w-md mb-6 leading-relaxed">
            Những mảnh giấy vụn hay đám tro tàn không còn quyền lực làm bạn tổn thương nữa. Hãy hít một hơi thật sâu và thở phào nhẹ nhõm nhé!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Viết điều khác để xé tiếp
            </button>
            {onComplete && (
              <button
                onClick={onComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã thấy hả dạ &amp; nhẹ lòng
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Quick presets */}
          {state === 'idle' && (
            <div className="mb-3">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                ⚡ Chọn nhanh nỗi niềm muốn tiêu hủy:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_STRESSORS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setText((prev) => (prev ? `${prev}, ${s}` : s));
                    }}
                    className="text-[11px] bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200 px-2.5 py-1 rounded-full text-stone-600 transition-colors cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Paper Canvas Stage */}
          <div className="relative min-h-[240px] flex items-center justify-center overflow-hidden rounded-2xl bg-stone-100/50 p-2">
            {/* Shredding Effect: splits into multiple vertical jagged ripped strips */}
            {state === 'shredding' ? (
              <div className="w-full h-56 flex gap-1 justify-center items-start animate-in fade-in overflow-hidden">
                {[
                  { delay: '0ms', rot: '-7deg', drop: 'translate-y-24 rotate-[-6deg]' },
                  { delay: '60ms', rot: '3deg', drop: 'translate-y-36 rotate-[4deg]' },
                  { delay: '120ms', rot: '-5deg', drop: 'translate-y-28 rotate-[-5deg]' },
                  { delay: '40ms', rot: '6deg', drop: 'translate-y-40 rotate-[7deg]' },
                  { delay: '90ms', rot: '-3deg', drop: 'translate-y-32 rotate-[-4deg]' },
                  { delay: '150ms', rot: '5deg', drop: 'translate-y-44 rotate-[8deg]' },
                ].map((strip, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-full bg-[#fdfbf7] border-x border-stone-300 shadow-md p-2 transition-all duration-1000 ease-in flex flex-col justify-between overflow-hidden opacity-80 ${strip.drop}`}
                    style={{
                      transitionDelay: strip.delay,
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e2e8f0 24px)',
                      clipPath: 'polygon(0 0, 100% 0, 95% 95%, 85% 100%, 70% 94%, 55% 100%, 40% 93%, 25% 100%, 10% 95%, 0 100%)',
                    }}
                  >
                    <div className="text-[10px] font-handwriting text-stone-700 break-words opacity-70">
                      {text.slice(idx * 8, idx * 8 + 14)}...
                    </div>
                    <div className="text-[8px] text-rose-500 font-bold tracking-tighter opacity-50">
                      RÁCH RỜI
                    </div>
                  </div>
                ))}
              </div>
            ) : state === 'crumpling' ? (
              /* Realistic Crumpling 3D paper ball animation */
              <div className="relative flex flex-col items-center justify-center h-56 animate-in zoom-in-75 duration-300">
                <div className="relative">
                  {/* Surrounding crunch stress particles */}
                  <div className="absolute -top-3 -left-3 text-sm animate-ping">💥</div>
                  <div className="absolute -bottom-2 -right-2 text-sm animate-ping delay-100">✨</div>
                  <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 shadow-2xl border-4 border-stone-400/80 flex items-center justify-center rotate-12 transition-transform scale-90"
                    style={{
                      clipPath: 'polygon(15% 0%, 85% 5%, 100% 25%, 90% 80%, 75% 100%, 20% 95%, 0% 75%, 5% 20%)',
                      backgroundImage: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #cbd5e1 45%, #64748b 100%)',
                    }}
                  >
                    <div className="text-center p-2 rotate-[-12deg]">
                      <span className="text-3xl block filter drop-shadow-sm animate-bounce">🗑️</span>
                      <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-md shadow-xs">
                        ĐÃ VÒ NÁT
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mt-3 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs animate-pulse">
                  <span>🔊</span>
                  <span>Rắc rắc... Áp lực đang bị bóp nghẹt và vứt bỏ!</span>
                </div>
              </div>
            ) : state === 'burning' ? (
              /* High-impact Fire Burning & Sparks Animation */
              <div className="relative w-full h-56 bg-stone-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-orange-500 shadow-2xl">
                {/* Fire Flames layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/70 via-orange-500/50 to-amber-300/30 animate-pulse" />
                <div className="absolute -bottom-6 inset-x-0 h-36 bg-gradient-to-t from-orange-600 via-red-500 to-transparent blur-md opacity-90 animate-bounce" />

                {/* Floating flying embers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute bottom-4 left-1/4 w-2 h-2 rounded-full bg-yellow-300 blur-xs animate-ping" />
                  <div className="absolute bottom-8 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-400 blur-xs animate-ping delay-150" />
                  <div className="absolute bottom-12 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 blur-xs animate-ping delay-300" />
                  <div className="absolute bottom-6 right-1/4 w-2 h-2 rounded-full bg-yellow-200 blur-xs animate-ping delay-200" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-5xl animate-bounce">🔥</span>
                    <span className="text-4xl animate-pulse">🪵</span>
                    <span className="text-5xl animate-bounce delay-100">🔥</span>
                  </div>
                  <p className="text-base font-black text-amber-200 mt-2 filter drop-shadow-md tracking-wide">
                    Áp lực đang bốc cháy thành tro tàn...
                  </p>
                  <div className="flex items-center gap-2 mt-2 bg-stone-900/90 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/60 shadow-md">
                    <span>🔥 Tách tách...</span>
                    <span>Lửa thiêu rụi muộn phiền</span>
                    <span>✨</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Default Notebook Paper to write */
              <div className="w-full relative notebook-lines-clean bg-[#fefcf8] rounded-2xl border-2 border-stone-300 shadow-md p-5 min-h-[210px] transition-all">
                {/* Binder holes */}
                <div className="absolute left-2.5 top-4 bottom-4 flex flex-col justify-between pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-stone-300 shadow-inner border border-stone-400/50" />
                  <div className="w-3.5 h-3.5 rounded-full bg-stone-300 shadow-inner border border-stone-400/50" />
                  <div className="w-3.5 h-3.5 rounded-full bg-stone-300 shadow-inner border border-stone-400/50" />
                </div>

                {/* Red margin line */}
                <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-rose-300/80 pointer-events-none" />

                <div className="pl-8">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Viết thẳng thắn những điều bạn bực bội, bất công, thất vọng hoặc căm ghét vào đây (đừng ngần ngại, tờ giấy này sẽ được tiêu hủy tức thì không dấu vết)..."
                    rows={5}
                    className="w-full bg-transparent border-none outline-hidden text-sm md:text-base text-stone-800 placeholder:text-stone-400 resize-none font-handwriting tracking-wide leading-8 select-text"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
            <span className="text-xs text-stone-500 font-medium">
              {text.length > 0 ? `${text.length} ký tự sẵn sàng tiêu hủy` : 'Hãy viết đôi dòng trước nhé'}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAction('shred')}
                disabled={!text.trim() || state !== 'idle'}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Scissors className="w-4 h-4" />
                <span>Xé vụn giấy sột soạt</span>
              </button>

              <button
                onClick={() => handleAction('crumple')}
                disabled={!text.trim() || state !== 'idle'}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Vò nát ném đi</span>
              </button>

              <button
                onClick={() => handleAction('burn')}
                disabled={!text.trim() || state !== 'idle'}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Flame className="w-4 h-4" />
                <span>Đốt thành tro</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
