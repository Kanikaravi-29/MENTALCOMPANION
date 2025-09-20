import { Brain, Heart, Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-hero rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MindWell AI</span>
            </div>
            <p className="text-background/80 leading-relaxed mb-6">
              Your trusted AI companion for mental health support. 
              Professional, confidential, and always available when you need it most.
            </p>
            <div className="flex items-center space-x-4 text-background/60">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Made with care</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">AI Therapy Chat</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Mental Health Assessment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Progress Tracking</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Crisis Support</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Mindfulness Exercises</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get Help</h3>
            <div className="space-y-4 text-background/80">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span>Available worldwide, 24/7</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-2">Crisis Support</p>
              <p className="text-sm text-background/80">
                If you're in crisis, please call:
              </p>
              <ul className="text-sm text-background/80 mt-2 space-y-1">
                <li>• US: 988</li>
                <li>• India: 9152987821 (KIRAN)</li>
                <li>• Or your local emergency services immediately</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2024 MindWell AI. Professional mental health support powered by AI.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;