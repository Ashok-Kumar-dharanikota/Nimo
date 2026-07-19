export const analyzeSentiment = (text: string): string => {
  const lower = text.toLowerCase();
  
  // Basic keyword mapping for AI sentiment simulation
  const sadWords = ['sad', 'bad', 'hard', 'difficult', 'rain', 'cry', 'anxious', 'stress', 'tired', 'exhausted'];
  const happyWords = ['happy', 'great', 'good', 'joy', 'excited', 'love', 'sun', 'bright', 'energy'];
  const calmWords = ['calm', 'peace', 'relax', 'quiet', 'chill', 'breathe', 'still'];

  let sadScore = 0;
  let happyScore = 0;
  let calmScore = 0;

  sadWords.forEach(word => { if (lower.includes(word)) sadScore++; });
  happyWords.forEach(word => { if (lower.includes(word)) happyScore++; });
  calmWords.forEach(word => { if (lower.includes(word)) calmScore++; });

  if (sadScore > happyScore && sadScore > calmScore) return '🍄'; // Sad/Hard
  if (happyScore > sadScore && happyScore > calmScore) return '🌻'; // Happy/Energetic
  if (calmScore > sadScore && calmScore > happyScore) return '🪷'; // Calm/Peaceful

  return '🌱'; // Neutral/Default
};
