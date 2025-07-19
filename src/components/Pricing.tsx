import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const plans = [
  {
    name: "Iniciante",
    price: "$97",
    period: "/mês",
    description: "Perfeito para testar e campanhas pequenas",
    features: [
      "50.000 Visitantes",
      "5 Domínios",
      "Relatórios Básicos",
      "Suporte por Email",
      "Proteção Automática",
      "Filtragem Básica"
    ],
    popular: false,
  },
  {
    name: "Profissional",
    price: "$297",
    period: "/mês",
    description: "Para afiliados sérios e agências",
    features: [
      "200.000 Visitantes",
      "20 Domínios",
      "Relatórios Avançados",
      "Suporte Prioritário",
      "Proteção Automática",
      "Filtragem com IA",
      "Redirecionamento Inteligente",
      "Regras Personalizadas"
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "$597",
    period: "/mês",
    description: "Poder máximo para operações grandes",
    features: [
      "Visitantes Ilimitados",
      "Domínios Ilimitados",
      "Relatórios em Tempo Real",
      "Suporte VIP 24/7",
      "Proteção Avançada",
      "Filtragem com IA",
      "Redirecionamento Inteligente",
      "Regras Personalizadas",
      "Acesso à API",
      "Marca Branca"
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
            Escolha Seu
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Plano Ideal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Selecione o plano que combina com seus objetivos. Todos incluem nossa tecnologia de proteção.
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
                    <span className="text-sm font-medium">Mais Popular</span>
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
                  {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
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