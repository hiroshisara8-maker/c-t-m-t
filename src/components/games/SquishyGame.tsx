import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';
import { Sparkles, RotateCcw, CheckCircle2, Heart, Award } from 'lucide-react';

interface SquishyModel {
  id: string;
  name: string;
  emoji: string;
  baseColor: string;
  accentColor: string;
  shadowColor: string;
  features: string;
  soundPitch: number;
}

const SQUISHY_MODELS: SquishyModel[] = [
  {
    id: 'cat',
    name: 'Mèo Mochi Sữa',
    emoji: '🐱',
    baseColor: 'from-rose-100 via-pink-100 to-rose-200',
    accentColor: '#f472b6',
    shadowColor: 'rgba(244, 114, 182, 0.25)',
    features: 'Má hồng phấn & tai vểnh cute',
    soundPitch: 1.2,
  },
  {
    id: 'peach',
    name: 'Đào Tiên Núng Nính',
    emoji: '🍑',
    baseColor: 'from-orange-100 via-rose-200 to-pink-300',
    accentColor: '#fb7185',
    shadowColor: 'rgba(251, 113, 133, 0.3)',
    features: 'Căng mọng ngọt ngào mát lạnh',
    soundPitch: 1.0,
  },
  {
    id: 'bun',
    name: 'Bánh Bao Xốp Mềm',
    emoji: '🥟',
    baseColor: 'from-amber-50 via-stone-100 to-amber-100',
    accentColor: '#f59e0b',
    shadowColor: 'rgba(245, 158, 11, 0.25)',
    features: 'Tròn vo ấm áp thơm mùi sữa',
    soundPitch: 0.9,
  },
  {
    id: 'bear',
    name: 'Gấu Bơ Caramel',
    emoji: '🐻',
    baseColor: 'from-amber-200 via-yellow-100 to-amber-300',
    accentColor: '#d97706',
    shadowColor: 'rgba(217, 119, 6, 0.25)',
    features: 'Tai tròn êm ái xua tan mệt mỏi',
    soundPitch: 0.85,
  },
  {
    id: 'cloud',
    name: 'Mây Bông Bình Yên',
    emoji: '☁️',
    baseColor: 'from-sky-100 via-indigo-50 to-sky-200',
    accentColor: '#38bdf8',
    shadowColor: 'rgba(56, 189, 248, 0.25)',
    features: 'Xốp nhẹ như kẹo bông gòn',
    soundPitch: 1.3,
  },
];

interface SquishParticle {
  id: number;
  x: number;
  y: number;
  symbol: string;
}

export const SquishyGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeModel, setActiveModel] = useState<SquishyModel>(SQUISHY_MODELS[0]);
  const [squishCount, setSquishCount] = useState<number>(0);
  const [isSquished, setIsSquished] = useState<boolean>(false);
  const [deformation, setDeformation] = useState<{ scaleX: number; scaleY: number; rotate: number }>({
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  });
  const [particles, setParticles] = useState<SquishParticle[]>([]);
  const nextParticleId = useRef(0);

  // Pressure & stress calculation (starts at 100%, drops by 3% each squish)
  const remainingStress = Math.max(0, 100 - squishCount * 3);

  const triggerSquish = (e?: React.MouseEvent | React.TouchEvent) => {
    soundManager.playSquish(activeModel.soundPitch + (Math.random() * 0.2 - 0.1));
    setIsSquished(true);

    // Randomize squish deformation for realistic organic feel
    const squishX = 1.35 + Math.random() * 0.15;
    const squishY = 0.65 - Math.random() * 0.1;
    const squishRot = (Math.random() - 0.5) * 8;

    setDeformation({
      scaleX: squishX,
      scaleY: squishY,
      rotate: squishRot,
    });

    setSquishCount((prev) => {
      const next = prev + 1;
      if (next === 25 || next === 50) {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fda4af', '#f9a8d4', '#fde047', '#6ee7b7'],
        });
      }
      return next;
    });

    // Spawn floating cute particles
    const symbols = ['✨', '💖', '💨', '⭐', '🌸', '🫧'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const pId = nextParticleId.current++;

    let clickX = 50;
    let clickY = 50;
    if (e && 'clientX' in e) {
      const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect();
      if (rect) {
        clickX = ((e.clientX - rect.left) / rect.width) * 100;
        clickY = ((e.clientY - rect.top) / rect.height) * 100;
      }
    }

    setParticles((prev) => [...prev.slice(-8), { id: pId, x: clickX, y: clickY, symbol: randomSymbol }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pId));
    }, 800);
  };

  const releaseSquish = () => {
    setIsSquished(false);
    // Overshoot bouncy spring back
    setDeformation({
      scaleX: 0.94,
      scaleY: 1.08,
      rotate: 0,
    });

    setTimeout(() => {
      setDeformation({
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
      });
    }, 140);
  };

  const handleReset = () => {
    soundManager.playClick();
    setSquishCount(0);
    setDeformation({ scaleX: 1, scaleY: 1, rotate: 0 });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-rose-100 shadow-sm max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍡</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Bóp Squishy Mochi Đàn Hồi
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Nhấn, giữ hoặc nhấp liên tục để nắn bóp bé squishy mềm dẻo, xua tan áp lực tức thì!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
            Đã bóp: {squishCount} lần
          </div>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="mb-4">
        <label className="text-xs font-bold text-stone-600 block mb-2">
          Chọn mẫu Squishy yêu thích của bạn:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {SQUISHY_MODELS.map((model) => {
            const isSelected = activeModel.id === model.id;
            return (
              <button
                key={model.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveModel(model);
                }}
                className={`py-2 px-1 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-xs scale-102'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span className="text-2xl">{model.emoji}</span>
                <span className="text-[10px] font-bold text-stone-700 truncate max-w-full">
                  {model.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stress Bar Indicator */}
      <div className="mb-4 bg-stone-50 border border-stone-200/80 rounded-2xl p-3">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="text-stone-600 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Mức độ căng thẳng còn lại:
          </span>
          <span className={remainingStress <= 20 ? 'text-emerald-600' : 'text-rose-600'}>
            {remainingStress}% {remainingStress === 0 ? '✨ Đã xả sạch sành sanh!' : ''}
          </span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              remainingStress <= 20
                ? 'bg-emerald-500'
                : remainingStress <= 50
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${remainingStress}%` }}
          />
        </div>
      </div>

      {/* Main Squishy Interactive Stage */}
      <div
        onMouseDown={triggerSquish}
        onMouseUp={releaseSquish}
        onTouchStart={triggerSquish}
        onTouchEnd={releaseSquish}
        className="relative h-64 md:h-72 bg-gradient-to-b from-stone-50/50 via-rose-50/30 to-amber-50/40 rounded-3xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center cursor-pointer active:cursor-grabbing overflow-hidden shadow-inner touch-none"
      >
        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none text-2xl animate-bounce"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              animationDuration: '0.6s',
            }}
          >
            {p.symbol}
          </div>
        ))}

        {/* Squishy Pillow Floor Shadow */}
        <div
          className="absolute bottom-10 w-44 h-8 rounded-full blur-xs transition-all duration-150"
          style={{
            backgroundColor: activeModel.shadowColor,
            transform: `scaleX(${deformation.scaleX * 1.1}) scaleY(${1.2 - deformation.scaleY * 0.4})`,
          }}
        />

        {/* The Squishy Body */}
        <div
          className={`relative w-40 h-40 md:w-44 md:h-44 rounded-[45%] bg-gradient-to-br ${activeModel.baseColor} border-4 border-white shadow-xl flex flex-col items-center justify-center transition-transform duration-75`}
          style={{
            transform: `scale(${deformation.scaleX}, ${deformation.scaleY}) rotate(${deformation.rotate}deg)`,
            boxShadow: `0 18px 35px -5px ${activeModel.shadowColor}, inset 0 -6px 12px rgba(0,0,0,0.06), inset 0 8px 12px rgba(255,255,255,0.8)`,
          }}
        >
          {/* Light Glare Specular Highlight */}
          <div className="absolute top-4 left-6 w-8 h-4 rounded-full bg-white/70 rotate-[-25deg] blur-2xs" />
          <div className="absolute top-9 left-4 w-3 h-2 rounded-full bg-white/60 rotate-[-25deg] blur-2xs" />

          {/* Squishy Face Expression */}
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {/* Eyes */}
            <div className="flex items-center gap-6 mb-2">
              {isSquished ? (
                <>
                  <span className="text-xl font-black text-stone-700 select-none">&gt;</span>
                  <span className="text-xl font-black text-stone-700 select-none">&lt;</span>
                </>
              ) : (
                <>
                  <div className="w-3.5 h-3.5 bg-stone-800 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full -translate-x-0.5 -translate-y-0.5" />
                  </div>
                  <div className="w-3.5 h-3.5 bg-stone-800 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full -translate-x-0.5 -translate-y-0.5" />
                  </div>
                </>
              )}
            </div>

            {/* Blush cheeks */}
            <div className="flex items-center gap-10 -mt-1 mb-1">
              <div
                className="w-4 h-2 rounded-full opacity-60 blur-2xs"
                style={{ backgroundColor: activeModel.accentColor }}
              />
              <div
                className="w-4 h-2 rounded-full opacity-60 blur-2xs"
                style={{ backgroundColor: activeModel.accentColor }}
              />
            </div>

            {/* Mouth */}
            <div className="text-sm font-bold text-stone-700">
              {isSquished ? '3' : 'ω'}
            </div>
          </div>

          {/* Model Distinctive Icon Badge */}
          <div className="absolute bottom-2 right-4 text-sm opacity-80">
            {activeModel.emoji}
          </div>
        </div>

        {/* Instruction Badge */}
        <div className="absolute top-3 text-[11px] font-semibold text-stone-500 bg-white/80 px-3 py-1 rounded-full border border-stone-200/60 shadow-2xs backdrop-blur-xs pointer-events-none">
          {isSquished ? '✨ Đang nắn bóp siêu đã!' : '👇 Chạm / Nhấn giữ chuột để bóp squishy'}
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
        <button
          onClick={handleReset}
          className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Bóp lại từ đầu</span>
        </button>

        <div className="flex items-center gap-2">
          {squishCount >= 10 && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nắn bóp rất đã tay!</span>
            </div>
          )}

          {onComplete && (
            <button
              onClick={onComplete}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã thoải mái hơn</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
