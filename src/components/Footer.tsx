import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import blackfoxLogo from "@/assets/blackfox-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-dark border-t border-primary/20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={blackfoxLogo} alt="BlackFox" className="w-8 h-8" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cloaker Guard
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Proteja seus anúncios e aumente seus lucros automaticamente com nossa 
              tecnologia inteligente de filtragem de visitantes.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
              <Button variant="premium" size="sm">
                Criar Conta
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Produto</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Suporte</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#faq" className="hover:text-primary transition-colors">Perguntas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tutoriais</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ajuda</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © 2024 Cloaker Guard. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">Política de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;