import React, { useState } from 'react';
import { HEALING_ACTIVITIES, MOODS } from '../data/healingData';
import { HealingActivity, MoodType, MiniGameId } from '../types';
import { soundManager } from '../utils/sound';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Lightbulb, 
  Heart, 
  Activity,
  ArrowRight,
  Smile
} from 'lucide-react';

export const ActivitySuggestions: React.FC<{ onSelectGame?: (gameId: MiniGameId) => void }> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMood, setActiveMood] = useState<MoodType | 'all'>('all');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [activeActivity, setActiveActivity] = useState<HealingActivity | null>(null);

  const toggleComplete = (id: string) => {
    soundManager.playPop();
    setCompletedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = HEALING_ACTIVITIES.filter((act) => {
    if (selectedCategory !== 'all' && act.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 md:p-6 border border-stone-200/80 shadow-xs mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💡</span>
          <h3 className="text-xl font-bold font-display text-stone-800">
            Gợi Ý Hoạt Động Thư Giãn Nhanh
          </h3>
        </div>
        <p className="text-xs md:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Những hành động nhỏ chỉ mất từ 1 đến 5 phút, được thiết kế đặc biệt để giúp học sinh - sinh viên ngắt cơn căng thẳng, thư giãn đôi mắt và nạp lại năng lượng tích cực.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          {[
            { id: 'all', label: 'Tất cả gợi ý' },
            { id: 'body', label: 'Chăm sóc cơ thể 🍵' },
            { id: 'mind', label: 'Thư giãn tâm trí 🎧' },
            { id: 'space', label: 'Thay đổi không gian 🌿' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-stone-900 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((act) => {
          const isDone = completedActivities.includes(act.id);

          return (
            <div
              key={act.id}
              className={`bg-white/90 rounded-3xl p-5 border-2 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-stone-200/80 hover:border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl filter drop-shadow-xs">{act.icon}</span>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-stone-800">
                        {act.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {act.timeEstimate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleComplete(act.id)}
                    className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-400'
                    }`}
                    title={isDone ? 'Đánh dấu chưa làm' : 'Đánh dấu đã hoàn thành'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {act.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 italic">
                  🌿 Lợi ích: {act.benefit}
                </span>

                <button
                  onClick={() => toggleComplete(act.id)}
                  className={`font-semibold cursor-pointer whitespace-nowrap ml-2 ${
                    isDone ? 'text-emerald-700 font-bold' : 'text-amber-700 hover:underline'
                  }`}
                >
                  {isDone ? 'Đã thử xoa dịu ✨' : 'Thử ngay'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Footer */}
      <div className="mt-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-4 border border-rose-200/60 text-center">
        <span className="text-xs text-stone-700 font-medium">
          🌸 Bạn không cần phải làm việc liên tục để chứng minh giá trị của mình. Hãy nhớ nghỉ ngơi nhé!
        </span>
      </div>
    </div>
  );
};
