import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/sound';
import { Droplet, Sparkles, RotateCcw, CheckCircle2, Sprout } from 'lucide-react';
import { PlantIllustration } from './PlantIllustration';

interface SeedVariety {
  id: string;
  name: string;
  icon: string;
  description: string;
  stages: {
    icon: string;
    label: string;
    subtext: string;
  }[];
  finalColor: string;
}

const SEED_VARIETIES: SeedVariety[] = [
  {
    id: 'clover',
    name: 'Cỏ 4 Lá May Mắn',
    icon: '🍀',
    description: 'Mang lại sự an tâm, vận may và những điều kỳ diệu',
    finalColor: 'from-emerald-200 to-green-300 text-emerald-800',
    stages: [
      { icon: '🌰', label: 'Hạt mầm may mắn', subtext: 'Đang ngủ yên dưới lòng đất mát' },
      { icon: '🌱', label: 'Mầm cỏ tí hon', subtext: 'Bắt đầu nhú hai lá mầm đầu tiên' },
      { icon: '☘️', label: 'Cỏ ba lá xanh mướt', subtext: 'Hấp thu tình yêu thương và lời khích lệ' },
      { icon: '🌿', label: 'Lá thứ tư đang hé nở', subtext: 'Một điều kỳ diệu sắp xuất hiện' },
      { icon: '🍀', label: 'Cỏ Bốn Lá Tỏa Sáng!', subtext: 'Chúc mừng bạn! Vận may và bình an đang ở bên bạn' },
    ],
  },
  {
    id: 'sunflower',
    name: 'Hoa Hướng Dương Rực Rỡ',
    icon: '🌻',
    description: 'Tiếp thêm năng lượng tích cực, niềm tin vượt qua khó khăn',
    finalColor: 'from-amber-200 to-yellow-300 text-amber-900',
    stages: [
      { icon: '🌰', label: 'Hạt hướng dương', subtext: 'Chứa chan bao ước vọng tuổi trẻ' },
      { icon: '🌱', label: 'Chồi non kiên cường', subtext: 'Dũng cảm đội đất vươn mình' },
      { icon: '🌿', label: 'Thân cây cứng cáp', subtext: 'Lá to xanh mướt hướng về phía ánh sáng' },
      { icon: '🪴', label: 'Đóa nụ vàng ươm', subtext: 'Ấp ủ mật ngọt và sức sống mãnh liệt' },
      { icon: '🌻', label: 'Hướng Dương Bừng Nở!', subtext: 'Bạn là mặt trời nhỏ tỏa sáng ấm áp!' },
    ],
  },
  {
    id: 'cherry',
    name: 'Hoa Anh Đào An Yên',
    icon: '🌸',
    description: 'Xoa dịu những vết thương lòng, đem lại cảm giác ngọt ngào dịu êm',
    finalColor: 'from-pink-200 to-rose-200 text-rose-800',
    stages: [
      { icon: '🌰', label: 'Hạt giống mùa xuân', subtext: 'Được ấp ôm bởi đất mẹ hiền' },
      { icon: '🌱', label: 'Nhành non phớt hồng', subtext: 'Nhẹ nhàng và e ấp trong sương mai' },
      { icon: '🌿', label: 'Cành hoa mơn mởn', subtext: 'Từng chiếc lá non dịu mát tâm hồn' },
      { icon: '🌷', label: 'Chùm nụ chúm chím', subtext: 'Chuẩn bị cho khoảnh khắc bừng sáng' },
      { icon: '🌸', label: 'Anh Đào Nở Rộ Thơ Mộng!', subtext: 'Tâm hồn bạn xứng đáng được dịu êm như cánh hoa' },
    ],
  },
  {
    id: 'succulent',
    name: 'Sen Đá Kiên Cường',
    icon: '🪴',
    description: 'Sức sống bền bỉ, nhắc nhở bạn mạnh mẽ vượt qua mọi bão giông',
    finalColor: 'from-teal-200 to-emerald-200 text-teal-900',
    stages: [
      { icon: '🌰', label: 'Mầm sen đá', subtext: 'Tuy nhỏ bé nhưng sức sống vô cùng dẻo dai' },
      { icon: '🌱', label: 'Lá mọng nước đầu tiên', subtext: 'Tích lũy từng giọt nước quý giá' },
      { icon: '🌵', label: 'Bông sen đá xếp lớp', subtext: 'Đối diện nắng gió mà vẫn xanh tươi' },
      { icon: '🪴', label: 'Chậu sen đơm nụ', subtext: 'Kiên nhẫn từng ngày để đạt được quả ngọt' },
      { icon: '🪷', label: 'Sen Đá Trổ Hoa Thanh Khiết!', subtext: 'Bạn đã kiên cường vượt qua thử thách này rồi!' },
    ],
  },
  {
    id: 'magic_bean',
    name: 'Cây Đậu Thần Ước Mơ',
    icon: '🫘',
    description: 'Khát vọng vươn cao, vượt qua mọi giới hạn của bản thân',
    finalColor: 'from-sky-200 to-indigo-200 text-indigo-900',
    stages: [
      { icon: '🫘', label: 'Hạt đậu thần kỳ', subtext: 'Gieo vào lòng đất niềm tin vào tương lai' },
      { icon: '🌱', label: 'Thân leo nhún nhảy', subtext: 'Năng lượng thần kỳ bắt đầu lan tỏa' },
      { icon: '🌿', label: 'Dây leo xoắn tít', subtext: 'Vươn cao, vươn xa không gì ngăn cản' },
      { icon: '🪴', label: 'Chạm tới tầng mây', subtext: 'Bầu trời rộng lớn mở ra trước mắt' },
      { icon: '🌈', label: 'Đậu Thần Chạm Đến Cầu Vồng!', subtext: 'Tương lai tươi sáng đang dang tay đón bạn!' },
    ],
  },
];

const AFFIRMATIONS = [
  'Hôm nay mình đã làm rất tốt rồi',
  'Mình cho phép bản thân được nghỉ ngơi một chút',
  'Điểm số không định nghĩa toàn bộ giá trị của mình',
  'Mọi chuyện rồi sẽ tìm thấy hướng giải quyết ổn thỏa',
  'Mình xứng đáng có được sự bình yên và yêu thương',
  'Thất bại chỉ là một bước đệm để mình kiên cường hơn',
  'Hít thở sâu, một ngày mới đầy hy vọng đang đợi mình',
  'Mình được quyền dừng lại uống một ngụm nước và thở đều',
];

export const ZenPlantGame: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [selectedSeed, setSelectedSeed] = useState<SeedVariety>(SEED_VARIETIES[0]);
  const [stage, setStage] = useState<number>(1); // 1 to 5
  const [waterCount, setWaterCount] = useState<number>(0);
  const [selectedAffirmation, setSelectedAffirmation] = useState<string>(AFFIRMATIONS[0]);
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [bloomedFlowers, setBloomedFlowers] = useState<number>(0);

  const currentStageInfo = selectedSeed.stages[stage - 1] || selectedSeed.stages[0];

  const handleWater = () => {
    if (isWatering) return;
    setIsWatering(true);
    soundManager.playWaterDrop();

    setTimeout(() => {
      const nextCount = waterCount + 1;
      setWaterCount(nextCount);

      if (stage < 5) {
        const nextStage = stage + 1;
        setStage(nextStage);
        if (nextStage === 5) {
          soundManager.playComfortChime();
          setBloomedFlowers((c) => c + 1);
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#86efac', '#fbcfe8', '#fde047', '#93c5fd', '#c084fc'],
          });
        }
      }

      // Pick next random affirmation
      const remaining = AFFIRMATIONS.filter((a) => a !== selectedAffirmation);
      setSelectedAffirmation(remaining[Math.floor(Math.random() * remaining.length)]);
      setIsWatering(false);
    }, 550);
  };

  const handleReplant = () => {
    setStage(1);
    setWaterCount(0);
    soundManager.playClick();
  };

  const handleChangeSeed = (seed: SeedVariety) => {
    soundManager.playClick();
    setSelectedSeed(seed);
    setStage(1);
    setWaterCount(0);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 md:p-7 border border-emerald-100 shadow-sm max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSeed.icon}</span>
            <h3 className="text-xl font-bold font-display text-stone-800">
              Chăm Sóc Mầm Cây Hy Vọng
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Mỗi giọt nước mang một lời khẳng định tích cực để nuôi dưỡng tâm hồn bạn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Đã nở: {bloomedFlowers} cây</span>
          </div>
        </div>
      </div>

      {/* Seed Variety Selector */}
      <div className="mb-4">
        <label className="text-xs font-bold text-stone-600 block mb-1.5">
          Chọn loại hạt giống bạn muốn gieo trồng:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SEED_VARIETIES.map((seed) => {
            const isChosen = selectedSeed.id === seed.id;
            return (
              <button
                key={seed.id}
                onClick={() => handleChangeSeed(seed)}
                className={`py-2 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  isChosen
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 shadow-xs scale-102'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <span className="text-xl">{seed.icon}</span>
                <span className="text-[11px] font-bold truncate max-w-full text-stone-800">
                  {seed.name.split(' ')[0]} {seed.name.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Visual Display with Full Botanical Illustrations */}
      <div className="relative min-h-[310px] bg-gradient-to-b from-amber-50/50 via-emerald-50/40 to-emerald-100/50 rounded-3xl border border-emerald-200/60 p-5 flex flex-col items-center justify-center overflow-hidden shadow-inner">
        {/* Subtle decorative background sun & clouds */}
        <div className="absolute top-4 right-8 w-14 h-14 bg-amber-200/60 rounded-full blur-xs animate-pulse" />
        <div className="absolute top-6 left-8 text-2xl opacity-40 select-none">☁️</div>
        <div className="absolute top-10 right-24 text-xl opacity-30 select-none">☁️</div>

        {/* Botanical Plant Illustration */}
        <div className="relative flex flex-col items-center justify-center mb-1 select-none">
          <PlantIllustration
            seedId={selectedSeed.id}
            stage={stage}
            isWatering={isWatering}
          />

          <div className="flex flex-col items-center -mt-2">
            <span
              className={`text-xs font-bold px-3.5 py-1 rounded-full shadow-xs transition-all ${
                stage === 5
                  ? `bg-gradient-to-r ${selectedSeed.finalColor} animate-pulse`
                  : 'bg-white/90 text-emerald-800 border border-emerald-200'
              }`}
            >
              {currentStageInfo.label}
            </span>
            <span className="text-[11px] text-stone-600 mt-1 font-medium text-center max-w-xs">
              {currentStageInfo.subtext}
            </span>
          </div>
        </div>

        {/* Current Stage Progress Indicator with Step Nodes */}
        <div className="w-full max-w-sm mt-3 pt-2 border-t border-emerald-200/40">
          <div className="flex justify-between text-[11px] text-stone-500 font-semibold mb-1.5">
            <span>{selectedSeed.name}</span>
            <span className="text-emerald-700 font-bold">Giai đoạn {stage}/5</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= stage ? 'bg-emerald-500' : 'bg-stone-200/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Watering Action & Affirmation */}
      <div className="mt-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-800 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lời khẳng định dịu dàng:</span>
          </div>
          <p className="text-xs md:text-sm font-handwriting text-stone-800 tracking-wide">
            &ldquo;{selectedAffirmation}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stage < 5 ? (
            <button
              onClick={handleWater}
              disabled={isWatering}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>{isWatering ? 'Đang tưới mát...' : 'Tưới nước (+1 tình thương)'}</span>
            </button>
          ) : (
            <button
              onClick={handleReplant}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Trồng cây mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-1">
        <button
          onClick={handleReplant}
          className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Gieo mầm lại</span>
        </button>

        {onComplete && stage === 5 && (
          <button
            onClick={onComplete}
            className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tâm hồn đã được tưới mát</span>
          </button>
        )}
      </div>
    </div>
  );
};
