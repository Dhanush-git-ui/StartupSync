
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, Info, Sparkles, Zap, Brain } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex flex-col items-center py-24 px-4 text-center relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI-Powered Startup Advisory</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Meet Your AI{" "}
          <span className="gradient-text inline-block">Co-Founder</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
          The intelligent assistant that evolves with your startup journey—from
          ideation to scale.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground glass-effect">
            <Info className="h-4 w-4" />
            <span>Demonstration website showcasing product capabilities</span>
          </div>
        </div>
        
        <Button
          size="lg"
          className="group text-lg px-10 py-7 rounded-full btn-glow bg-gradient-to-r from-primary to-secondary"
          onClick={onGetStarted}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Get Started Free
          <ArrowRight
            className={`ml-2 transition-all duration-300 ${
              isHovering ? "translate-x-2 scale-110" : ""
            }`}
          />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full relative z-10">
        <FeatureCard
          title="Strategic Guidance"
          description="Receive data-driven insights tailored to your business goals and challenges."
          icon={<Brain className="h-8 w-8" />}
          gradient="from-blue-500/10 to-cyan-500/10"
        />
        <FeatureCard
          title="Domain Experts"
          description="Access specialized knowledge across marketing, fundraising, legal, and more."
          icon={<Zap className="h-8 w-8" />}
          highlighted
          gradient="from-purple-500/10 to-pink-500/10"
        />
        <FeatureCard
          title="Always Learning"
          description="Your AI co-founder continuously adapts to your needs and feedback."
          icon={<Sparkles className="h-8 w-8" />}
          gradient="from-orange-500/10 to-red-500/10"
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  highlighted?: boolean;
  icon?: React.ReactNode;
  gradient?: string;
}

const FeatureCard = ({ title, description, highlighted, icon, gradient }: FeatureCardProps) => (
  <div
    className={`p-8 rounded-2xl flex flex-col items-center text-center card-hover border-2 ${
      highlighted
        ? "bg-gradient-to-br border-primary/30 shadow-lg shadow-primary/10"
        : "bg-card border-transparent hover:border-primary/20"
    } ${gradient || "from-primary/10 to-secondary/10"}`}
  >
    {icon && (
      <div className={`mb-4 p-3 rounded-xl ${highlighted ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
    )}
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default Hero;
