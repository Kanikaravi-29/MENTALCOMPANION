import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Heart, MessageCircle, Brain, Sparkles } from "lucide-react";
import { useSentimentAnalysis } from "@/hooks/useSentimentAnalysis";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sentiment?: {
    sentiment: string;
    confidence: number;
    emotions: string[];
  };
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your MindWell AI companion. I'm here to listen and support you with sentiment-aware responses. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const { analyzeSentimentAndRespond, isAnalyzing } = useSentimentAnalysis();
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Use enhanced sentiment analysis with fallback
      const sentimentResponse = await analyzeSentimentAndRespond(currentInput);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: sentimentResponse.response,
        isUser: false,
        timestamp: new Date(),
        sentiment: sentimentResponse.analysis
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Final fallback response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to listen and support you. What's on your mind today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="chat" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Experience
            <span className="bg-gradient-hero bg-clip-text text-transparent"> AI Therapy</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Try our AI companion below. Your conversations are secure and confidential.
          </p>
        </div>

        <Card className="shadow-large border-border/50 bg-gradient-card">
          <CardHeader className="border-b border-border/50 bg-card">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span>MindWell AI Companion</span>
              <div className="flex items-center space-x-1 text-sm text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                <span>Online</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-hero text-white'
                  }`}>
                    {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Enhanced sentiment indicator for AI responses */}
                    {!message.isUser && message.sentiment && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-muted-foreground">
                            {message.sentiment.sentiment} ({Math.round(message.sentiment.confidence * 100)}%)
                          </span>
                        </div>
                        {message.sentiment.emotions.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Brain className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-muted-foreground">
                              {message.sentiment.emotions.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className={`text-xs mt-1 block ${
                      message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 p-6 bg-card">
              <div className="flex space-x-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1 bg-background border-border"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping || isAnalyzing}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-6"
                >
                  {isAnalyzing ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Enhanced Sentiment AI</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="h-3 w-3" />
                    <span>Emotion Detection</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>24/7 Available</span>
                  </div>
                </div>
                <span>Press Enter to send</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            This is a demo interface. In production, all conversations are encrypted and HIPAA compliant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;