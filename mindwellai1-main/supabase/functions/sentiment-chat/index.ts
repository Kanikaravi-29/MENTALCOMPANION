import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

console.log('OpenAI API Key available:', !!openAIApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'excited';
  confidence: number;
  emotions: string[];
}

const generateSentimentResponse = (message: string, analysis: SentimentAnalysis): string => {
  const responses = {
    positive: [
      "I'm so glad to hear that positive energy in your message! It sounds like things are going well for you. Tell me more about what's bringing you joy.",
      "Your enthusiasm really comes through! It's wonderful to connect with someone who's feeling good. What's been the highlight of your day?",
      "I can sense the positivity in your words! It's great to see you in such good spirits. Would you like to share what's been going right?"
    ],
    negative: [
      "I hear that you're going through a tough time, and I want you to know that your feelings are completely valid. Would you like to talk about what's been weighing on your mind?",
      "It sounds like things have been challenging for you lately. I'm here to listen without judgment. What's been the most difficult part?",
      "I can sense you're struggling right now, and that takes courage to share. You don't have to go through this alone. What would feel most helpful to talk about?"
    ],
    anxious: [
      "I can hear some anxiety in your message, and that must feel overwhelming. Anxiety can be really difficult to manage. What thoughts have been cycling through your mind?",
      "It sounds like you might be feeling anxious or worried about something. Those feelings are completely understandable. Would it help to talk through what's causing you concern?",
      "I notice some tension in your words that suggests you might be feeling anxious. Sometimes talking through our worries can help lighten the load. What's been on your mind?"
    ],
    sad: [
      "I can feel the sadness in your message, and I want you to know that it's okay to feel this way. Sadness is a natural response to difficult experiences. What's been bringing you down?",
      "Your words carry a weight of sadness, and I'm honored that you're sharing these feelings with me. You don't have to carry this alone. What would you like to talk about?",
      "I sense you're going through a difficult emotional time. Sadness can feel so heavy sometimes. Would it help to share what's been causing you pain?"
    ],
    angry: [
      "I can sense some frustration or anger in your message. Those are completely valid emotions, and it's important to express them. What's been making you feel this way?",
      "It sounds like something has really upset you, and that anger is understandable. Sometimes we need to let those feelings out. What's been bothering you?",
      "I hear the intensity in your words, and it seems like you're dealing with some strong emotions right now. What's been causing you to feel so frustrated?"
    ],
    excited: [
      "Your excitement is contagious! I love hearing when someone is feeling energized and positive. What's got you so pumped up?",
      "I can feel the enthusiasm radiating from your message! It's wonderful to connect with someone who's feeling so alive. What's been sparking this excitement?",
      "Your energy is amazing! There's nothing quite like that feeling of excitement. Tell me more about what's got you feeling so great!"
    ],
    neutral: [
      "Thank you for sharing with me. I'm here to listen and support you however I can. What's been on your mind lately?",
      "I appreciate you reaching out. Sometimes it's good to just have someone to talk to. What would you like to explore today?",
      "I'm glad you're here. Is there anything particular you'd like to talk about, or would you prefer to see where our conversation takes us?"
    ]
  };

  const sentimentResponses = responses[analysis.sentiment] || responses.neutral;
  return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing message:', message);

    // Analyze sentiment using OpenAI
    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Analyze the sentiment of this message and respond with ONLY a JSON object: "${message}". 

Use this exact format:
{"sentiment": "positive", "confidence": 0.85, "emotions": ["happy"]}

Sentiment options: positive, negative, neutral, anxious, sad, angry, excited`
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      }),
    });

    console.log('OpenAI response status:', sentimentResponse.status);

    if (!sentimentResponse.ok) {
      const errorText = await sentimentResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${sentimentResponse.status} - ${errorText}`);
    }

    const sentimentData = await sentimentResponse.json();
    console.log('OpenAI response data:', JSON.stringify(sentimentData));
    
    const sentimentText = sentimentData.choices[0].message.content.trim();
    
    console.log('Sentiment analysis result:', sentimentText);

    let analysis: SentimentAnalysis;
    try {
      analysis = JSON.parse(sentimentText);
    } catch (parseError) {
      console.error('Failed to parse sentiment analysis:', parseError);
      // Fallback analysis
      analysis = {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: ['unclear']
      };
    }

    // Generate appropriate response based on sentiment
    const response = generateSentimentResponse(message, analysis);

    console.log('Generated response:', response);

    return new Response(JSON.stringify({
      response,
      analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sentiment-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm here to listen and support you. What's on your mind today?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});