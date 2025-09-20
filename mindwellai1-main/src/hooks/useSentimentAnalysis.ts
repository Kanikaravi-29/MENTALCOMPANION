import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'excited';
  confidence: number;
  emotions: string[];
}

interface SentimentResponse {
  response: string;
  analysis: SentimentAnalysis;
  timestamp: string;
}

// Enhanced sentiment-based response generator
const generateEnhancedResponse = (message: string, analysis: SentimentAnalysis): string => {
  const responses = {
    positive: [
      "I can feel the joy in your words! That's wonderful to hear. What's been bringing you this happiness?",
      "Your positive energy is contagious! It sounds like you're in a great place right now. Tell me more about what's going well.",
      "I love hearing such uplifting thoughts from you! What's been the highlight that's making you feel so good?",
      "Your enthusiasm really shines through! It's beautiful to connect with someone who's feeling so positive."
    ],
    negative: [
      "I can sense you're going through a difficult time, and I want you to know that your feelings are completely valid. What's been weighing on your heart?",
      "It sounds like things have been challenging lately. I'm here to listen without any judgment. What would help you feel heard right now?",
      "I hear the struggle in your words, and that takes courage to share. You don't have to carry this burden alone. What's been the hardest part?",
      "Your feelings matter, and I'm grateful you're sharing them with me. What support do you need most right now?"
    ],
    anxious: [
      "I can feel the anxiety in your message, and I understand how overwhelming that can be. What thoughts have been cycling through your mind?",
      "Anxiety can feel so intense and consuming. I'm here to help you work through these feelings. What's been causing you the most worry?",
      "I notice the tension in your words that suggests you're feeling anxious. Sometimes talking through our concerns can help lighten the load. What's been on your mind?",
      "Those anxious feelings are so valid. Let's take this one step at a time. What would feel most helpful to explore right now?"
    ],
    sad: [
      "I can feel the sadness in your words, and I want you to know it's okay to feel this way. Sadness shows how deeply you care. What's been bringing you down?",
      "Your words carry a weight of sadness, and I'm honored you're sharing these feelings with me. What would you like to talk about?",
      "I sense you're going through a difficult emotional time. Sadness can feel so heavy. Would it help to share what's been causing you pain?",
      "It's brave of you to express these sad feelings. They're completely valid. What support would feel most meaningful right now?"
    ],
    angry: [
      "I can sense the frustration and anger in your message. Those are completely valid emotions. What's been making you feel this way?",
      "It sounds like something has really upset you, and that anger is understandable. Sometimes we need to let those feelings out. What's been bothering you?",
      "I hear the intensity in your words. It seems like you're dealing with some strong emotions right now. What's been causing you to feel so frustrated?",
      "Your anger is telling us something important. What situation or experience has been pushing you to feel this way?"
    ],
    excited: [
      "Your excitement is absolutely infectious! I love feeling this energy from you. What's got you so wonderfully pumped up?",
      "I can feel the enthusiasm radiating from your message! There's something special happening for you. Tell me all about it!",
      "Your energy is amazing! There's nothing quite like that feeling of pure excitement. What's sparking this incredible feeling?",
      "I'm getting excited just reading your message! Your joy is contagious. What's been bringing you this wonderful energy?"
    ],
    neutral: [
      "Thank you for sharing with me. I'm here to listen and support you in whatever way feels right. What's been on your mind lately?",
      "I appreciate you reaching out. Sometimes it's good to just have someone to talk to. What would you like to explore together today?",
      "I'm glad you're here. Is there anything particular you'd like to talk about, or shall we see where our conversation naturally flows?",
      "I'm listening with my full attention. What feels most important for you to share right now?"
    ]
  };

  const sentimentResponses = responses[analysis.sentiment] || responses.neutral;
  return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
};

// Fallback sentiment analysis using simple keyword detection
const analyzeSentimentFallback = (message: string): SentimentAnalysis => {
  const text = message.toLowerCase();
  
  // Keywords for different sentiments
  const keywords = {
    positive: ['happy', 'joy', 'great', 'wonderful', 'amazing', 'love', 'excited', 'good', 'fantastic', 'perfect', 'awesome'],
    negative: ['bad', 'awful', 'terrible', 'horrible', 'hate', 'worst', 'disappointing', 'frustrating'],
    sad: ['sad', 'depressed', 'lonely', 'empty', 'hopeless', 'crying', 'grief', 'loss', 'hurt'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'scared', 'overwhelmed'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed', 'rage'],
    excited: ['excited', 'thrilled', 'pumped', 'ecstatic', 'enthusiastic', 'energetic']
  };

  let maxScore = 0;
  let detectedSentiment: SentimentAnalysis['sentiment'] = 'neutral';
  let emotions: string[] = [];

  // Check each sentiment category
  Object.entries(keywords).forEach(([sentiment, words]) => {
    const score = words.filter(word => text.includes(word)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedSentiment = sentiment as SentimentAnalysis['sentiment'];
      emotions = words.filter(word => text.includes(word));
    }
  });

  return {
    sentiment: detectedSentiment,
    confidence: maxScore > 0 ? Math.min(0.7 + (maxScore * 0.1), 0.95) : 0.5,
    emotions: emotions.length > 0 ? emotions : ['neutral']
  };
};

export const useSentimentAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentimentAndRespond = useCallback(async (message: string): Promise<SentimentResponse> => {
    setIsAnalyzing(true);
    
    try {
      // First try the Supabase edge function with OpenAI
      const { data, error } = await supabase.functions.invoke('sentiment-chat', {
        body: { message }
      });

      if (!error && data) {
        return data;
      }

      console.log('Falling back to local sentiment analysis due to:', error);
      
      // Fallback to local analysis
      const analysis = analyzeSentimentFallback(message);
      const response = generateEnhancedResponse(message, analysis);
      
      return {
        response,
        analysis,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      
      // Final fallback
      const analysis = analyzeSentimentFallback(message);
      const response = generateEnhancedResponse(message, analysis);
      
      return {
        response,
        analysis,
        timestamp: new Date().toISOString()
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeSentimentAndRespond,
    isAnalyzing
  };
};