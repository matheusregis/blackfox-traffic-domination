import { Shield, Brain, BarChart3, Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Proteção Automática",
    description: "Bloqueia visitantes indesejados automaticamente, protegendo seus anúncios de moderadores e concorrentes.",
  },
  {
    icon: Brain,
    title: "Filtragem Inteligente",
    description: "Nossa IA identifica e filtra robôs e visitantes suspeitos, mostrando apenas conteúdo seguro para eles.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Simples",
    description: "Veja em tempo real quantos visitantes reais chegaram e quantos foram bloqueados.",
  },
  {
    icon: Route,
    title: "Redirecionamento Inteligente",
    description: "Direciona visitantes automaticamente: clientes reais veem sua oferta, moderadores veem página segura.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recursos Poderosos para
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Seus Anúncios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para proteger seus anúncios e aumentar seus lucros de forma automática.
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