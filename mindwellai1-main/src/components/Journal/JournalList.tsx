import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, Heart, TrendingUp, Edit, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood_rating: number;
  tags: string[] | null;
  sentiment_analysis: any;
  ai_insights: string | null;
  created_at: string;
}

interface JournalListProps {
  onNewEntry: () => void;
  refreshTrigger: number;
}

const JournalList = ({ onNewEntry, refreshTrigger }: JournalListProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load your journal entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [refreshTrigger]);

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        throw error;
      }

      setEntries(entries.filter(entry => entry.id !== entryId));
      setSelectedEntry(null);
      
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete the entry.",
        variant: "destructive",
      });
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return "😢";
    if (rating <= 4) return "😔";
    if (rating <= 6) return "😐";
    if (rating <= 8) return "🙂";
    return "😊";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'anxious': return 'text-yellow-600';
      case 'sad': return 'text-blue-600';
      case 'angry': return 'text-orange-600';
      case 'excited': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="shadow-large border-border/50">
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Journal</h3>
          <p className="text-muted-foreground mb-6">
            Begin your mental wellness journey by writing your first journal entry.
          </p>
          <Button onClick={onNewEntry} className="bg-primary hover:bg-primary-dark text-primary-foreground">
            <Heart className="h-4 w-4 mr-2" />
            Write First Entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entry List */}
      {!selectedEntry && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="shadow-medium border-border/50 cursor-pointer hover:shadow-large transition-shadow"
              onClick={() => setSelectedEntry(entry)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), "PPP 'at' p")}
                      </span>
                    </div>
                    {entry.title && (
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {entry.title}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(entry.mood_rating)}</span>
                    <span className="text-sm text-muted-foreground">{entry.mood_rating}/10</span>
                  </div>
                </div>

                <p className="text-foreground mb-4 line-clamp-3">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {entry.sentiment_analysis && (
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span className={`text-xs font-medium ${getSentimentColor(entry.sentiment_analysis.sentiment)}`}>
                          {entry.sentiment_analysis.sentiment}
                        </span>
                      </div>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{entry.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {entry.ai_insights && (
                    <Brain className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Entry View */}
      {selectedEntry && (
        <Card className="shadow-large border-border/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>{selectedEntry.title || "Journal Entry"}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)}>
                  Back to List
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteEntry(selectedEntry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(selectedEntry.created_at), "PPP 'at' p")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getMoodEmoji(selectedEntry.mood_rating)}</span>
                <span>Mood: {selectedEntry.mood_rating}/10</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Content */}
            <div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </p>
            </div>

            {/* Tags */}
            {selectedEntry.tags && selectedEntry.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment Analysis */}
            {selectedEntry.sentiment_analysis && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Sentiment Analysis</span>
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${getSentimentColor(selectedEntry.sentiment_analysis.sentiment)}`}>
                      {selectedEntry.sentiment_analysis.sentiment.charAt(0).toUpperCase() + selectedEntry.sentiment_analysis.sentiment.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(selectedEntry.sentiment_analysis.confidence * 100)}% confidence
                    </span>
                  </div>
                  {selectedEntry.sentiment_analysis.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedEntry.sentiment_analysis.emotions.map((emotion) => (
                        <Badge key={emotion} variant="outline" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Insights */}
            {selectedEntry.ai_insights && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span>AI Insights</span>
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 leading-relaxed">
                    {selectedEntry.ai_insights}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalList;