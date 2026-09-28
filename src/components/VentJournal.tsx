import React, { useState, useRef } from 'react';
import { MOODS, CATEGORIES, WRITING_PROMPTS, MINI_GAMES, MOOD_COMFORT_MAP } from '../data/healingData';
import { MoodType, CategoryType, ComfortAdvice, MiniGameId, DiaryEntry } from '../types';
import { soundManager } from '../utils/sound';
import { generateClientComfortAdvice } from '../utils/comfortHelper';
import { 
  Heart, 
  Sparkles, 
  Send, 
  Trash2, 
  Gamepad2, 
  BookmarkCheck, 
  Lightbulb, 
  HelpCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  RotateCw,
  Volume2,
  Quote,
  AlertCircle,
  Check
} from 'lucide-react';

interface VentJournalProps {
  onSaveEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'dateDisplay' | 'timeDisplay'>) => void;
  onOpenGame: (gameId: MiniGameId) => void;
  onNavigateToTab: (tab: string) => void;
  recentEntry?: DiaryEntry | null;
  entries?: DiaryEntry[];
}

// Quick starter topics for students to vent with 1 click
const QUICK_VENT_CHIPS = [
  { label: '📚 Áp lực điểm số & bài thi', text: 'Hôm nay mình thấy rất nặng đầu vì bài kiểm tra và điểm số. Mình sợ không đạt được kỳ vọng của gia đình và bản thân...' },
  { label: '🥱 Kiệt sức & Quá tải', text: 'Mình kiệt sức hoàn toàn rồi, deadline dồn dập và mọi thứ làm mình ngộp thở, chỉ muốn được nằm yên không phải nghĩ suy...' },
  { label: '😤 Bực dọc & Bất đồng', text: 'Có chuyện bất công và bực mình vừa xảy ra khiến mình ấm ức, muốn xả hết những cảm xúc nghẹn ứ này ra...' },
  { label: '🌧️ Lạc lõng & Cô đơn', text: 'Dù ở giữa đám đông bạn bè nhưng mình thấy cô độc đến lạ, chẳng ai thật sự hiểu được nỗi niềm trong lòng mình...' },
  { label: '😰 Bồn chồn & Lo ngày mai', text: 'Trái tim mình cứ đập nhanh và bồn chồn lo lắng cho những chuyện chưa xảy đến vào ngày mai...' },
];

export const VentJournal: React.FC<VentJournalProps> = ({
  onSaveEntry,
  onOpenGame,
  onNavigateToTab,
  recentEntry,
  entries = [],
}) => {
  // Remember user's active selected mood in localStorage
  const [mood, setMood] = useState<MoodType>(() => {
    try {
      const saved = localStorage.getItem('xa_di_current_selected_mood') as MoodType | null;
      if (saved && MOODS.some((m) => m.id === saved)) return saved;
    } catch {}
    return 'stressed';
  });

  const [autoSaveMood, setAutoSaveMood] = useState<boolean>(() => {
    try {
      return localStorage.getItem('xa_di_auto_save_mood') === 'true';
    } catch {}
    return false;
  });

  const [lastSavedMoodMsg, setLastSavedMoodMsg] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryType>('study');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [paperStyle, setPaperStyle] = useState<'lined' | 'clean' | 'grid'>('lined');
  const [isLoadingComfort, setIsLoadingComfort] = useState<boolean>(false);
  const [comfortAdvice, setComfortAdvice] = useState<ComfortAdvice | null>(null);
  const [isCrumpled, setIsCrumpled] = useState<boolean>(false);
  const [afterMood, setAfterMood] = useState<'better' | 'calmer' | 'lighter' | 'same'>('lighter');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [whisperIdx, setWhisperIdx] = useState<number>(0);
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [showRecentComfort, setShowRecentComfort] = useState<boolean>(false);
  const [emptyWarning, setEmptyWarning] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const comfortSectionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedMoodConfig = MOODS.find((m) => m.id === mood) || MOODS[0];
  const moodComfort = MOOD_COMFORT_MAP[mood] || MOOD_COMFORT_MAP.stressed;
  const currentWhisper = moodComfort.whispers[whisperIdx % moodComfort.whispers.length];
  const currentQuote = moodComfort.comfortQuotes[quoteIdx % moodComfort.comfortQuotes.length];

  // Quick save mood check-in directly to the diary and local storage
  const handleQuickSaveMood = (targetMood: MoodType = mood, playChime = true) => {
    const config = MOODS.find((m) => m.id === targetMood) || selectedMoodConfig;
    const moodComfortData = MOOD_COMFORT_MAP[targetMood] || moodComfort;
    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || 'Cuộc sống';

    const quickAdvice: ComfortAdvice = {
      comfortMessage: `Chào bạn, mình đã ghi nhận cảm xúc "${config.label}" của bạn hôm nay. Hãy nhớ rằng: "${moodComfortData.whispers[0]}"`,
      healingQuote: moodComfortData.healingAffirmation,
      recommendedGames: ['bubble_pop', 'zen_plant'],
      reasonForGames: `Thư giãn và xoa dịu cảm giác ${config.label.toLowerCase()}.`,
      realLifeTips: [moodComfortData.suggestedTip, 'Uống một ngụm nước ấm và hít thở nhẹ nhàng'],
    };

    onSaveEntry({
      mood: targetMood,
      category,
      title: `Điểm danh cảm xúc: ${config.label} ${config.emoji}`,
      content: `[Điểm danh cảm xúc] Tâm trạng hiện tại: ${config.label} (${config.description}).\nLời tự nhủ dành cho bản thân: "${moodComfortData.healingAffirmation}"`,
      comfortAdvice: quickAdvice,
      afterMood: 'calmer',
      isQuickCheckIn: true,
      playedGames: ['bubble_pop'],
    });

    if (playChime) {
      soundManager.playComfortChime();
    }
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setLastSavedMoodMsg(`Đã lưu cảm xúc "${config.label}" vào Nhật ký lúc ${timeStr}! 🌸`);
    setTimeout(() => {
      setLastSavedMoodMsg(null);
    }, 4500);
  };

  const handleSelectMood = (selectedMood: MoodType) => {
    setMood(selectedMood);
    setWhisperIdx(0);
    setQuoteIdx(0);
    soundManager.playClick();
    try {
      localStorage.setItem('xa_di_current_selected_mood', selectedMood);
    } catch {}

    if (autoSaveMood) {
      handleQuickSaveMood(selectedMood, false);
    }
  };

  const handleCycleComfort = () => {
    soundManager.playClick();
    setWhisperIdx((prev) => (prev + 1) % moodComfort.whispers.length);
    setQuoteIdx((prev) => (prev + 1) % moodComfort.comfortQuotes.length);
  };

  const handleRandomPrompt = () => {
    soundManager.playClick();
    setEmptyWarning(null);
    const prompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    setContent((prev) => (prev ? `${prev}\n\n[Gợi ý]: ${prompt}` : prompt));
    textareaRef.current?.focus();
  };

  const handleApplyQuickStarter = (starterText: string) => {
    soundManager.playClick();
    setEmptyWarning(null);
    setContent(starterText);
    textareaRef.current?.focus();
  };

  // Re-engineered Submit Vent: Guarantees comfort + AUTO-SAVES feeling and journal to Diary
  const handleSubmitVent = async () => {
    // If empty: gently guide user and focus textarea
    if (!content.trim()) {
      soundManager.playClick();
      setEmptyWarning('Bạn ơi, hãy gõ vài dòng tâm sự hoặc chọn một gợi ý nhanh bên dưới để gửi nhé 🌱');
      textareaRef.current?.focus();
      setTimeout(() => setEmptyWarning(null), 4500);
      return;
    }

    setEmptyWarning(null);
    setIsLoadingComfort(true);
    soundManager.playClick();

    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || 'Cuộc sống';

    try {
      // Abort controller timeout at 3.8s for guaranteed fast feedback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3800);

      let finalAdvice: ComfortAdvice | null = null;

      try {
        const response = await fetch('/api/comfort', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            text: content.trim(),
            mood: selectedMoodConfig.label,
            category: categoryLabel,
          }),
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const resJson = await response.json();
          if (resJson && resJson.data && resJson.data.comfortMessage) {
            finalAdvice = resJson.data;
          }
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        console.warn('Network timeout or AI fetch issue, fallback will activate:', fetchErr);
      }

      // If server response wasn't ideal, use the client-side empathy engine
      if (!finalAdvice) {
        finalAdvice = generateClientComfortAdvice(content.trim(), mood, categoryLabel);
      }

      setComfortAdvice(finalAdvice);

      // AUTOMATICALLY SAVE ENTRY TO EMOTION DIARY!
      onSaveEntry({
        mood,
        category,
        title: title.trim() || undefined,
        content: content.trim(),
        comfortAdvice: finalAdvice,
        afterMood,
        playedGames: finalAdvice.recommendedGames || [],
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);

      onComfortSuccess();
    } catch (err) {
      console.warn('Fallback empathy triggered:', err);
      const clientAdvice = generateClientComfortAdvice(content.trim(), mood, categoryLabel);
      setComfortAdvice(clientAdvice);
      onSaveEntry({
        mood,
        category,
        title: title.trim() || undefined,
        content: content.trim(),
        comfortAdvice: clientAdvice,
        afterMood,
        playedGames: clientAdvice.recommendedGames || [],
      });
      setSavedSuccess(true);
      onComfortSuccess();
    } finally {
      setIsLoadingComfort(false);
    }
  };

  const onComfortSuccess = () => {
    soundManager.playComfortChime();
    setSuccessToast('Đã gửi tâm sự & lưu trữ cảm xúc vào Nhật ký thành công! Lời an ủi ấm áp đã sẵn sàng bên dưới 💌');
    setTimeout(() => setSuccessToast(null), 5000);

    // Smoothly scroll down so the user immediately sees the generated comfort advice
    setTimeout(() => {
      comfortSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Chức năng 6: Xóa tâm sự sau khi viết (Xé bỏ tức thì không lưu)
  const handleShredAndDiscard = () => {
    if (!content.trim() && !comfortAdvice) return;
    setIsCrumpled(true);
    soundManager.playPaperRip(true);
    setTimeout(() => soundManager.playPaperCrumple(), 280);
    setTimeout(() => {
      setContent('');
      setTitle('');
      setComfortAdvice(null);
      setIsCrumpled(false);
      setEmptyWarning(null);
      setSuccessToast(null);
    }, 850);
  };

  // Chức năng 5: Lưu vào nhật ký cảm xúc
  const handleSaveToDiary = () => {
    if (!content.trim()) return;

    onSaveEntry({
      mood,
      category,
      title: title.trim() || undefined,
      content: content.trim(),
      comfortAdvice: comfortAdvice || undefined,
      afterMood,
      playedGames: comfortAdvice?.recommendedGames || [],
    });

    soundManager.playComfortChime();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Notebook Wrapper with Spiral / Binder Styling */}
      <div className="relative bg-[#faf7f2] rounded-3xl p-3 md:p-6 shadow-xl border-2 border-stone-200/80">
        {/* Notebook top spiral ring visuals */}
        <div className="hidden sm:flex justify-around px-8 -mt-7 mb-4 pointer-events-none">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-3 h-8 bg-gradient-to-b from-stone-400 to-stone-300 rounded-full shadow-md border border-stone-500/40" />
              <div className="w-2 h-2 rounded-full bg-stone-700/60 -mt-1" />
            </div>
          ))}
        </div>

        {/* Washi Tape Accent on top right */}
        <div className="absolute -top-3 right-8 bg-pink-200/90 text-pink-700 border border-pink-300 px-4 py-1 rounded-sm rotate-2 text-[11px] font-handwriting font-bold tracking-wider shadow-xs pointer-events-none">
          XẢ HẾT RA NÀO ~
        </div>

        {/* Mood & Category Bar */}
        <div className="bg-white/90 rounded-2xl p-4 border border-stone-200/80 shadow-xs mb-4">
          <div className="mb-3">
            <span className="text-xs font-bold text-stone-700 block mb-2">
              1. Bạn đang cảm thấy thế nào? (Chọn tâm trạng hiện tại):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMood(m.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                      isSelected
                        ? `${m.bgPastel} ${m.borderPastel} border-2 shadow-sm scale-102 ring-2 ring-rose-300/80`
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    <span className="text-2xl filter drop-shadow-xs">{m.emoji}</span>
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-0.5">
                      {m.label}
                      {isSelected && <Check className="w-3 h-3 text-rose-600 inline shrink-0" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Khu vực lưu trữ cảm xúc & Điểm danh tâm trạng nhanh */}
            <div className="mt-3 p-3 bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-stone-50 rounded-2xl border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-xl shadow-2xs shrink-0">
                  {selectedMoodConfig.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-stone-800">
                      Tâm trạng hiện tại: <span className="text-rose-600 font-extrabold">{selectedMoodConfig.label}</span>
                    </span>
                    <span className="text-[11px] text-stone-500 hidden md:inline">
                      • {selectedMoodConfig.description}
                    </span>
                  </div>

                  {lastSavedMoodMsg ? (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {lastSavedMoodMsg}
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Bấm &ldquo;Lưu cảm xúc này&rdquo; để lưu ngay vào Nhật ký mà không cần viết bài dài
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
                {/* Auto-save checkbox */}
                <label className="flex items-center gap-1.5 text-[11px] text-stone-600 cursor-pointer select-none bg-white/90 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={autoSaveMood}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setAutoSaveMood(val);
                      try {
                        localStorage.setItem('xa_di_auto_save_mood', String(val));
                      } catch {}
                      if (val) {
                        handleQuickSaveMood(mood, true);
                      }
                    }}
                    className="w-3.5 h-3.5 rounded text-rose-500 focus:ring-rose-400 cursor-pointer accent-rose-500"
                  />
                  <span>Tự lưu khi chọn</span>
                </label>

                {/* Quick Save Mood Button */}
                <button
                  type="button"
                  onClick={() => handleQuickSaveMood(mood, true)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                  title="Lưu lại cảm xúc này vào Nhật Ký ngay lập tức"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Lưu cảm xúc này</span>
                </button>

                {/* Open Diary Button */}
                <button
                  type="button"
                  onClick={() => onNavigateToTab('diary')}
                  className="bg-white hover:bg-stone-100 active:scale-95 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
                  title="Xem lịch sử cảm xúc đã lưu trong Nhật Ký"
                >
                  <span>📖 Nhật ký</span>
                </button>
              </div>
            </div>

            {/* Recent Logged Emotions History Pills */}
            {entries && entries.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-stone-500">
                <span className="font-semibold text-stone-600 whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  Đã lưu gần đây:
                </span>
                <div className="flex items-center gap-1.5 min-w-max">
                  {entries.slice(0, 5).map((item) => {
                    const mConf = MOODS.find((m) => m.id === item.mood);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigateToTab('diary')}
                        className="bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 px-2 py-0.5 rounded-lg text-[10px] font-medium text-stone-700 cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                        title={`${item.dateDisplay} ${item.timeDisplay}: ${item.title || item.content.slice(0, 30)}`}
                      >
                        <span>{mConf?.emoji}</span>
                        <span className="font-semibold">{mConf?.label}</span>
                        <span className="text-stone-400 text-[9px]">{item.timeDisplay}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-bold text-stone-700 block mb-2">
              2. Áp lực này bắt nguồn từ đâu?
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id);
                    soundManager.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LỜI AN ỦI PHÙ HỢP VỚI CẢM XÚC Ở CHỖ XẢ LÒNG (Tức thời theo tâm trạng) */}
        <div className="mb-4 bg-gradient-to-r from-rose-50/95 via-amber-50/90 to-indigo-50/95 rounded-2xl p-4 md:p-5 border-2 border-rose-200/90 shadow-xs relative overflow-hidden transition-all duration-300">
          {/* Top banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl select-none animate-bounce">💌</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs md:text-sm font-bold text-stone-800 font-display">
                    Lời an ủi dành cho bạn lúc này
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedMoodConfig.bgPastel} ${selectedMoodConfig.color} border ${selectedMoodConfig.borderPastel} shadow-2xs`}>
                    {selectedMoodConfig.emoji} {selectedMoodConfig.label}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  {moodComfort.gentleTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {recentEntry?.comfortAdvice && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setShowRecentComfort(!showRecentComfort);
                  }}
                  title="Xem lại lời an ủi đã lưu gần nhất"
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95 ${
                    showRecentComfort
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white/95 hover:bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  <span>💌 {showRecentComfort ? 'Đóng lời an ủi cũ' : `Lời an ủi gần nhất (${recentEntry.dateDisplay})`}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => soundManager.playComfortChime()}
                title="Nghe chuông chữa lành dịu tâm"
                className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-white text-stone-700 border border-stone-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Chuông dịu êm</span>
              </button>

              <button
                type="button"
                onClick={handleCycleComfort}
                title="Xem lời an ủi khác cho tâm trạng này"
                className="px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5 text-rose-500" />
                <span>Đổi lời an ủi ({whisperIdx + 1}/{moodComfort.whispers.length})</span>
              </button>
            </div>
          </div>

          {/* Sâu sắc, dịu dàng: Lời thì thầm an ủi */}
          <div className="bg-white/90 rounded-xl p-3.5 border border-rose-100 shadow-2xs mb-2.5">
            <p className="text-xs md:text-sm font-handwriting text-stone-800 leading-relaxed tracking-wide">
              &ldquo;{currentWhisper}&rdquo;
            </p>
          </div>

          {/* Badges: Trích dẫn chữa lành, Lời tự nhủ và Mẹo nhỏ */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="bg-rose-100/80 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-2xs">
              <Quote className="w-3 h-3 text-rose-500 shrink-0" />
              <span>{currentQuote}</span>
            </div>

            <div className="bg-emerald-100/80 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-2xs">
              <span>🌿</span>
              <span>{moodComfort.healingAffirmation}</span>
            </div>

            <div className="bg-amber-100/80 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium shadow-2xs">
              <span>💡</span>
              <span>{moodComfort.suggestedTip}</span>
            </div>
          </div>

          {/* Recent comfort card if toggled */}
          {showRecentComfort && recentEntry?.comfortAdvice && (
            <div className="mt-3 pt-3 border-t border-rose-200/80 animate-in fade-in duration-200">
              <div className="bg-purple-50/90 rounded-xl p-3.5 border border-purple-200 shadow-2xs">
                <span className="text-[11px] font-bold text-purple-900 block mb-1">
                  💌 Lời an ủi đã nhận cho tâm sự ngày {recentEntry.dateDisplay}:
                </span>
                <p className="text-xs md:text-sm font-handwriting text-stone-800 leading-relaxed mb-2 whitespace-pre-line">
                  {recentEntry.comfortAdvice.comfortMessage}
                </p>
                {recentEntry.comfortAdvice.healingQuote && (
                  <p className="text-xs font-handwriting font-bold text-purple-700 italic text-center pt-1 border-t border-purple-200/60">
                    &ldquo;{recentEntry.comfortAdvice.healingQuote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* The Writing Paper (Cuốn Sổ Xả Lòng) */}
        <div
          className={`relative rounded-2xl border border-stone-300/80 shadow-inner p-5 md:p-7 transition-all ${
            paperStyle === 'lined'
              ? 'notebook-lines'
              : paperStyle === 'grid'
              ? 'notebook-grid'
              : 'notebook-lines-clean'
          } ${isCrumpled ? 'animate-crumple' : ''}`}
        >
          {/* Paper Style Selector & Prompt Helper */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-stone-200/60 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-600">Trang sổ:</span>
              <button
                type="button"
                onClick={() => setPaperStyle('lined')}
                className={`px-2 py-0.5 rounded-md cursor-pointer ${
                  paperStyle === 'lined' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Kẻ ngang hồng
              </button>
              <button
                type="button"
                onClick={() => setPaperStyle('clean')}
                className={`px-2 py-0.5 rounded-md cursor-pointer ${
                  paperStyle === 'clean' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Dòng kẻ êm
              </button>
              <button
                type="button"
                onClick={() => setPaperStyle('grid')}
                className={`px-2 py-0.5 rounded-md cursor-pointer ${
                  paperStyle === 'grid' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Ô li tập vở
              </button>
            </div>

            <button
              type="button"
              onClick={handleRandomPrompt}
              className="text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Gợi ý câu hỏi bắt đầu
            </button>
          </div>

          {/* Quick vent starter chips */}
          <div className="mb-2.5">
            <span className="text-[11px] font-bold text-stone-500 block mb-1">
              💡 Gợi ý chủ đề nhanh (Bấm để điền mẫu tâm sự ngay):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_VENT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyQuickStarter(chip.text)}
                  className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-300 text-[11px] font-medium transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diary Title */}
          <div className="mb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Đặt một tựa đề cho trang sổ hôm nay (tuỳ chọn)..."
              className="w-full bg-transparent border-b border-stone-200/60 pb-1 text-base md:text-lg font-bold font-display text-stone-800 placeholder:text-stone-400 placeholder:font-normal focus:outline-hidden focus:border-rose-300"
            />
          </div>

          {/* Supportive note right above writing area */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 py-1 mb-1.5 px-2 bg-white/50 rounded-lg border border-stone-200/40">
            <span className="flex items-center gap-1 font-medium">
              <span className="text-rose-400">🌱</span>
              <span>Trải lòng về cảm xúc {selectedMoodConfig.label.toLowerCase()}: Đừng ngần ngại, hãy viết ra hết nhé...</span>
            </span>
            <span className="hidden sm:inline text-stone-500 italic">
              {moodComfort.healingAffirmation}
            </span>
          </div>

          {/* Empty Warning notice if user clicks Send without writing */}
          {emptyWarning && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-800 animate-in fade-in slide-in-from-top-1 shadow-xs mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
              <span className="font-semibold">{emptyWarning}</span>
            </div>
          )}

          {/* Main Vent Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (emptyWarning) setEmptyWarning(null);
            }}
            placeholder="Hãy viết ra tất cả những điều làm bạn mệt mỏi, uất ức, áp lực bài vở, bất đồng với bạn bè hay cảm giác lạc lõng... Đừng giữ trong lòng một mình nữa, cuốn sổ này tuyệt đối an toàn và lắng nghe bạn..."
            rows={8}
            className={`w-full bg-transparent border-none outline-hidden text-sm md:text-base text-stone-800 placeholder:text-stone-400 resize-none font-handwriting leading-8 tracking-wide transition-all ${
              emptyWarning ? 'ring-2 ring-amber-300 rounded-xl p-2 bg-amber-50/20' : ''
            }`}
          />

          <div className="flex justify-between items-center text-[11px] text-stone-400 pt-2 border-t border-stone-200/60">
            <span>{content.length} ký tự tâm sự</span>
            <span>🔒 Bảo mật riêng tư trên trình duyệt của bạn</span>
          </div>
        </div>

        {/* Success toast notification after sending */}
        {successToast && (
          <div className="mt-3 flex items-center justify-between gap-2 p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs md:text-sm text-emerald-800 animate-in fade-in slide-in-from-top-2 shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />
              <span className="font-bold">{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                comfortSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>Xem ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Actions under the paper */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
          {/* Chức năng 6: Xóa tâm sự */}
          <button
            type="button"
            onClick={handleShredAndDiscard}
            disabled={!content.trim() && !comfortAdvice}
            className="text-stone-500 hover:text-rose-600 disabled:opacity-30 bg-stone-100 hover:bg-rose-50 px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xóa ngay không lưu vào nhật ký"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xé vụn &amp; Xóa tâm sự này</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Quick save button if user just wants to save directly */}
            {content.trim() && !comfortAdvice && (
              <button
                type="button"
                onClick={handleSaveToDiary}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Lưu thẳng vào nhật ký không cần nhận lời an ủi"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>{savedSuccess ? 'Đã lưu!' : 'Lưu nhanh vào Sổ'}</span>
              </button>
            )}

            {/* Re-engineered: Submit to get comfort */}
            <button
              type="button"
              onClick={handleSubmitVent}
              disabled={isLoadingComfort}
              className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer relative overflow-hidden ${
                isLoadingComfort
                  ? 'bg-rose-400 text-white cursor-wait'
                  : !content.trim()
                  ? 'bg-rose-500/90 hover:bg-rose-500 text-white shadow-rose-200'
                  : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-300 ring-2 ring-rose-300/60'
              }`}
              title="Gửi tâm sự để nhận Lời An Ủi và gợi ý trò chơi giải tỏa"
            >
              {isLoadingComfort ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Đang lắng nghe &amp; gom lời an ủi...</span>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Heart className="w-4 h-4 fill-white animate-pulse" />
                    <Sparkles className="w-2.5 h-2.5 text-amber-200 absolute -top-1.5 -right-1.5" />
                  </div>
                  <span>Gửi tâm sự để nhận Lời An Ủi</span>
                  <Send className="w-3.5 h-3.5 opacity-90" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* LỜI AN ỦI (Chức năng 2 & 3: Lời an ủi + Đề xuất trò chơi giải tỏa) */}
        {comfortAdvice && (
          <div ref={comfortSectionRef} className="mt-7 pt-6 border-t-2 border-dashed border-stone-200 scroll-mt-20 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="bg-gradient-to-br from-rose-50/90 via-amber-50/80 to-purple-50/90 rounded-3xl p-6 md:p-8 border-2 border-rose-200/70 shadow-md relative overflow-hidden">
              {/* Decorative Stamp */}
              <div className="absolute top-4 right-4 bg-white/90 border border-rose-200 rounded-full px-3 py-1 flex items-center gap-1 text-[11px] font-bold text-rose-700 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Gửi bạn một cái ôm</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">💌</span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-stone-800">
                    Lời Nhắn An Ủi Dành Riêng Cho Bạn
                  </h3>
                  <span className="text-xs text-stone-500">
                    Cảm ơn bạn đã can đảm trút bỏ gánh nặng này
                  </span>
                </div>
              </div>

              {/* Comfort message body */}
              <div className="bg-white/80 rounded-2xl p-5 border border-rose-100/80 shadow-xs mb-4">
                <p className="text-sm md:text-base font-handwriting leading-relaxed text-stone-800 whitespace-pre-line tracking-wide">
                  {comfortAdvice.comfortMessage}
                </p>

                {/* Healing Quote */}
                {comfortAdvice.healingQuote && (
                  <div className="mt-4 pt-3 border-t border-rose-100 text-center">
                    <span className="text-xs text-rose-600 font-bold block mb-1">
                      🌸 Thông điệp nhỏ nhắn:
                    </span>
                    <p className="text-sm md:text-base font-handwriting font-bold text-stone-700 italic">
                      &ldquo;{comfortAdvice.healingQuote}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Real Life Tips */}
              {comfortAdvice.realLifeTips && comfortAdvice.realLifeTips.length > 0 && (
                <div className="mb-5 bg-white/60 rounded-2xl p-3.5 border border-stone-200/60">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Việc nhỏ bạn có thể làm ngay lúc này:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {comfortAdvice.realLifeTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 px-3 py-2 rounded-xl text-xs text-stone-700 border border-stone-200/60 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chức năng 3 & 7: Trò chơi giải tỏa & Gợi ý hoạt động phù hợp */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-purple-600" />
                    Trò chơi giải tỏa đề xuất cho tâm trạng của bạn:
                  </span>
                  <span className="text-[11px] text-stone-500 italic">
                    {comfortAdvice.reasonForGames}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {comfortAdvice.recommendedGames.map((gameId) => {
                    const gameInfo = MINI_GAMES.find((g) => g.id === gameId);
                    if (!gameInfo) return null;
                    return (
                      <div
                        key={gameId}
                        className="bg-white hover:bg-stone-50 border-2 border-purple-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{gameInfo.icon}</span>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-stone-800">
                              {gameInfo.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1">
                              {gameInfo.shortDesc}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onOpenGame(gameId);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <span>Chơi ngay</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chức năng 5 & 6: Kết thúc & Lưu lại cảm xúc (hoặc Xóa tâm sự) */}
              <div className="bg-white/80 rounded-2xl p-4 border border-rose-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-1.5">
                    Bạn thấy lòng mình sau khi xả ra thế nào?
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: 'lighter', label: 'Nhẹ nhõm hơn 🕊️' },
                      { id: 'calmer', label: 'Bình tĩnh lại 🌿' },
                      { id: 'better', label: 'Vui vẻ hơn ✨' },
                      { id: 'same', label: 'Vẫn cần nghỉ ngơi 💤' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setAfterMood(st.id as any);
                          soundManager.playClick();
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          afterMood === st.id
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShredAndDiscard}
                    className="text-stone-500 hover:text-rose-600 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    Xóa không lưu
                  </button>
                  <button
                    onClick={handleSaveToDiary}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{savedSuccess ? 'Đã lưu vào Nhật Ký!' : 'Lưu vào Nhật Ký Cảm Xúc'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
