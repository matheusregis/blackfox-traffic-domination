import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    description: "Perfect for testing and small campaigns",
    features: [
      "50,000 Clicks",
      "5 Domains",
      "Basic Analytics",
      "Email Support",
      "DNS Management",
      "Basic Bot Filtering"
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$297",
    period: "/month",
    description: "For serious marketers and agencies",
    features: [
      "200,000 Clicks",
      "20 Domains",
      "Advanced Analytics",
      "Priority Support",
      "DNS Management",
      "AI Bot Filtering",
      "Smart Redirection",
      "Custom Rules Engine"
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "$597",
    period: "/month",
    description: "Maximum power for enterprise operations",
    features: [
      "Unlimited Clicks",
      "Unlimited Domains",
      "Real-time Analytics",
      "24/7 VIP Support",
      "Advanced DNS Management",
      "AI Bot Filtering",
      "Smart Redirection",
      "Custom Rules Engine",
      "API Access",
      "White-label Options"
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Power Level</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the plan that matches your ambition. All plans include our core cloaking technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary shadow-glow scale-105' 
                  : 'border-primary/20 hover:border-primary/40 hover:shadow-glow'
              } bg-card/50`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "premium" : "secondary"}
                  className="w-full"
                  size="lg"
                >
                  {plan.popular ? 'Start Dominating' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;