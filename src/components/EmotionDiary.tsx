import React, { useState } from 'react';
import { DiaryEntry, MoodType } from '../types';
import { MOODS, CATEGORIES, MINI_GAMES } from '../data/healingData';
import { soundManager } from '../utils/sound';
import { 
  BookOpen, 
  Trash2, 
  Search, 
  Calendar, 
  Heart, 
  Gamepad2, 
  Smile, 
  Sparkles,
  ArrowUpDown,
  FileText
} from 'lucide-react';

interface EmotionDiaryProps {
  entries: DiaryEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onOpenVent: () => void;
}

export const EmotionDiary: React.FC<EmotionDiaryProps> = ({
  entries,
  onDeleteEntry,
  onClearAll,
  onOpenVent,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredEntries = entries.filter((item) => {
    const matchSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.comfortAdvice?.comfortMessage || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchMood = filterMood === 'all' || item.mood === filterMood;
    return matchSearch && matchMood;
  });

  const handleDelete = (id: string) => {
    soundManager.playPaperRip();
    onDeleteEntry(id);
    setConfirmDeleteId(null);
  };

  const getMoodBadge = (mId: MoodType) => {
    const found = MOODS.find((m) => m.id === mId);
    if (!found) return null;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${found.bgPastel} ${found.color} border ${found.borderPastel}`}>
        <span>{found.emoji}</span>
        <span>{found.label}</span>
      </span>
    );
  };

  const getAfterMoodBadge = (afterMood?: string) => {
    if (!afterMood) return null;
    const mapping: Record<string, { label: string; bg: string }> = {
      lighter: { label: 'Nhẹ nhõm hơn 🕊️', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
      calmer: { label: 'Bình tĩnh lại 🌿', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      better: { label: 'Vui vẻ hơn ✨', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
      same: { label: 'Cần nghỉ ngơi 💤', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    };
    const conf = mapping[afterMood] || { label: afterMood, bg: 'bg-stone-50 text-stone-700 border-stone-200' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${conf.bg}`}>
        Sau khi xả: {conf.label}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Stats */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 md:p-6 border border-stone-200/80 shadow-xs mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h3 className="text-xl font-bold font-display text-stone-800">
                Nhật Ký Cảm Xúc Của Bạn
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Nơi lưu giữ hành trình bạn dũng cảm đối diện và vượt qua những ngày khó khăn.
            </p>
          </div>

          {entries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa toàn bộ nhật ký cảm xúc không? Hành động này không thể hoàn tác.')) {
                  onClearAll();
                  soundManager.playPaperRip();
                }
              }}
              className="text-stone-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa sạch nhật ký</span>
            </button>
          )}
        </div>

        {/* Quick Insight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-rose-700 block">Tổng số lần xả lòng</span>
            <span className="text-2xl font-extrabold text-stone-800 font-display">
              {entries.length}
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Đã được xoa dịu</span>
            <span className="text-2xl font-extrabold text-stone-800 font-display">
              {entries.filter((e) => e.afterMood === 'lighter' || e.afterMood === 'calmer' || e.afterMood === 'better').length}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-purple-50/70 border border-purple-100 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-purple-700 block">Trò chơi thư giãn đã qua</span>
            <span className="text-2xl font-extrabold text-stone-800 font-display">
              {entries.reduce((acc, curr) => acc + (curr.playedGames?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-stone-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung, tựa đề, lời an ủi..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Mood filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilterMood('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMood === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setFilterMood(m.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                filterMood === m.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List of Entries */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-10 border border-dashed border-stone-300 text-center">
          <span className="text-4xl mb-3 block">🌱</span>
          <h4 className="text-base font-bold text-stone-800 mb-1">
            {searchTerm || filterMood !== 'all'
              ? 'Không tìm thấy trang nhật ký nào phù hợp'
              : 'Trang nhật ký của bạn đang để trống'}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Bất cứ khi nào bạn cảm thấy áp lực bài vở, bất an hay buồn tủi, hãy mở cuốn sổ &ldquo;Xả lòng&rdquo; để viết ra nhé.
          </p>
          <button
            onClick={onOpenVent}
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Viết trang xả lòng đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const categoryLabel = CATEGORIES.find((c) => c.id === entry.category)?.label;

            return (
              <div
                key={entry.id}
                className="bg-white/95 rounded-3xl p-5 md:p-6 border-2 border-stone-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Washi tape visual on left top */}
                <div className="w-16 h-3 bg-amber-100 border-x border-amber-200 absolute -top-1 left-8 rotate-1 opacity-70 pointer-events-none" />

                {/* Entry Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getMoodBadge(entry.mood)}
                    {categoryLabel && (
                      <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full text-xs font-medium">
                        {categoryLabel}
                      </span>
                    )}
                    {getAfterMoodBadge(entry.afterMood)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.dateDisplay} • {entry.timeDisplay}
                    </span>

                    {/* Delete button (Chức năng 6: Xóa tâm sự) */}
                    {confirmDeleteId === entry.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded-xl">
                        <span className="text-[10px] text-rose-700 font-bold">Xóa bài này?</span>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[11px] underline cursor-pointer"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-stone-500 hover:text-stone-700 text-[11px] cursor-pointer ml-1"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(entry.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tâm sự này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Title */}
                {entry.title && (
                  <h4 className="text-base font-bold font-display text-stone-800 mb-2">
                    {entry.title}
                  </h4>
                )}

                {/* Vent Content Body */}
                <div className="bg-[#fdfbf7] rounded-2xl p-4 border border-stone-200/70 mb-3 notebook-lines-clean">
                  <p className="text-xs md:text-sm font-handwriting leading-relaxed text-stone-800 whitespace-pre-line">
                    {entry.content}
                  </p>
                </div>

                {/* Comfort Advice Section if available */}
                {entry.comfortAdvice && (
                  <div className="bg-gradient-to-r from-rose-50/70 to-amber-50/70 rounded-2xl p-4 border border-rose-100 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1.5">
                      <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
                      <span>Lời an ủi bạn đã nhận được:</span>
                    </div>
                    <p className="text-xs md:text-sm font-handwriting leading-relaxed text-stone-700 whitespace-pre-line mb-2">
                      {entry.comfortAdvice.comfortMessage}
                    </p>
                    {entry.comfortAdvice.healingQuote && (
                      <span className="text-xs font-bold text-stone-600 italic block border-t border-rose-100/60 pt-1.5">
                        &ldquo;{entry.comfortAdvice.healingQuote}&rdquo;
                      </span>
                    )}
                  </div>
                )}

                {/* Played Games / Activities tags */}
                {entry.playedGames && entry.playedGames.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 text-xs text-stone-500 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
                      <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
                      Trò chơi đã tham gia:
                    </span>
                    {entry.playedGames.map((gId) => {
                      const gm = MINI_GAMES.find((m) => m.id === gId);
                      return gm ? (
                        <span
                          key={gId}
                          className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-purple-200 flex items-center gap-1"
                        >
                          <span>{gm.icon}</span>
                          <span>{gm.title}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
