import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import { Wind, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export const MindfulBreathingGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // 4-7-8 timing
  const PHASE_DURATIONS: Record<BreathingPhase, number> = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  const PHASE_TEXT: Record<BreathingPhase, { label: string; instruction: string; color: string }> = {
    inhale: {
      label: 'Hít vào nhẹ nhàng',
      instruction: 'Hít căng lồng ngực bằng mũi, cảm nhận không khí trong lành...',
      color: 'from-sky-200 via-teal-100 to-emerald-200 border-teal-300 text-teal-900',
    },
    hold: {
      label: 'Giữ hơi thở an yên',
      instruction: 'Giữ lại sự tĩnh lặng, cảm nhận tim bạn đang đập chậm lại...',
      color: 'from-amber-100 via-rose-100 to-purple-100 border-purple-300 text-purple-900',
    },
    exhale: {
      label: 'Thở ra từ từ',
      instruction: 'Thở nhẹ qua môi, tống hết mọi căng thẳng và mệt mỏi ra ngoài...',
      color: 'from-rose-100 via-pink-100 to-amber-100 border-rose-300 text-rose-900',
    },
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (phase === 'inhale') {
              setPhase('hold');
              soundManager.playClick();
              return PHASE_DURATIONS.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              soundManager.playClick();
              return PHASE_DURATIONS.exhale;
            } else {
              setPhase('inhale');
              soundManager.playComfortChime();
              setCyclesCompleted((c) => c + 1);
              return PHASE_DURATIONS.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleActive = () => {
    if (!isActive) {
      soundManager.playClick();
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(PHASE_DURATIONS.inhale);
    soundManager.playClick();
  };

  // Calculate circle scale percentage for breathing animation
  const getCircleScale = () => {
    if (phase === 'inhale') {
      const progress = 1 - secondsLeft / PHASE_DURATIONS.inhale;
      return 1 + progress * 0.45; // expands
    } else if (phase === 'hold') {
      return 1.45; // remains expanded
    } else {
      const progress = secondsLeft / PHASE_DURATIONS.exhale;
      return 1 + progress * 0.45; // slowly shrinks back
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-teal-100 shadow-sm max-w-2xl mx-auto text-center">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-100 text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌬️</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Hít Thở Êm Dịu 4-7-8
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Phương pháp y khoa giúp hạ nhịp tim, xoa dịu hoảng loạn và giảm căng thẳng tức thì.
          </p>
        </div>

        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
          <Wind className="w-3.5 h-3.5 text-teal-500" />
          <span>Chu kỳ: {cyclesCompleted} vòng</span>
        </div>
      </div>

      {/* Breathing Bubble Display */}
      <div className="relative min-h-[320px] bg-gradient-to-b from-teal-50/40 via-sky-50/30 to-purple-50/40 rounded-2xl border border-teal-100/60 p-8 flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Expanding Breathing Circle */}
        <div
          className={`relative w-44 h-44 rounded-full bg-gradient-to-tr ${PHASE_TEXT[phase].color} border-4 shadow-xl flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out`}
          style={{
            transform: `scale(${getCircleScale()})`,
          }}
        >
          {/* Inner pulsating glow */}
          <div className="absolute inset-2 rounded-full bg-white/40 blur-xs" />

          <span className="relative text-3xl font-extrabold font-display tracking-tight text-stone-800">
            {secondsLeft}s
          </span>
          <span className="relative text-xs font-bold uppercase tracking-wider text-stone-700 mt-1">
            {PHASE_TEXT[phase].label}
          </span>
        </div>

        {/* Phase Guidance Instruction */}
        <p className="mt-8 text-sm md:text-base font-handwriting font-bold text-stone-700 max-w-sm px-4">
          &ldquo;{PHASE_TEXT[phase].instruction}&rdquo;
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          onClick={toggleActive}
          className={`px-6 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu hít thở</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Bắt đầu lại
        </button>

        {cyclesCompleted >= 2 && onComplete && (
          <button
            onClick={onComplete}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Đã thấy nhẹ nhõm
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-stone-400">
        💡 Hãy nhắm hờ mắt lại, thả lỏng trán và hai vai khi thực hiện bài tập này nhé.
      </div>
    </div>
  );
};
