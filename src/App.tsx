import React, { useState, useEffect } from 'react';
import { DiaryEntry, MiniGameId, MoodType } from './types';
import { VentJournal } from './components/VentJournal';
import { EmotionDiary } from './components/EmotionDiary';
import { MiniGamesHub } from './components/MiniGamesHub';
import { ActivitySuggestions } from './components/ActivitySuggestions';
import { soundManager } from './utils/sound';
import { 
  BookOpen, 
  Gamepad2, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Info, 
  Feather,
  Lightbulb,
  Compass,
  Flame
} from 'lucide-react';

const STORAGE_KEY = 'xa_di_emotion_entries_v1';

// Initial sample entry so user immediately sees how the journal looks
const INITIAL_SAMPLE_ENTRIES: DiaryEntry[] = [
  {
    id: 'sample-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dateDisplay: 'Hôm qua',
    timeDisplay: '21:30',
    mood: 'stressed',
    category: 'study',
    title: 'Bài tập cuối kỳ dồn dập',
    content: 'Hôm nay mình thật sự thấy quá tải. Vừa phải ôn thi môn Toán, vừa phải nộp bài tiểu luận nhóm mà các bạn trong nhóm lại ỷ lại vào mình. Mình vừa mệt vừa muốn bỏ cuộc...',
    comfortAdvice: {
      comfortMessage: 'Gửi bạn thân mến, cảm ơn bạn đã trút bỏ sự mệt mỏi này vào đây. Gánh vác công việc một mình thật sự rất kiệt sức. Nhưng hãy nhớ rằng, bạn đã làm rất tốt phần việc của mình rồi. Hãy cho phép bản thân nghỉ ngơi 30 phút, hít thở thật sâu. Bạn không cần phải một mình giải cứu cả thế giới đâu nhé!',
      healingQuote: 'Dũng cảm không phải là không bao giờ mệt mỏi, mà là biết cho mình thời gian nghỉ ngơi để bước tiếp.',
      recommendedGames: ['bubble_pop', 'zen_plant'],
      reasonForGames: 'Nổ bóng giúp xả cơn bực bội ức chế và trồng cây mang lại niềm an ủi tích cực.',
      realLifeTips: ['Tạm gấp sách vở lại và đi rửa mặt nước mát', 'Uống một ly sữa ấm hoặc trà hoa cúc'],
    },
    afterMood: 'lighter',
    playedGames: ['bubble_pop'],
  },
];

export default function App() {
  // Main two compartments: 'vent' (Xả lòng) vs 'relax' (Giải tỏa)
  const [mainCompartment, setMainCompartment] = useState<'vent' | 'relax'>('vent');

  // Slide bar tabs:
  // 1) Xả lòng ('vent_write')
  // 2) Lời an ủi ('comfort_card')
  // 3) Trò chơi giải tỏa ('game_recommend')
  // 4) Mini game ('mini_games')
  // 5) Nhật ký cảm xúc ('diary')
  // 6) Gợi ý hoạt động ('suggestions')
  const [activeTab, setActiveTab] = useState<string>('vent_write');

  // Selected mini-game if active
  const [activeGameId, setActiveGameId] = useState<MiniGameId | null>(null);

  // Sound muted state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Emotion diary entries state
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore error
    }
    return INITIAL_SAMPLE_ENTRIES;
  });

  // Persist entries
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleSaveEntry = (
    newEntryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'dateDisplay' | 'timeDisplay'>
  ) => {
    const now = new Date();
    const entry: DiaryEntry = {
      ...newEntryData,
      id: `entry-${Date.now()}`,
      createdAt: now.toISOString(),
      dateDisplay: now.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      timeDisplay: now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAllEntries = () => {
    setEntries([]);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  // Quick switch from comfort advice to a game
  const handleLaunchGame = (gameId: MiniGameId) => {
    setMainCompartment('relax');
    setActiveTab('mini_games');
    setActiveGameId(gameId);
  };

  const handleCompleteGame = (gameId: MiniGameId) => {
    // Optionally update the latest entry's played games
    setEntries((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      const currentGames = first.playedGames || [];
      if (!currentGames.includes(gameId)) {
        return [{ ...first, playedGames: [...currentGames, gameId] }, ...rest];
      }
      return prev;
    });
  };

  // Sync tab clicks with main compartment
  const handleSelectTab = (tabId: string) => {
    soundManager.playClick();
    const targetTab = tabId === 'game_recommend' ? 'mini_games' : tabId === 'comfort_card' ? 'vent_write' : tabId;
    setActiveTab(targetTab);

    if (targetTab === 'vent_write' || targetTab === 'diary') {
      setMainCompartment('vent');
    } else {
      setMainCompartment('relax');
    }

    if (targetTab === 'mini_games') {
      setActiveGameId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-700 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900 pb-16">
      {/* Top Brand Header */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-300 via-amber-200 to-teal-200 flex items-center justify-center shadow-xs border border-rose-200/60 rotate-[-2deg]">
              <span className="text-xl filter drop-shadow-xs">🫧</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-stone-800">
                  CẮT ĐI NỖI SẦU
                </h1>
                <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Chữa lành &amp; Thư giãn
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Cuốn sổ nhỏ giúp học sinh - sinh viên giải tỏa áp lực &amp; tìm lại bình yên
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/80 shadow-2xs transition-colors cursor-pointer"
              title={isMuted ? 'Bật âm thanh dễ thương' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
            </button>
          </div>
        </div>

        {/* 2 NGĂN CHÍNH (Giao diện chia thành 2 ngăn chính: “Xả lòng” và “Giải tỏa”) */}
        <div className="max-w-6xl mx-auto mt-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/60 rounded-2xl max-w-md mx-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setMainCompartment('vent');
                setActiveTab('vent_write');
              }}
              className={`py-2 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainCompartment === 'vent'
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Ngăn &ldquo;Xả Lòng &amp; An Ủi&rdquo;</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setMainCompartment('relax');
                setActiveTab('mini_games');
                setActiveGameId(null);
              }}
              className={`py-2 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainCompartment === 'relax'
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              <span>Ngăn &ldquo;Giải Tỏa&rdquo;</span>
            </button>
          </div>
        </div>

        {/* SLIDE BAR NẰM Ở TRÊN LÀ CÁC CHỨC NĂNG (Gộp Xả lòng với Lời an ủi thành 1) */}
        <div className="max-w-6xl mx-auto mt-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max px-1">
            {[
              { id: 'vent_write', label: '1. Xả lòng & Lời an ủi', icon: '💌', comp: 'vent' },
              { id: 'mini_games', label: '2. Trò chơi giải tỏa', icon: '🎮', comp: 'relax' },
              { id: 'diary', label: '3. Nhật ký cảm xúc', icon: '📖', comp: 'vent' },
              { id: 'suggestions', label: '4. Gợi ý hoạt động', icon: '💡', comp: 'relax' },
            ].map((tab) => {
              const isCurrent = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                    isCurrent
                      ? 'bg-rose-500 text-white shadow-xs scale-102 ring-2 ring-rose-200'
                      : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* TAB 1: Xả lòng & Lời an ủi (Gộp thành 1 mục) */}
        {activeTab === 'vent_write' && (
          <VentJournal
            onSaveEntry={handleSaveEntry}
            onOpenGame={handleLaunchGame}
            onNavigateToTab={handleSelectTab}
            recentEntry={entries.length > 0 && entries[0].comfortAdvice ? entries[0] : null}
          />
        )}

        {/* TAB 2: Kho Trò Chơi Giải Tỏa & Mini Game (Đã gộp thành 1 mục) */}
        {activeTab === 'mini_games' && (
          <MiniGamesHub
            selectedGameId={activeGameId}
            onSelectGame={setActiveGameId}
            onCompleteGameSession={handleCompleteGame}
          />
        )}

        {/* TAB 3: Nhật ký cảm xúc */}
        {activeTab === 'diary' && (
          <EmotionDiary
            entries={entries}
            onDeleteEntry={handleDeleteEntry}
            onClearAll={handleClearAllEntries}
            onOpenVent={() => handleSelectTab('vent_write')}
          />
        )}

        {/* TAB 4: Gợi ý hoạt động */}
        {activeTab === 'suggestions' && (
          <ActivitySuggestions onSelectGame={handleLaunchGame} />
        )}
      </main>
    </div>
  );
}
