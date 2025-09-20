import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JournalAnalysis {
  sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'excited';
    confidence: number;
    emotions: string[];
  };
  insights: string;
  themes: string[];
  recommendations: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();

    if (!content) {
      throw new Error('Journal content is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing journal entry:', title || 'Untitled');

    // Analyze journal entry using OpenAI
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a mental health analysis AI. Analyze journal entries and provide:
1. Sentiment analysis (positive, negative, neutral, anxious, sad, angry, excited)
2. Key emotional themes
3. Personalized insights
4. Gentle recommendations

Respond with ONLY a JSON object in this format:
{
  "sentiment": {
    "sentiment": "positive",
    "confidence": 0.85,
    "emotions": ["happy", "grateful"]
  },
  "insights": "Your entry shows...",
  "themes": ["gratitude", "achievement"],
  "recommendations": ["Continue practicing gratitude", "Celebrate small wins"]
}`
          },
          {
            role: 'user',
            content: `Analyze this journal entry:\n\nTitle: ${title || 'Untitled'}\n\nContent: ${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    console.log('OpenAI response status:', analysisResponse.status);

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${analysisResponse.status} - ${errorText}`);
    }

    const analysisData = await analysisResponse.json();
    console.log('OpenAI response data:', JSON.stringify(analysisData));
    
    const analysisText = analysisData.choices[0].message.content.trim();
    
    console.log('Journal analysis result:', analysisText);

    let analysis: JournalAnalysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse journal analysis:', parseError);
      // Fallback analysis
      analysis = {
        sentiment: {
          sentiment: 'neutral',
          confidence: 0.5,
          emotions: ['reflective']
        },
        insights: "Thank you for sharing your thoughts. Journaling is a valuable tool for self-reflection and emotional awareness.",
        themes: ['self-reflection'],
        recommendations: ['Continue regular journaling', 'Take time for self-care']
      };
    }

    return new Response(JSON.stringify({
      analysis,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in journal-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: {
        sentiment: {
          sentiment: 'neutral',
          confidence: 0.5,
          emotions: ['reflective']
        },
        insights: "Thank you for sharing your thoughts. Journaling is a valuable practice for mental wellness.",
        themes: ['self-reflection'],
        recommendations: ['Continue journaling regularly', 'Practice mindfulness']
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});