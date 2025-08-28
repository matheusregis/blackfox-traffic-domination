import { useEffect, useState } from "react";
import { api } from "@/services/paymentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  Globe,
  Zap,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { PricingModal } from "@/components/pricing/PricingModal";

const DEFAULT_CLICKS_LIMIT = 1000;
const DEFAULT_DOMAINS_LIMIT = 2;

type SummaryDTO = {
  totalClicks: number;
  filteredPct: number;
  successRate: number;
  activeDomains: number;
  planUsage?: {
    monthlyClicksUsed?: number;
    monthlyClicksLimit?: number;
    activeDomainsUsed?: number;
    activeDomainsLimit?: number;
    cycleEndsAt?: string | null;
    planName?: string | null;
  };
};

type MeSubscriptionDTO = {
  active: boolean;
  plan: { code: string; name: string } | null;
  period_end: string | null;
};

type DomainItem = {
  _id: string;
  name: string; // FQDN do cliente
  status?: "ACTIVE" | "PENDING" | "PROPAGATING" | "ERROR";
  lastCheckedAt?: string;
};

type RecentItemRaw = {
  domainId: string;
  domainName: string;
  lastHitAt?: string;
  passed: number;
  filtered: number;
  status: "active" | "paused"; // vindo da API antiga
};

// status unificado para UI
type UIStatus = "ACTIVE" | "PENDING" | "PROPAGATING" | "ERROR" | "PAUSED";

function mapLabel(status: UIStatus) {
  switch (status) {
    case "ACTIVE":
      return { text: "ativo", cls: "bg-green-500/20 text-green-400" };
    case "PENDING":
      return { text: "pendente", cls: "bg-yellow-500/20 text-yellow-400" };
    case "PROPAGATING":
      return { text: "propagando", cls: "bg-blue-500/20 text-blue-400" };
    case "ERROR":
      return { text: "erro", cls: "bg-red-500/20 text-red-400" };
    case "PAUSED":
    default:
      return { text: "pausado", cls: "bg-yellow-500/20 text-yellow-400" };
  }
}

export function DashboardOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState<any[]>([]);
  const [summary, setSummary] = useState<SummaryDTO | null>(null);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [activityList, setActivityList] = useState<
    { domain: string; passed: number; filtered: number; status: UIStatus }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pricingOpen, setPricingOpen] = useState(false);

  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    if (!user?.userId || !tokenLocal) return;

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${tokenLocal}`,
    };

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, activityRes, subRes, domainsRes] =
          await Promise.allSettled([
            api.get<SummaryDTO>("/dashboard/summary", {
              withCredentials: true,
              headers,
            }),
            api.get<RecentItemRaw[]>("/dashboard/recent-activity", {
              withCredentials: true,
              headers,
              params: { limit: 5 },
            }),
            api.get<MeSubscriptionDTO>("/payments/me/subscription", {
              withCredentials: true,
              headers,
            }),
            api.get<DomainItem[]>("/dashboard/domains", {
              withCredentials: true,
              headers,
            }),
          ]);

        // ---- summary / plano ----
        const baseSummary: SummaryDTO =
          summaryRes.status === "fulfilled" && summaryRes.value?.data
            ? summaryRes.value.data
            : {
                totalClicks: 0,
                filteredPct: 0,
                successRate: 1,
                activeDomains: 0,
              };

        let cycleEndsAt: string | null | undefined = undefined;
        let planName: string | null | undefined = undefined;

        if (subRes.status === "fulfilled" && subRes.value?.data) {
          const sub = subRes.value.data;
          cycleEndsAt = sub?.period_end ?? null;
          planName = sub?.plan?.name || sub?.plan?.code || null;
        }

        const mergedSummary: SummaryDTO = {
          ...baseSummary,
          planUsage: {
            ...baseSummary.planUsage,
            cycleEndsAt:
              baseSummary.planUsage?.cycleEndsAt ?? cycleEndsAt ?? null,
            planName: baseSummary.planUsage?.planName ?? planName ?? "Plano",
          },
        };
        setSummary(mergedSummary);

        setStats([
          {
            title: "Cliques Totais",
            value: (mergedSummary.totalClicks || 0).toLocaleString("pt-BR"),
            change: "",
            trend: "up",
            icon: "users",
          },
          {
            title: "Tráfego Filtrado",
            value: `${((mergedSummary.filteredPct || 0) * 100).toFixed(1)}%`,
            change: "",
            trend: "up",
            icon: "shield",
          },
          {
            title: "Domínios Ativos",
            value: String(mergedSummary.activeDomains || 0),
            change: "",
            trend: "up",
            icon: "globe",
          },
          {
            title: "Taxa de Sucesso",
            value: `${((mergedSummary.successRate || 0) * 100).toFixed(1)}%`,
            change: "",
            trend: "up",
            icon: "zap",
          },
        ]);

        // ---- domínios
        const doms: DomainItem[] =
          domainsRes.status === "fulfilled" &&
          Array.isArray(domainsRes.value?.data)
            ? domainsRes.value.data
            : [];
        setDomains(doms);

        // ---- atividade recente (mesclar com domínios)
        const recent: RecentItemRaw[] =
          activityRes.status === "fulfilled" &&
          Array.isArray(activityRes.value?.data)
            ? activityRes.value.data
            : [];

        const byId = new Map<string, DomainItem>();
        doms.forEach((d) => byId.set(d._id, d));

        // 1) normaliza os itens com hits
        const withHits = recent.map((a) => {
          const d = byId.get(a.domainId);
          // prioridade: status do domínio (se existir e não for ACTIVE)
          let status: UIStatus =
            d?.status && d.status !== "ACTIVE"
              ? d.status
              : a.status === "active"
              ? "ACTIVE"
              : "PAUSED";
          return {
            domain: a.domainName ?? "-",
            passed: a.passed ?? 0,
            filtered: a.filtered ?? 0,
            status,
          };
        });

        // 2) adiciona domínios sem hits ainda
        const withHitsNames = new Set(
          withHits.map((i) => i.domain.toLowerCase())
        );
        const withoutHits = doms
          .filter((d) => !withHitsNames.has(d.name.toLowerCase()))
          .map((d) => ({
            domain: d.name,
            passed: 0,
            filtered: 0,
            status: (d.status as UIStatus) || "PAUSED",
          }));

        // 3) resultado final (pode limitar, se quiser)
        const merged = [...withHits, ...withoutHits];
        setActivityList(merged);
      } catch (err: any) {
        console.error("Erro ao carregar dashboard:", err);
        setError(err?.message || "Falha ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.userId]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  const clicksUsed =
    summary?.planUsage?.monthlyClicksUsed ?? summary?.totalClicks ?? 0;
  const clicksLimit =
    summary?.planUsage?.monthlyClicksLimit ?? DEFAULT_CLICKS_LIMIT;
  const clicksPct = clicksLimit ? (clicksUsed / clicksLimit) * 100 : 0;

  const domUsed =
    summary?.planUsage?.activeDomainsUsed ?? summary?.activeDomains ?? 0;
  const domLimit =
    summary?.planUsage?.activeDomainsLimit ?? DEFAULT_DOMAINS_LIMIT;
  const domPct = domLimit ? (domUsed / domLimit) * 100 : 0;

  const planName = summary?.planUsage?.planName
    ? summary.planUsage.planName
    : "Plano";

  const isFree =
    /free|grat/i.test(planName || "") ||
    (clicksLimit || 0) <= 5 ||
    (domLimit || 0) <= 1;
  const nearLimit =
    (clicksLimit > 0 && clicksUsed / clicksLimit >= 0.8) ||
    (domLimit > 0 && domUsed / domLimit >= 0.8);

  return (
    <div className="space-y-6">
      {/* Modal de Planos */}
      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} />

      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo de volta
        </h2>
        <p className="text-muted-foreground">
          Aqui está o que está acontecendo com suas campanhas hoje.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card/50 border-primary/20 hover:shadow-glow transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon === "users" && (
                <Users className="h-4 w-4 text-muted-foreground" />
              )}
              {stat.icon === "shield" && (
                <Shield className="h-4 w-4 text-muted-foreground" />
              )}
              {stat.icon === "globe" && (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
              {stat.icon === "zap" && (
                <Zap className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              {stat.change ? (
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">em relação ao mês anterior</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atividade recente + Uso do plano */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade + domínios (mesclados) */}
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityList.map((item, idx) => {
                const label = mapLabel(item.status);
                return (
                  <div
                    key={`${item.domain}-${idx}`}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.domain}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.filtered} filtrados • {item.passed} aprovados
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${label.cls}`}
                    >
                      {label.text}
                    </div>
                  </div>
                );
              })}

              {/* CTA apenas quando não há domínios */}
              {activityList.length === 0 && (
                <div className="rounded-lg border border-primary/20 p-4 bg-secondary/20">
                  <p className="text-sm text-muted-foreground mb-3">
                    Nenhuma atividade por enquanto. Comece adicionando um
                    domínio e configurando seu tráfego.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => (window.location.href = "/dashboard/dns")}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar domínio
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setPricingOpen(true)}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Conheça os planos
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uso do plano */}
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Cliques no mês</span>
                <span className="text-foreground">
                  {clicksUsed.toLocaleString("pt-BR")} /{" "}
                  {clicksLimit.toLocaleString("pt-BR")}
                </span>
              </div>
              <Progress value={clicksPct} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Domínios ativos</span>
                <span className="text-foreground">
                  {domUsed} / {domLimit}
                </span>
              </div>
              <Progress value={domPct} className="h-2" />
            </div>

            <div className="pt-4 border-t border-primary/20">
              <p className="text-sm text-muted-foreground">
                Você está no{" "}
                <span className="text-primary font-medium">{planName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.planUsage?.cycleEndsAt
                  ? `Renova em ${new Date(
                      summary.planUsage.cycleEndsAt
                    ).toLocaleDateString("pt-BR")}`
                  : "Informações do ciclo indisponíveis"}
              </p>
            </div>

            {(isFree || nearLimit) && (
              <div className="mt-3 rounded-xl p-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Desbloqueie mais capacidade
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      No plano Free você pode processar poucos acessos. Faça
                      upgrade para aumentar limites e liberar recursos
                      avançados.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setPricingOpen(true)}
                    className="shrink-0"
                  >
                    Ver planos
                  </Button>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Preferir página completa?{" "}
                  <a href="/pricing" className="underline hover:text-primary">
                    Abrir /pricing
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
