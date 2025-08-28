import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star } from "lucide-react";
import { PaymentModal } from "@/components/payments/PaymentModal";

// defina seus planos aqui (valores em centavos)
const PLANS = [
  {
    code: "Iniciante",
    name: "Iniciante",
    priceCents: 9700,
    highlight: false,
    limits: { visitors: 50000, domains: 5 },
    features: [
      "50.000 Visitantes (demo do card)",
      "5 Domínios (demo do card)",
      "Relatórios Básicos",
      "Suporte por Email",
      "Proteção Automática",
      "Filtragem Básica",
    ],
    cta: "Escolher Plano",
  },
  {
    code: "Profissional",
    name: "Profissional",
    priceCents: 29700, // R$ 297
    highlight: true, // mais popular
    limits: { visitors: 200_000, domains: 20 },
    features: [
      "200.000 Visitantes",
      "20 Domínios",
      "Relatórios Avançados",
      "Suporte Prioritário",
      "Proteção Automática",
      "Filtragem com IA",
      "Redirecionamento Inteligente",
      "Regras Personalizadas",
    ],
    cta: "Começar Agora",
  },
  {
    code: "Elite",
    name: "Elite",
    priceCents: 59700, // R$ 597
    highlight: false,
    limits: { visitors: Infinity, domains: Infinity },
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
      "Marca Branca",
    ],
    cta: "Escolher Plano",
  },
];

const BRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type PricingModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** opcional: abrir já com um plano pré-selecionado */
  defaultPlanCode?: string;
};

export function PricingModal({
  open,
  onOpenChange,
  defaultPlanCode,
}: PricingModalProps) {
  const [payOpen, setPayOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof PLANS)[number] | null
  >(null);

  const defaultPlan = useMemo(
    () => PLANS.find((p) => p.code === (defaultPlanCode || "")) || null,
    [defaultPlanCode]
  );

  // abre o modal de pagamento com o plano escolhido
  function choose(plan: (typeof PLANS)[number]) {
    if (plan.priceCents === 0) {
      // Free: só fecha e deixa o usuário continuar. (Se preferir, redirecione para /dashboard/dns)
      onOpenChange(false);
      return;
    }
    setSelectedPlan(plan);
    setPayOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => onOpenChange(v)}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Escolha seu Plano
            </DialogTitle>
            <DialogDescription>
              Selecione o plano ideal para seu volume de tráfego. Você pode
              mudar de plano a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isPopular = plan.highlight;
              return (
                <Card
                  key={plan.code}
                  className={`relative bg-card/50 border-primary/20 ${
                    isPopular ? "ring-2 ring-primary/60" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground flex items-center gap-1 shadow">
                      <Star className="h-3 w-3" /> Mais Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-2 text-3xl font-bold text-foreground">
                      {plan.priceCents === 0 ? "Grátis" : BRL(plan.priceCents)}
                      {plan.priceCents > 0 && (
                        <span className="text-sm text-muted-foreground">
                          /mês
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-foreground/90"
                        >
                          <Check className="h-4 w-4 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-2"
                      onClick={() => choose(plan)}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Precisa ver em tela cheia?{" "}
              <a href="/pricing" className="underline hover:text-primary">
                Ver página completa
              </a>
            </span>
            {defaultPlan && (
              <Button variant="ghost" onClick={() => choose(defaultPlan)}>
                Selecionar {defaultPlan.name}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de pagamento (abre quando o plano pago é escolhido) */}
      {selectedPlan && (
        <PaymentModal
          open={payOpen}
          onOpenChange={(v) => {
            setPayOpen(v);
            if (!v) {
              // ao fechar pagamento, também fechar pricing, se quiser
              onOpenChange(false);
            }
          }}
          amount={selectedPlan.priceCents}
          metadata={{ plan: selectedPlan.code }}
        />
      )}
    </>
  );
}
