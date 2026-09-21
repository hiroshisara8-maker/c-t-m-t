export type MoodType = 
  | 'sad'        // Buồn bã
  | 'stressed'   // Áp lực, căng thẳng
  | 'angry'      // Tức giận, uất ức
  | 'exhausted'  // Kiệt sức, mệt mỏi
  | 'anxious'    // Lo âu, bồn chồn
  | 'lonely';    // Cô đơn, lạc lõng

export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgPastel: string;
  borderPastel: string;
  description: string;
}

export interface MoodComfortData {
  moodId: MoodType;
  gentleTitle: string;
  whispers: string[];
  comfortQuotes: string[];
  healingAffirmation: string;
  suggestedTip: string;
}

export type CategoryType =
  | 'study'      // Học tập & Thi cử
  | 'family'     // Gia đình & Kỳ vọng
  | 'friendship' // Bạn bè & Tình cảm
  | 'future'     // Tương lai & Hướng nghiệp
  | 'peer'       // Áp lực đồng trang lứa
  | 'general';   // Khó chịu không rõ lý do

export interface CategoryConfig {
  id: CategoryType;
  label: string;
  iconName: string;
}

export type MiniGameId = 
  | 'bubble_pop'
  | 'squishy'
  | 'zen_plant'
  | 'doodle'
  | 'mindful_breathing'
  | 'shred_paper'
  | 'matching_game';

export interface MiniGameMeta {
  id: MiniGameId;
  title: string;
  shortDesc: string;
  category: 'action' | 'calm' | 'creative' | 'focus';
  icon: string;
  tagColor: string;
  duration: string;
}

export interface ComfortAdvice {
  comfortMessage: string;
  healingQuote: string;
  recommendedGames: MiniGameId[];
  reasonForGames: string;
  realLifeTips: string[];
}

export interface DiaryEntry {
  id: string;
  createdAt: string; // ISO date string
  dateDisplay: string;
  timeDisplay: string;
  mood: MoodType;
  category: CategoryType;
  title?: string;
  content: string;
  comfortAdvice?: ComfortAdvice;
  playedGames?: MiniGameId[];
  afterMood?: 'better' | 'calmer' | 'lighter' | 'same';
}

export interface HealingActivity {
  id: string;
  title: string;
  desc: string;
  timeEstimate: string;
  category: 'body' | 'mind' | 'space' | 'creativity';
  icon: string;
  benefit: string;
}
