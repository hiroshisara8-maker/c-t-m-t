import React, { useState } from 'react';
import { MINI_GAMES } from '../data/healingData';
import { MiniGameId, MiniGameMeta } from '../types';
import { soundManager } from '../utils/sound';
import { BubblePopGame } from './games/BubblePopGame';
import { SquishyGame } from './games/SquishyGame';
import { ZenPlantGame } from './games/ZenPlantGame';
import { DoodleCanvasGame } from './games/DoodleCanvasGame';
import { MindfulBreathingGame } from './games/MindfulBreathingGame';
import { ShredPaperGame } from './games/ShredPaperGame';
import { MatchingCardsGame } from './games/MatchingCardsGame';
import { 
  Gamepad2, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Flame, 
  Wind, 
  Palette, 
  Puzzle,
  CheckCircle2
} from 'lucide-react';

interface MiniGamesHubProps {
  selectedGameId: MiniGameId | null;
  onSelectGame: (id: MiniGameId | null) => void;
  onCompleteGameSession?: (gameId: MiniGameId) => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  selectedGameId,
  onSelectGame,
  onCompleteGameSession,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGames = MINI_GAMES.filter((g) => {
    if (filterCategory === 'all') return true;
    return g.category === filterCategory;
  });

  const handleBackToGrid = () => {
    soundManager.playClick();
    onSelectGame(null);
  };

  const handleGameDone = (gId: MiniGameId) => {
    if (onCompleteGameSession) {
      onCompleteGameSession(gId);
    }
    soundManager.playComfortChime();
  };

  // If a game is active, render that specific game view
  if (selectedGameId) {
    const activeMeta = MINI_GAMES.find((g) => g.id === selectedGameId);

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToGrid}
            className="bg-white/90 hover:bg-stone-100 text-stone-700 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs border border-stone-200 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về Kho Mini Game</span>
          </button>

          {activeMeta && (
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
              <span>{activeMeta.icon}</span>
              <span>{activeMeta.title}</span>
            </div>
          )}
        </div>

        {selectedGameId === 'bubble_pop' && (
          <BubblePopGame onComplete={() => handleGameDone('bubble_pop')} />
        )}
        {selectedGameId === 'squishy' && (
          <SquishyGame onComplete={() => handleGameDone('squishy')} />
        )}
        {selectedGameId === 'zen_plant' && (
          <ZenPlantGame onComplete={() => handleGameDone('zen_plant')} />
        )}
        {selectedGameId === 'doodle' && (
          <DoodleCanvasGame />
        )}
        {selectedGameId === 'mindful_breathing' && (
          <MindfulBreathingGame onComplete={() => handleGameDone('mindful_breathing')} />
        )}
        {selectedGameId === 'shred_paper' && (
          <ShredPaperGame onComplete={() => handleGameDone('shred_paper')} />
        )}
        {selectedGameId === 'matching_game' && (
          <MatchingCardsGame onComplete={() => handleGameDone('matching_game')} />
        )}
      </div>
    );
  }

  // Grid overview of all mini-games
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 md:p-6 border border-stone-200/80 shadow-xs mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎮</span>
          <h3 className="text-xl font-bold font-display text-stone-800">
            Kho Mini Game Giải Tỏa Áp Lực
          </h3>
        </div>
        <p className="text-xs md:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Tất cả trò chơi đều nhẹ nhàng, thời lượng ngắn từ 1 đến 3 phút, không gây áp lực điểm số, giúp bạn đánh lạc hướng dòng suy nghĩ tiêu cực và chuyển hóa sang trạng thái thư giãn.
        </p>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          {[
            { id: 'all', label: 'Tất cả trò chơi' },
            { id: 'action', label: '💥 Xả bực tức tức thì' },
            { id: 'calm', label: '🌱 Êm dịu & Nuôi dưỡng' },
            { id: 'creative', label: '🎨 Sáng tạo tự do' },
            { id: 'focus', label: '🧩 Định tâm & Tập trung' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Mini Games Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              soundManager.playClick();
              onSelectGame(game.id);
            }}
            className="group bg-white/95 rounded-3xl p-5 border-2 border-stone-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-4xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                  {game.icon}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${game.tagColor}`}>
                  {game.duration}
                </span>
              </div>

              <h4 className="text-base font-bold text-stone-800 font-display mb-1 group-hover:text-purple-700 transition-colors">
                {game.title}
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                {game.shortDesc}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Chơi ngay →
              </span>
              <span className="text-stone-400 text-[11px]">Thư giãn</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
