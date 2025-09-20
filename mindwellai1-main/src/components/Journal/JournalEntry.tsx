import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Save, Sparkles, Heart, Brain, TrendingUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JournalEntryProps {
  onSave: () => void;
  onCancel: () => void;
}

const JournalEntry = ({ onSave, onCancel }: JournalEntryProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodRating, setMoodRating] = useState([5]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something in your journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setIsAnalyzing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your journal entry.",
          variant: "destructive",
        });
        return;
      }

      // Analyze the journal entry
      let analysisResult = null;
      try {
        const { data: analysis, error: analysisError } = await supabase.functions.invoke('journal-analysis', {
          body: { content, title }
        });

        if (!analysisError && analysis) {
          analysisResult = analysis.analysis;
        }
      } catch (error) {
        console.error('Analysis failed:', error);
      }

      setIsAnalyzing(false);

      // Save to database
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim() || null,
          content: content.trim(),
          mood_rating: moodRating[0],
          tags: tags.length > 0 ? tags : null,
          sentiment_analysis: analysisResult?.sentiment || null,
          ai_insights: analysisResult?.insights || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Journal Entry Saved",
        description: analysisResult ? "Your entry has been saved with AI insights!" : "Your entry has been saved successfully!",
      });

      onSave();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsAnalyzing(false);
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return "😢";
    if (rating <= 4) return "😔";
    if (rating <= 6) return "😐";
    if (rating <= 8) return "🙂";
    return "😊";
  };

  const getMoodLabel = (rating: number) => {
    if (rating <= 2) return "Very Low";
    if (rating <= 4) return "Low";
    if (rating <= 6) return "Neutral";
    if (rating <= 8) return "Good";
    return "Excellent";
  };

  return (
    <Card className="shadow-large border-border/50">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>New Journal Entry</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Title (Optional)
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="bg-background border-border"
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            How are you feeling? What's on your mind?
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your thoughts, feelings, experiences, or anything that's important to you..."
            className="bg-background border-border min-h-[200px] resize-none"
          />
        </div>

        {/* Mood Rating */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Mood Rating: {getMoodEmoji(moodRating[0])} {getMoodLabel(moodRating[0])} ({moodRating[0]}/10)
          </label>
          <Slider
            value={moodRating}
            onValueChange={setMoodRating}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Very Low</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Tags (Optional)
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tags like 'work', 'family', 'anxiety'..."
              className="bg-background border-border flex-1"
            />
            <Button onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm">AI is analyzing your entry for insights...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !content.trim()}
            className="bg-primary hover:bg-primary-dark text-primary-foreground"
          >
            {isSaving ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;