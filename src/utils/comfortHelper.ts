import { ComfortAdvice, MiniGameId, MoodType } from '../types';
import { MOOD_COMFORT_MAP } from '../data/healingData';

export function generateClientComfortAdvice(
  text: string,
  mood: MoodType = 'stressed',
  categoryLabel: string = 'Học tập & Thi cử'
): ComfortAdvice {
  const lower = (text + ' ' + mood + ' ' + categoryLabel).toLowerCase();
  const moodData = MOOD_COMFORT_MAP[mood] || MOOD_COMFORT_MAP.stressed;

  let comfortMessage = `Mình đã đọc trọn vẹn những dòng tâm sự bạn vừa viết ra rồi. Cảm ơn bạn vì đã dũng cảm trút bỏ gánh nặng này vào cuốn sổ. Bạn đã rất cố gắng trong suốt thời gian qua rồi, đừng quá khắt khe với bản thân nữa nhé. Dù thế nào đi nữa, giá trị của bạn luôn được trân trọng.`;
  let healingQuote = moodData.comfortQuotes[Math.floor(Math.random() * moodData.comfortQuotes.length)] ||
    'Một bông hoa không nở vội vàng, và bạn cũng có thời gian rực rỡ của riêng mình.';
  let recommendedGames: MiniGameId[] = ['squishy', 'zen_plant'];
  let reasonForGames = 'Giúp bạn nắn bóp thư giãn cơ tay, nuôi dưỡng niềm hy vọng và chuyển hướng tâm trí khỏi âu lo.';
  let realLifeTips = [
    'Uống chậm từng ngụm nước ấm để làm dịu thần kinh',
    'Thả lỏng hai vai, hít một hơi thật sâu rồi thở dài ra',
  ];

  if (
    lower.includes('thi') ||
    lower.includes('điểm') ||
    lower.includes('học') ||
    lower.includes('deadline') ||
    lower.includes('bài tập') ||
    lower.includes('trường') ||
    lower.includes('áp lực') ||
    mood === 'stressed'
  ) {
    comfortMessage = `Học tập và thi cử đôi lúc thật sự nặng nề như một tảng đá đè lên ngực. Nhưng hãy nhớ rằng: điểm số hay một bài kiểm tra không bao giờ định nghĩa được toàn bộ giá trị tuyệt vời của con người bạn. Hôm nay bạn mệt rồi, hãy cho phép mình được nghỉ ngơi một chút trước khi bước tiếp nhé!`;
    healingQuote = 'Thành công không phải là không bao giờ mệt, mà là biết dừng lại đúng lúc để hồi sức.';
    recommendedGames = ['squishy', 'zen_plant', 'mindful_breathing'];
    reasonForGames = 'Bóp squishy mochi giải tỏa căng cơ kết hợp nhịp thở 4-7-8 giúp nhịp tim đập êm ái trở lại.';
    realLifeTips = [
      'Rời khỏi bàn học 3 phút, nhìn ra khoảng trời xanh phía xa',
      'Rửa mặt nhẹ nhàng bằng làn nước mát để lấy lại sự tỉnh táo',
    ];
  } else if (
    lower.includes('giận') ||
    lower.includes('tức') ||
    lower.includes('ức') ||
    lower.includes('bực') ||
    lower.includes('ghét') ||
    lower.includes('cãi') ||
    mood === 'angry'
  ) {
    comfortMessage = `Cảm xúc tức giận và uất ức là hoàn toàn tự nhiên khi bạn gặp phải điều bất công hay tổn thương. Bạn có quyền được bực bội, và việc bạn viết ra đây thay vì giữ trong lòng là một điều vô cùng đúng đắn. Hãy để những bực dọc này tan biến dần cùng những cú chạm nhé.`;
    healingQuote = 'Giữ cơn giận cũng như nắm than hồng chờ ném người khác, người bị bỏng trước là chính mình. Hãy buông tay để tự do.';
    recommendedGames = ['shred_paper', 'bubble_pop', 'squishy'];
    reasonForGames = 'Xé vụn giấy sột soạt và bóp nổ bóng xua tan cơn giận, giúp cơ thể giải phóng hormone căng thẳng ngay tức thì.';
    realLifeTips = [
      'Nắm chặt bàn tay rồi từ từ thả lỏng, thở hắt ra thật mạnh',
      'Uống một ngụm nước lạnh để hạ hỏa tức thì',
    ];
  } else if (
    lower.includes('lo') ||
    lower.includes('sợ') ||
    lower.includes('bồn chồn') ||
    lower.includes('hoảng') ||
    lower.includes('run') ||
    mood === 'anxious'
  ) {
    comfortMessage = `Khi tâm trí rối bời và ngập tràn lo âu về những điều chưa tới, hãy kéo sự chú ý về hiện tại ngay nơi bạn đang ngồi. Bạn đang an toàn ở đây, ngay khoảnh khắc này. Mọi thử thách đều có thể chia nhỏ ra để giải quyết từng bước một.`;
    healingQuote = 'Lo lắng không làm cho ngày mai bớt tồi tệ, nó chỉ đánh cắp đi sự an yên của ngày hôm nay.';
    recommendedGames = ['mindful_breathing', 'squishy', 'matching_game'];
    reasonForGames = 'Nhịp thở 4-7-8 kích hoạt hệ thần kinh phó giao cảm làm dịu nhịp tim và giảm cảm giác bồn chồn.';
    realLifeTips = [
      'Chạm vào 3 đồ vật xung quanh bạn để kéo tâm trí về thực tại',
      'Hít vào trong 4 giây, giữ 7 giây và thở ra từ từ trong 8 giây',
    ];
  } else if (
    lower.includes('cô đơn') ||
    lower.includes('một mình') ||
    lower.includes('buồn') ||
    lower.includes('khóc') ||
    lower.includes('tủi') ||
    mood === 'sad' ||
    mood === 'lonely'
  ) {
    comfortMessage = `Nếu hôm nay bạn muốn khóc, cứ để những giọt nước mắt rơi nhé. Khóc không phải là yếu đuối, mà là trái tim đang tự dọn dẹp lại những tổn thương. Dù thế giới ngoài kia có ồn ào đến đâu, ở góc nhỏ 'Cắt đi nỗi sầu' này, mình luôn ở đây để lắng nghe bạn vô điều kiện.`;
    healingQuote = 'Sau cơn mưa rào, trời sẽ lại sáng trong và cầu vồng ấm áp sẽ xuất hiện.';
    recommendedGames = ['zen_plant', 'squishy', 'doodle'];
    reasonForGames = 'Gieo mầm hy vọng và vẽ tự do giúp bạn tìm lại sự kết nối ấm áp với chính tâm hồn mình.';
    realLifeTips = [
      'Quấn mình trong một chiếc chăn ấm hoặc ôm một chiếc gối mềm',
      'Bật một bài nhạc lofi nhẹ nhàng không lời và nhắm mắt lại 5 phút',
    ];
  } else if (
    lower.includes('mệt') ||
    lower.includes('kiệt sức') ||
    lower.includes('đuối') ||
    lower.includes('chán') ||
    mood === 'exhausted'
  ) {
    comfortMessage = `Bạn đã gồng gánh và chạy suốt một chặng đường dài rồi. Đã đến lúc buông chiếc ba lô nặng trĩu xuống và nằm yên nghỉ ngơi. Thế giới không sụp đổ chỉ vì bạn dừng lại một tối đâu, bản thân bạn mới là điều quý giá nhất lúc này.`;
    healingQuote = 'Nghỉ ngơi cũng là một phần dũng cảm của hành trình tiến lên.';
    recommendedGames = ['squishy', 'zen_plant', 'mindful_breathing'];
    reasonForGames = 'Không cần dùng đầu óc suy nghĩ phức tạp, chỉ cần nắn bóp mochi êm ái để cơ thể thả lỏng hoàn toàn.';
    realLifeTips = [
      'Ngả lưng xuống giường hoặc ghế tựa 10 phút không cầm điện thoại',
      'Đắp một chiếc khăn ấm lên mắt để làm dịu sự mỏi mệt',
    ];
  }

  return {
    comfortMessage,
    healingQuote,
    recommendedGames,
    reasonForGames,
    realLifeTips,
  };
}
