import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Brain, Heart, TrendingUp, Calendar } from "lucide-react";
import JournalEntry from "@/components/Journal/JournalEntry";
import JournalList from "@/components/Journal/JournalList";

const Journal = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEntry = () => {
    setShowNewEntry(true);
  };

  const handleSaveEntry = () => {
    setShowNewEntry(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelEntry = () => {
    setShowNewEntry(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Personal
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Journal</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Reflect, analyze, and grow with AI-powered insights for your mental wellness journey.
          </p>
          
          {!showNewEntry && (
            <Button 
              onClick={handleNewEntry}
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg shadow-medium hover:shadow-large transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          )}
        </div>

        {/* Features Overview */}
        {!showNewEntry && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-medium border-border/50">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Get insights into your emotional patterns and mental state.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border/50">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-pink-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your emotional wellness and track progress over time.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium border-border/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Progress Insights</h3>
                <p className="text-muted-foreground text-sm">
                  Discover patterns and receive personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {showNewEntry ? (
            <JournalEntry 
              onSave={handleSaveEntry}
              onCancel={handleCancelEntry}
            />
          ) : (
            <JournalList 
              onNewEntry={handleNewEntry}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Privacy Notice */}
        {!showNewEntry && (
          <div className="text-center mt-12">
            <Card className="shadow-medium border-border/50 bg-muted/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
                </div>
                <p className="text-muted-foreground">
                  Your journal entries are completely private and secure. Only you can access your personal thoughts and insights.
                  All data is encrypted and protected by industry-standard security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;