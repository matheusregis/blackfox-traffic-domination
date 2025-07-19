import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é proteção de tráfego e por que preciso disso?",
    answer: "É uma tecnologia que mostra conteúdo diferente para cada tipo de visitante. Para moderadores e robôs, mostramos uma página segura. Para clientes reais, mostramos sua oferta verdadeira. Isso protege seus anúncios de serem bloqueados e aumenta seus lucros."
  },
  {
    question: "Como o Cloaker Guard protege contra bloqueios de conta?",
    answer: "Nossa IA detecta automaticamente quando moderadores, concorrentes ou robôs estão visitando seus anúncios. Para eles, mostramos uma página segura e aprovada. Para clientes reais interessados em comprar, mostramos sua oferta verdadeira."
  },
  {
    question: "É seguro usar o Cloaker Guard?",
    answer: "O Cloaker Guard é uma ferramenta de proteção de tráfego. Fornecemos a tecnologia, mas você é responsável por usar de acordo com as regras das plataformas onde anuncia. Recomendamos sempre consultar as políticas de cada plataforma."
  },
  {
    question: "Quanto tempo leva para configurar?",
    answer: "É super rápido! A maioria dos usuários está protegido em menos de 5 minutos. Não precisa de conhecimento técnico. É só adicionar seus domínios, configurar as regras básicas e começar a proteger seus anúncios imediatamente."
  },
  {
    question: "Que tipo de relatórios vocês fornecem?",
    answer: "Você vê tudo em tempo real: quantos visitantes chegaram, quantos eram reais, quantos foram bloqueados, de onde vieram, que dispositivos usaram e quanto você está convertendo. Tudo de forma simples e clara."
  },
  {
    question: "Tem acesso à API para usuários avançados?",
    answer: "Sim! Os planos Profissional e Elite incluem acesso à API para integrações avançadas. Você pode gerenciar domínios, regras e acessar dados dos relatórios para integrar com suas outras ferramentas de marketing."
  },
  {
    question: "O que acontece se eu passar do limite de visitantes?",
    answer: "Se passar do limite do seu plano, cobramos apenas R$ 0,003 por visitante extra nos planos Iniciante e Profissional. No plano Elite, você tem visitantes ilimitados sem custo extra."
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer: "Claro! Você pode aumentar ou diminuir seu plano quando quiser. As mudanças são imediatas e ajustamos o valor proporcionalmente na sua próxima fatura."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Perguntas
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Frequentes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa saber sobre o Cloaker Guard e proteção de tráfego.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-primary/20 rounded-lg px-6 bg-card/30"
              >
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;