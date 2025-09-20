import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Shield, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-accent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-card opacity-10 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Mental Health Support</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Personal
              <span className="bg-gradient-hero bg-clip-text text-transparent block">
                Mental Health
              </span>
              Companion
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get 24/7 support from our AI-powered mental health assistant. 
              Professional, confidential, and always available when you need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 text-lg shadow-medium hover:shadow-large transition-all duration-300"
                onClick={() => {
                  const chatSection = document.getElementById('chat');
                  chatSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-success" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Evidence-Based</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up animation-delay-300">
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src={heroImage} 
                alt="Peaceful mental health and wellness scene" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-medium animate-gentle-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI Therapy Chat</p>
                  <p className="text-xs text-muted-foreground">Always listening</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-medium animate-gentle-bounce animation-delay-1000">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure & Private</p>
                  <p className="text-xs text-muted-foreground">Your data protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;