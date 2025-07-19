import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import blackfoxLogo from "@/assets/blackfox-logo.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-dark">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-glow/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={blackfoxLogo} 
            alt="BlackFox Logo" 
            className="w-24 h-24 mx-auto mb-6 opacity-90"
          />
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Cloaker Guard
          </h1>
        </div>

        {/* Slogan */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-6">
            Outsmart the system. Dominate the traffic.
          </h2>
          
          {/* Key features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-secondary/50 rounded-full text-sm font-medium border border-primary/20">
              Proteção Anti-Bloqueio
            </span>
            <span className="px-4 py-2 bg-secondary/50 rounded-full text-sm font-medium border border-primary/20">
              Filtragem Inteligente
            </span>
            <span className="px-4 py-2 bg-secondary/50 rounded-full text-sm font-medium border border-primary/20">
              Controle Total de Visitantes
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Proteja seus anúncios e aumente seus lucros automaticamente. 
          Nossa tecnologia inteligente filtra visitantes indesejados e direciona apenas 
          clientes reais para suas ofertas, evitando bloqueios e maximizando seus resultados.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            variant="premium"
            size="lg" 
            className="text-lg px-8 py-6 mb-16"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Começar Agora
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in animate-bounce" style={{ animationDelay: '1s' }}>
          <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;