import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: number;
  icon: string;
  label: string;
  pairKey: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = [
  { icon: '🧋', label: 'Trà sữa ngọt ngào', key: 'boba' },
  { icon: '🐱', label: 'Mèo lười lười', key: 'cat' },
  { icon: '🌻', label: 'Hoa hướng dương', key: 'sunflower' },
  { icon: '📚', label: 'Góc sách ấm', key: 'book' },
  { icon: '☁️', label: 'Mây trôi lững lờ', key: 'cloud' },
  { icon: '☀️', label: 'Nắng ấm sớm mai', key: 'sun' },
];

export const MatchingCardsGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 1;

    SYMBOLS.forEach((sym) => {
      // 2 cards per symbol
      deck.push({
        id: idCounter++,
        icon: sym.icon,
        label: sym.label,
        pairKey: sym.key,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        icon: sym.icon,
        label: sym.label,
        pairKey: sym.key,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playClick();

    // Flip card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairKey === secondCard.pairKey) {
        // Match!
        setTimeout(() => {
          soundManager.playPop(120);
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsLocked(false);

          setMatchedPairs((p) => {
            const nextP = p + 1;
            if (nextP === SYMBOLS.length) {
              soundManager.playComfortChime();
              confetti({
                particleCount: 40,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#c084fc', '#f472b6', '#fde047'],
              });
            }
            return nextP;
          });
        }, 400);
      } else {
        // No match, flip back
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const isGameFinished = matchedPairs === SYMBOLS.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-purple-100 shadow-sm max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Ghép Tranh Thư Giãn
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Tập trung nhẹ nhàng để chuyển hóa dòng suy nghĩ hỗn loạn sang sự bình tâm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Đã ghép: {matchedPairs}/{SYMBOLS.length} cặp</span>
          </div>
          <button
            onClick={() => {
              initGame();
              soundManager.playClick();
            }}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Trộn bài chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const showContent = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched}
              className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300 transform select-none cursor-pointer ${
                card.isMatched
                  ? 'bg-purple-50/70 border-purple-200 scale-95 opacity-80'
                  : showContent
                  ? 'bg-white border-purple-300 shadow-md scale-100 ring-2 ring-purple-100'
                  : 'bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-200 shadow-xs hover:scale-102 active:scale-95'
              }`}
            >
              {showContent ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-75 duration-200">
                  <span className="text-3xl filter drop-shadow-xs">{card.icon}</span>
                  <span className="text-[10px] text-stone-600 font-medium mt-1 text-center line-clamp-1">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <span className="text-xl">✨</span>
                  <span className="text-[9px] font-bold text-purple-700 mt-1 uppercase tracking-wider text-center">
                    CẮT NỖI SẦU
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Finished Banner */}
      {isGameFinished && (
        <div className="mt-5 p-4 bg-purple-50/80 border border-purple-200 rounded-2xl text-center animate-in fade-in">
          <span className="text-3xl mb-1 block">🎉</span>
          <h4 className="text-base font-bold text-purple-900 mb-1">
            Bạn đã hoàn thành trong {moves} lượt lật!
          </h4>
          <p className="text-xs text-purple-700 max-w-sm mx-auto mb-3">
            Não bộ của bạn vừa được xoa dịu và chuyển đổi sự tập trung thành công.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={initGame}
              className="bg-white border border-purple-300 hover:bg-purple-100 text-purple-900 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Chơi ván mới
            </button>
            {onComplete && (
              <button
                onClick={onComplete}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tiếp tục thư giãn
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
