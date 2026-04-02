import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  Lightbulb, 
  Rocket, 
  Award,
  Heart,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-20 px-4 bg-muted/30" {...({} as any)}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About StartupSync</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Empowering entrepreneurs with intelligent guidance at every step of their startup journey
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To democratize access to high-quality business advisory by combining cutting-edge AI 
                    with domain-specific expertise, making professional guidance accessible to every entrepreneur.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Rocket className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A world where every startup has access to the strategic insights and domain knowledge 
                    needed to transform innovative ideas into successful, sustainable businesses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={<Lightbulb className="h-6 w-6" />}
              title="Innovation First"
              description="We continuously evolve our AI capabilities to stay ahead of industry trends and emerging business challenges."
              color="from-blue-500/20 to-cyan-500/20"
            />
            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title="User-Centric"
              description="Every feature is designed with real entrepreneur needs in mind, based on extensive research and feedback."
              color="from-purple-500/20 to-pink-500/20"
            />
            <ValueCard
              icon={<Award className="h-6 w-6" />}
              title="Excellence"
              description="We maintain the highest standards of quality, accuracy, and reliability in every recommendation we provide."
              color="from-orange-500/20 to-red-500/20"
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-card border rounded-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Story</h3>
              <p className="text-muted-foreground mb-4">
                StartupSync was born from a simple observation: countless brilliant ideas never see the light 
                of day because founders lack access to expert guidance at critical decision points.
              </p>
              <p className="text-muted-foreground mb-4">
                We recognized that while there's no shortage of business advice available, what entrepreneurs 
                truly need is personalized, context-aware guidance that evolves with their unique journey.
              </p>
              <p className="text-muted-foreground">
                Today, StartupSync combines advanced AI technology with deep domain expertise to serve as 
                your intelligent co-founder—available 24/7, continuously learning, and always focused on 
                your success.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl border-2 border-primary/20">
                  <Heart className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Built by Experts</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team combines decades of experience in entrepreneurship, AI research, and domain expertise 
            across marketing, finance, legal, and operations.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join thousands of entrepreneurs who are already using StartupSync to build better businesses
            </p>
            <Button
              size="lg"
              className="group"
              onClick={() => navigate('/')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ValueCard = ({ icon, title, description, color }: ValueCardProps) => {
  return (
    <div className={`p-6 rounded-lg border bg-gradient-to-br ${color}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary">{icon}</div>
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default AboutSection;
