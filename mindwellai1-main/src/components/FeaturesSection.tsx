import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Shield, 
  Clock, 
  TrendingUp, 
  Heart, 
  Brain,
  Users,
  Award
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "24/7 AI Support",
    description: "Access professional mental health support anytime, anywhere. Our AI is trained on evidence-based therapeutic approaches.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your conversations are encrypted and HIPAA compliant. We prioritize your privacy and confidentiality.",
    color: "text-success"
  },
  {
    icon: Brain,
    title: "Personalized Care",
    description: "Our AI learns your preferences and adapts to provide personalized mental health strategies and coping mechanisms.",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your mental health journey with detailed insights and progress reports to see your improvement over time.",
    color: "text-secondary"
  },
  {
    icon: Heart,
    title: "Emotional Wellness",
    description: "Focus on building emotional resilience with guided exercises, mindfulness practices, and stress management tools.",
    color: "text-destructive"
  },
  {
    icon: Clock,
    title: "Instant Response",
    description: "No waiting times or appointments needed. Get immediate support when you're experiencing difficult moments.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others on similar journeys through moderated support groups and peer-to-peer encouragement.",
    color: "text-secondary"
  },
  {
    icon: Award,
    title: "Evidence-Based",
    description: "All our therapeutic approaches are backed by scientific research and proven mental health practices.",
    color: "text-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose 
            <span className="bg-gradient-hero bg-clip-text text-transparent"> MindWell AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with proven therapeutic methods 
            to provide you with the mental health support you deserve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 text-white`} />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;