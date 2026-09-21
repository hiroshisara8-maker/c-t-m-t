import React, { useState } from 'react';
import { MOODS, CATEGORIES, WRITING_PROMPTS, MINI_GAMES, MOOD_COMFORT_MAP } from '../data/healingData';
import { MoodType, CategoryType, ComfortAdvice, MiniGameId, DiaryEntry } from '../types';
import { soundManager } from '../utils/sound';
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
  Quote
} from 'lucide-react';

interface VentJournalProps {
  onSaveEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'dateDisplay' | 'timeDisplay'>) => void;
  onOpenGame: (gameId: MiniGameId) => void;
  onNavigateToTab: (tab: string) => void;
  recentEntry?: DiaryEntry | null;
}

export const VentJournal: React.FC<VentJournalProps> = ({
  onSaveEntry,
  onOpenGame,
  onNavigateToTab,
  recentEntry,
}) => {
  const [mood, setMood] = useState<MoodType>('stressed');
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

  const selectedMoodConfig = MOODS.find((m) => m.id === mood) || MOODS[0];
  const moodComfort = MOOD_COMFORT_MAP[mood] || MOOD_COMFORT_MAP.stressed;
  const currentWhisper = moodComfort.whispers[whisperIdx % moodComfort.whispers.length];
  const currentQuote = moodComfort.comfortQuotes[quoteIdx % moodComfort.comfortQuotes.length];

  const handleSelectMood = (selectedMood: MoodType) => {
    setMood(selectedMood);
    setWhisperIdx(0);
    setQuoteIdx(0);
    soundManager.playClick();
  };

  const handleCycleComfort = () => {
    soundManager.playClick();
    setWhisperIdx((prev) => (prev + 1) % moodComfort.whispers.length);
    setQuoteIdx((prev) => (prev + 1) % moodComfort.comfortQuotes.length);
  };

  const handleRandomPrompt = () => {
    soundManager.playClick();
    const prompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    setContent((prev) => (prev ? `${prev}\n\n[Gợi ý]: ${prompt}` : prompt));
  };

  // Submit vent to receive comfort
  const handleSubmitVent = async () => {
    if (!content.trim()) return;

    setIsLoadingComfort(true);
    soundManager.playClick();

    try {
      const response = await fetch('/api/comfort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          mood: selectedMoodConfig.label,
          category: CATEGORIES.find((c) => c.id === category)?.label,
        }),
      });

      const resJson = await response.json();
      if (resJson && resJson.data) {
        setComfortAdvice(resJson.data);
        soundManager.playComfortChime();
      }
    } catch (err) {
      console.error('Error fetching comfort:', err);
    } finally {
      setIsLoadingComfort(false);
    }
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
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMood(m.id)}
                  className={`p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    mood === m.id
                      ? `${m.bgPastel} ${m.borderPastel} border-2 shadow-xs scale-102 ring-2 ring-stone-300`
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-bold text-stone-800">{m.label}</span>
                </button>
              ))}
            </div>
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
                onClick={() => setPaperStyle('lined')}
                className={`px-2 py-0.5 rounded-md ${
                  paperStyle === 'lined' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Kẻ ngang hồng
              </button>
              <button
                onClick={() => setPaperStyle('clean')}
                className={`px-2 py-0.5 rounded-md ${
                  paperStyle === 'clean' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Dòng kẻ êm
              </button>
              <button
                onClick={() => setPaperStyle('grid')}
                className={`px-2 py-0.5 rounded-md ${
                  paperStyle === 'grid' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-stone-100'
                }`}
              >
                Ô li tập vở
              </button>
            </div>

            <button
              onClick={handleRandomPrompt}
              className="text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Gợi ý câu hỏi bắt đầu
            </button>
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

          {/* Main Vent Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hãy viết ra tất cả những điều làm bạn mệt mỏi, uất ức, áp lực bài vở, bất đồng với bạn bè hay cảm giác lạc lõng... Đừng giữ trong lòng một mình nữa, cuốn sổ này tuyệt đối an toàn và lắng nghe bạn..."
            rows={8}
            className="w-full bg-transparent border-none outline-hidden text-sm md:text-base text-stone-800 placeholder:text-stone-400 resize-none font-handwriting leading-8 tracking-wide"
          />

          <div className="flex justify-between items-center text-[11px] text-stone-400 pt-2 border-t border-stone-200/60">
            <span>{content.length} ký tự tâm sự</span>
            <span>🔒 Bảo mật riêng tư trên trình duyệt của bạn</span>
          </div>
        </div>

        {/* Actions under the paper */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
          {/* Chức năng 6: Xóa tâm sự */}
          <button
            onClick={handleShredAndDiscard}
            disabled={!content.trim() && !comfortAdvice}
            className="text-stone-500 hover:text-rose-600 disabled:opacity-30 bg-stone-100 hover:bg-rose-50 px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xóa ngay không lưu vào nhật ký"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xé vụn &amp; Xóa tâm sự này</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Submit to get comfort */}
            <button
              onClick={handleSubmitVent}
              disabled={!content.trim() || isLoadingComfort}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {isLoadingComfort ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang lắng nghe &amp; gom lời an ủi...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Gửi tâm sự để nhận Lời An Ủi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* LỜI AN ỦI (Chức năng 2 & 3: Lời an ủi + Đề xuất trò chơi giải tỏa) */}
        {comfortAdvice && (
          <div className="mt-7 pt-6 border-t-2 border-dashed border-stone-200 animate-in fade-in slide-in-from-bottom-3 duration-500">
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
