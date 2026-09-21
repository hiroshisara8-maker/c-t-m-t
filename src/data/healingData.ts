import { MoodConfig, CategoryConfig, MiniGameMeta, HealingActivity, MoodComfortData, MoodType } from '../types';

export const MOODS: MoodConfig[] = [
  {
    id: 'sad',
    label: 'Buồn bã',
    emoji: '🥺',
    color: 'text-sky-600',
    bgPastel: 'bg-sky-50 hover:bg-sky-100',
    borderPastel: 'border-sky-200',
    description: 'Trái tim trĩu nặng, cảm thấy tủi thân hoặc muốn khóc',
  },
  {
    id: 'stressed',
    label: 'Áp lực',
    emoji: '🤯',
    color: 'text-amber-600',
    bgPastel: 'bg-amber-50 hover:bg-amber-100',
    borderPastel: 'border-amber-200',
    description: 'Bài vở, deadline ngập đầu, kỳ vọng nặng như đá',
  },
  {
    id: 'angry',
    label: 'Tức giận',
    emoji: '😤',
    color: 'text-rose-600',
    bgPastel: 'bg-rose-50 hover:bg-rose-100',
    borderPastel: 'border-rose-200',
    description: 'Bực bội, uất ức, muốn xả hết những bức xúc này',
  },
  {
    id: 'exhausted',
    label: 'Kiệt sức',
    emoji: '🥱',
    color: 'text-violet-600',
    bgPastel: 'bg-violet-50 hover:bg-violet-100',
    borderPastel: 'border-violet-200',
    description: 'Không còn chút năng lượng, chỉ muốn nằm yên một chỗ',
  },
  {
    id: 'anxious',
    label: 'Lo âu',
    emoji: '😰',
    color: 'text-teal-600',
    bgPastel: 'bg-teal-50 hover:bg-teal-100',
    borderPastel: 'border-teal-200',
    description: 'Bồn chồn, lo nghĩ về ngày mai, tim đập nhanh',
  },
  {
    id: 'lonely',
    label: 'Cô đơn',
    emoji: '🌧️',
    color: 'text-indigo-600',
    bgPastel: 'bg-indigo-50 hover:bg-indigo-100',
    borderPastel: 'border-indigo-200',
    description: 'Cảm giác không ai hiểu mình, lạc lõng giữa đám đông',
  },
];

// LỜI AN ỦI PHÙ HỢP VỚI TỪNG CẢM XÚC Ở CHỖ XẢ LÒNG
export const MOOD_COMFORT_MAP: Record<MoodType, MoodComfortData> = {
  sad: {
    moodId: 'sad',
    gentleTitle: 'Gửi bạn một cái ôm dịu dàng nhất lúc này 🥺',
    whispers: [
      'Nếu hôm nay bạn muốn khóc, cứ để những giọt nước mắt rơi nhé. Khóc không phải là yếu đuối, mà là cách trái tim tự dọn dẹp và xoa dịu những vết thương.',
      'Bạn đã chịu đựng nhiều tủi thân một mình rồi. Ở góc nhỏ này, bạn không cần phải cố gồng mình tỏ ra mạnh mẽ nữa, hãy cứ trải lòng thật lòng.',
      'Nỗi buồn cũng giống như một cơn mưa rào qua phố, dẫu tầm tã đến đâu rồi bầu trời cũng sẽ hửng nắng và trong veo trở lại thôi bạn nhé.',
      'Đừng tự trách bản thân vì những điều chưa như ý. Bạn đã làm rất tốt với những gì mình có rồi.'
    ],
    comfortQuotes: [
      'Trái tim bạn đã rất kiên cường rồi, hãy dịu dàng với chính mình nhé.',
      'Sau cơn mưa rào, đất trời sẽ xanh tươi và cầu vồng sẽ rạng rỡ xuất hiện.',
      'Bạn xứng đáng được yêu thương vô điều kiện, kể cả vào những ngày bạn thấy mình yếu đuối nhất.'
    ],
    healingAffirmation: 'Mình cho phép bản thân được buồn, và mình tin ngày mai sẽ nhẹ nhàng hơn.',
    suggestedTip: 'Uống một ngụm nước ấm nhỏ hoặc quấn chiếc chăn mềm êm ái.'
  },
  stressed: {
    moodId: 'stressed',
    gentleTitle: 'Hạ tảng đá nặng trĩu trên vai xuống nào 🤯',
    whispers: [
      'Điểm số, thứ hạng hay một bài kiểm tra không bao giờ định nghĩa được toàn bộ giá trị tuyệt vời và tiềm năng của bạn.',
      'Bạn không cần phải chạy đua với tốc độ của bất kỳ ai cả. Mỗi bông hoa đều có mùa nở rộ và hương sắc của riêng mình.',
      'Hôm nay bạn đã cố gắng hết sức có thể rồi. Hãy thở một hơi thật dài, thả lỏng bờ vai và cho phép bản thân được tạm buông bút nghỉ ngơi.',
      'Nếu mọi thứ đang quá tải, hãy chia nhỏ từng việc ra và làm từng chút một. Không ai phải gánh cả thế giới trong một ngày cả.'
    ],
    comfortQuotes: [
      'Một bông hoa không nở vội vàng, và bạn cũng có hành trình rực rỡ của riêng mình.',
      'Hôm nay làm được đến đâu thì tự hào đến đó, ngày mai chúng mình bước tiếp nhé.',
      'Thành công không phải là không bao giờ mệt, mà là biết dừng lại đúng lúc để hồi sức.'
    ],
    healingAffirmation: 'Mình đang làm rất tốt rồi, mình không cần phải hoàn hảo trong mắt mọi người.',
    suggestedTip: 'Rời bàn học 3 phút, vươn vai và nhìn ra khoảng trời xanh phía xa.'
  },
  angry: {
    moodId: 'angry',
    gentleTitle: 'Bạn có quyền được bực bội, cứ xả hết ra đây nhé 😤',
    whispers: [
      'Cảm xúc tức giận và uất ức là hoàn toàn bình thường khi bạn gặp phải điều bất công hay tổn thương. Việc bạn xả ra đây là điều vô cùng đúng đắn.',
      'Cơn giận là một ngọn lửa, đừng nuốt nó vào trong để làm bỏng rát chính tâm can mình. Hãy để những trang giấy này gánh đỡ bớt cho bạn.',
      'Đừng để sự vô tâm, bất công hay lời nói ác ý của người khác làm vẩn đục sự bình yên vốn có trong tâm hồn bạn.',
      'Sau khi viết ra hết những phẫn uất, bạn có thể tự tay xé vụn hoặc đốt cháy tờ giấy này để trả lại sự tự do cho tâm trí.'
    ],
    comfortQuotes: [
      'Bình yên không phải là không có giông bão, mà là tâm mình vững vàng giữa bão giông.',
      'Bạn không thể kiểm soát hành vi của người khác, nhưng bạn làm chủ sự thanh thản của chính mình.',
      'Hãy hít một hơi thật sâu, thở ra thật mạnh để tống khứ mọi bực dọc ra khỏi cơ thể.'
    ],
    healingAffirmation: 'Mình giải phóng hết cơn giận này, trả lại sự trong trẻo và thanh thản cho tâm trí.',
    suggestedTip: 'Thử bóp nát bong bóng xả giận hoặc xé vụn tờ giấy sột soạt để hạ hỏa.'
  },
  exhausted: {
    moodId: 'exhausted',
    gentleTitle: 'Bạn mệt rồi, đã đến lúc được sạc lại năng lượng 🥱',
    whispers: [
      'Bạn đã gồng gánh và chạy suốt một chặng đường dài rồi. Đã đến lúc buông chiếc ba lô nặng trĩu xuống và nằm yên nghỉ ngơi thật sâu.',
      'Nghỉ ngơi không phải là từ bỏ hay lười biếng. Nghỉ ngơi là một hành động dũng cảm để cơ thể và tâm trí bạn được tái sinh.',
      'Thế giới ngoài kia sẽ không sụp đổ chỉ vì bạn dừng lại một tối đâu. Bản thân bạn mới là điều quan trọng và quý giá nhất lúc này.',
      'Tạm gác lại những toan tính cho ngày mai, đêm nay hãy dành tặng cho mình một giấc ngủ êm đềm và ngon giấc.'
    ],
    comfortQuotes: [
      'Khi pin điện thoại cạn bạn cắm sạc, vậy khi tâm hồn kiệt sức, hãy cho phép mình được nghỉ ngơi.',
      'Nghỉ ngơi cũng là một phần dũng cảm của hành trình tiến lên.',
      'Chỉ cần bạn nằm yên và thở đều, cơ thể bạn đã đang tự chữa lành từng tế bào rồi.'
    ],
    healingAffirmation: 'Mình xứng đáng được nghỉ ngơi trọn vẹn mà không cần cảm thấy tội lỗi.',
    suggestedTip: 'Đắp chăn ấm, nhắm mắt lại và để đầu óc hoàn toàn rỗng rang không nghĩ suy.'
  },
  anxious: {
    moodId: 'anxious',
    gentleTitle: 'Bạn đang an toàn ở đây, ngay khoảnh khắc này 😰',
    whispers: [
      'Kéo sự chú ý về hiện tại ngay nơi bạn đang ngồi nào. Những viễn cảnh tồi tệ mà tâm trí lo âu tự vẽ ra phần lớn đều sẽ không xảy ra.',
      'Mọi thử thách dù to lớn đến đâu đều có thể chia nhỏ ra để giải quyết từng bước một. Bạn không cần giải quyết cả tương lai trong tối nay.',
      'Đặt bàn tay lên ngực và cảm nhận nhịp đập êm dịu. Bạn đã kiên cường vượt qua 100% những ngày khó khăn trước đây, và lần này bạn cũng sẽ ổn thôi.',
      'Hít vào thật chậm trong 4 giây, giữ lại 7 giây và thở ra từ từ trong 8 giây... Bạn đang từng bước làm chủ lại chính mình.'
    ],
    comfortQuotes: [
      'Lo lắng không làm cho ngày mai bớt tồi tệ, nó chỉ đánh cắp đi sự an yên của ngày hôm nay.',
      'Từng bước nhỏ một, bạn vẫn đang đi đúng hướng của riêng mình.',
      'Hít vào bình an và sức mạnh, thở ra mọi muộn phiền và âu lo.'
    ],
    healingAffirmation: 'Mình đang an toàn, và mọi chuyện rồi sẽ được sắp xếp ổn thỏa theo cách tốt đẹp nhất.',
    suggestedTip: 'Chạm vào 3 vật xung quanh bạn để kéo tâm trí quay về với thực tại an toàn.'
  },
  lonely: {
    moodId: 'lonely',
    gentleTitle: 'Ở góc nhỏ này, bạn không bao giờ phải cô độc một mình 🌧️',
    whispers: [
      'Dù thế giới ngoài kia có ồn ào và xa lạ đến đâu, cuốn sổ này luôn mở rộng vòng tay để lắng nghe bạn vô điều kiện.',
      'Cảm giác lạc lõng thật sự rất nhói lòng, nhưng hãy tin rằng luôn có sự ấm áp và những người chân thành đang chờ đón bạn ở phía trước.',
      'Bạn là một cá thể độc nhất vô nhị, đáng yêu và đáng trân trọng. Gửi đến bạn một cái ôm thật ấm áp từ xa qua màn hình này nhé!',
      'Khi cảm thấy không ai hiểu mình, hãy tự trở thành người bạn tốt nhất và dịu dàng nhất của chính bản thân mình trước tiên.'
    ],
    comfortQuotes: [
      'Sau cơn mưa rào, trời sẽ lại sáng trong và cầu vồng sẽ rạng rỡ xuất hiện.',
      'Có những ngôi sao sáng nhất trong đêm tối tĩnh mịch, và bạn chính là một vì sao lấp lánh như thế.',
      'Bạn không đơn độc, luôn có những điều kỳ diệu và dịu dàng đang chờ bạn chạm tới.'
    ],
    healingAffirmation: 'Mình yêu thương chính mình và mình luôn tìm thấy nơi trú ngụ bình yên trong tâm hồn.',
    suggestedTip: 'Ôm một chiếc gối ôm thật chặt hoặc trò chuyện với chú mèo mochi mềm mại.'
  },
};

export const CATEGORIES: CategoryConfig[] = [
  { id: 'study', label: 'Học tập & Điểm số', iconName: 'GraduationCap' },
  { id: 'family', label: 'Gia đình & Kỳ vọng', iconName: 'Home' },
  { id: 'friendship', label: 'Bạn bè & Tình cảm', iconName: 'HeartHandshake' },
  { id: 'peer', label: 'Áp lực đồng trang lứa', iconName: 'Users' },
  { id: 'future', label: 'Tương lai & Định hướng', iconName: 'Compass' },
  { id: 'general', label: 'Nặng lòng không rõ lý do', iconName: 'CloudRain' },
];

export const MINI_GAMES: MiniGameMeta[] = [
  {
    id: 'bubble_pop',
    title: 'Nổ Bong Bóng Xả Stress',
    shortDesc: 'Viết tên áp lực lên bóng và bóp nổ tanh bành đã tai',
    category: 'action',
    icon: '🫧',
    tagColor: 'bg-pink-100 text-pink-700',
    duration: '1-3 phút',
  },
  {
    id: 'squishy',
    title: 'Bóp Squishy Mochi Đàn Hồi',
    shortDesc: 'Nắn bóp bánh bao, quả đào, mèo mochi núng nính cực đã tay',
    category: 'action',
    icon: '🍡',
    tagColor: 'bg-rose-100 text-rose-700',
    duration: 'Không giới hạn',
  },
  {
    id: 'shred_paper',
    title: 'Xé Giấy & Vò Nát Áp Lực',
    shortDesc: 'Viết điều bực mình rồi xé vụn hoặc đốt thành tro',
    category: 'action',
    icon: '📄',
    tagColor: 'bg-rose-100 text-rose-700',
    duration: '1 phút',
  },
  {
    id: 'zen_plant',
    title: 'Chăm Sóc Mầm Cây Hy Vọng',
    shortDesc: 'Gieo hạt may mắn, hoa hướng dương, sen đá nở rộ',
    category: 'calm',
    icon: '🌱',
    tagColor: 'bg-emerald-100 text-emerald-700',
    duration: '2-4 phút',
  },
  {
    id: 'mindful_breathing',
    title: 'Hít Thở Êm Dịu 4-7-8',
    shortDesc: 'Vòng tròn dẫn nhịp thở giúp dịu thần kinh tức thì',
    category: 'calm',
    icon: '🌬️',
    tagColor: 'bg-cyan-100 text-cyan-700',
    duration: '1-2 phút',
  },
  {
    id: 'doodle',
    title: 'Vẽ Tự Do & Tô Màu Pastel',
    shortDesc: 'Cọ vẽ dịu êm, màu kẹo ngọt giải tỏa căng thẳng',
    category: 'creative',
    icon: '🎨',
    tagColor: 'bg-amber-100 text-amber-700',
    duration: 'Không giới hạn',
  },
  {
    id: 'matching_game',
    title: 'Ghép Tranh Thư Giãn',
    shortDesc: 'Lật tìm các mảnh ghép bình yên, tập trung nhẹ nhàng',
    category: 'focus',
    icon: '🧩',
    tagColor: 'bg-purple-100 text-purple-700',
    duration: '2-3 phút',
  },
];

export const HEALING_ACTIVITIES: HealingActivity[] = [
  {
    id: 'warm_water',
    title: 'Uống chậm một ngụm nước ấm',
    desc: 'Lấy một cốc nước ấm, cảm nhận hơi ấm qua lòng bàn tay và uống từng ngụm chậm rãi.',
    timeEstimate: '2 phút',
    category: 'body',
    icon: '🍵',
    benefit: 'Đánh thức hệ phó giao cảm, hạ nhịp tim và giãn cơ mặt',
  },
  {
    id: '20_20_20',
    title: 'Nhìn xa ra khung cửa sổ xanh',
    desc: 'Tạm rời mắt khỏi màn hình điện thoại/sách vở, nhìn ngắm một tán cây xanh hoặc bầu trời phía xa.',
    timeEstimate: '3 phút',
    category: 'space',
    icon: '🌿',
    benefit: 'Thư giãn cơ mắt, mở rộng không gian tâm trí',
  },
  {
    id: 'self_hug',
    title: 'Tự ôm lấy bờ vai của mình',
    desc: 'Bắt chéo hai tay qua ngực, nhẹ nhàng vỗ vỗ vào bắp tay như vỗ về một đứa trẻ đang buồn.',
    timeEstimate: '1 phút',
    category: 'body',
    icon: '🫂',
    benefit: 'Kích thích giải phóng oxytocin - hormone của sự an toàn và yêu thương',
  },
  {
    id: 'music_lofi',
    title: 'Nghe một giai điệu Lofi không lời',
    desc: 'Bật một khúc nhạc êm dịu, nhắm mắt lại và để âm thanh dẫn dắt tâm trí thả trôi nhẹ nhàng.',
    timeEstimate: '5 phút',
    category: 'mind',
    icon: '🎧',
    benefit: 'Hạ sóng não từ trạng thái kích động Beta sang thư giãn Alpha',
  },
  {
    id: 'wash_face',
    title: 'Rửa mặt bằng làn nước mát',
    desc: 'Vỗ nhẹ vài vốc nước mát lên mặt, cảm nhận sự tươi mới và tỉnh táo trở lại.',
    timeEstimate: '2 phút',
    category: 'body',
    icon: '💧',
    benefit: 'Kích hoạt phản xạ lặn của động vật có vú, giảm stress cấp tính',
  },
  {
    id: 'gratitude_note',
    title: 'Viết ra 3 điều nhỏ xíu hôm nay',
    desc: 'Ví dụ: Sáng nay gió mát, ăn được bữa cơm ngon, hay được một bạn khen chiếc bút xinh.',
    timeEstimate: '3 phút',
    category: 'mind',
    icon: '📝',
    benefit: 'Chuyển hướng bộ lọc não bộ từ tiêu cực sang trân trọng khoảnh khắc',
  },
];

export const WRITING_PROMPTS = [
  "Điều gì vừa xảy ra khiến bạn thấy tức giận hoặc tủi thân nhất?",
  "Có áp lực nào bạn đang phải gồng gánh một mình mà chưa dám nói với ai?",
  "Nếu được hét lên một câu thật to ngay bây giờ, bạn sẽ nói điều gì?",
  "Bạn có đang tự trách bản thân vì điều gì không? Hãy kể cho cuốn sổ này nghe nào.",
  "Một kỳ vọng nào từ người khác đang làm bạn ngột ngạt?",
];
