import { Shield, Brain, BarChart3, Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "DNS Management",
    description: "Advanced DNS routing and management system for maximum stealth and reliability.",
  },
  {
    icon: Brain,
    title: "Bot Filtering",
    description: "AI-powered bot detection that learns and adapts to new threats automatically.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time traffic analytics with detailed insights and performance metrics.",
  },
  {
    icon: Route,
    title: "Smart Redirection",
    description: "Intelligent traffic routing based on geolocation, device, and behavioral patterns.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Elite Marketers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to stay ahead of detection systems and maximize your campaign performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-glow transition-all duration-300 bg-card/50 border-primary/20 hover:border-primary/40"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
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

export default Features;