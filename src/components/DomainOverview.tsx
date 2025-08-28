import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { Domain } from "@/pages/Domains";
import { Plus, Pencil, Trash, Info, RefreshCcw, Copy } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type DomainStatus = "ACTIVE" | "PENDING" | "PROPAGATING" | "ERROR" | "UNKNOWN";

type DomainStatusInfo = {
  status: DomainStatus;
  reason?: string;
  checkedAt?: string;
};

export function DomainsOverview({
  domains,
  onRefresh,
}: {
  domains: Domain[];
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", whiteUrl: "", blackUrl: "" });
  const [editForm, setEditForm] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [instructionsDomain, setInstructionsDomain] = useState<Domain | null>(null);

  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [statusById, setStatusById] = useState<Record<string, DomainStatusInfo>>({});

  const { user, token } = useUser();
  const userId = user?.userId;

  const axiosAuth = useMemo(() => {
    const inst = axios.create({ baseURL: API_URL });
    if (token) inst.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return inst;
  }, [token]);

  const computeTarget = (domainName: string) => {
    const slug = domainName.split(".")[0].toLowerCase().trim();
    return `${slug}-${userId}.autochecking.com.br`;
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const renderStatusBadge = (s: DomainStatus) => {
    switch (s) {
      case "ACTIVE":
        return <Badge className="bg-emerald-600 hover:bg-emerald-600">Ativo</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-600 hover:bg-amber-600">Pendente</Badge>;
      case "PROPAGATING":
        return <Badge className="bg-blue-600 hover:bg-blue-600">Propagando</Badge>;
      case "ERROR":
        return <Badge className="bg-red-600 hover:bg-red-600">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    setLoading(true);
    try {
      const slug = form.name.split(".")[0].toLowerCase().trim();
      const content = `${slug}-${userId}.autochecking.com.br`;
      const payload = { ...form, type: "CNAME", content };

      const { data: created } = await axiosAuth.post(`/domains/${userId}`, payload);
      toast.success("Domínio criado com sucesso!");

      setForm({ name: "", whiteUrl: "", blackUrl: "" });
      setOpen(false);

      // Checa status do recém-criado (precisa retornar o _id no POST)
      if (created?._id) {
        await checkStatus(created);
      }

      onRefresh();
    } catch {
      toast.error("Erro ao criar domínio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDomain) return;
    try {
      await axiosAuth.delete(`/domains/${selectedDomain._id}`);
      toast.success("Domínio excluído com sucesso!");
      setDeleteOpen(false);
      onRefresh();
    } catch {
      toast.error("Erro ao excluir domínio");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setLoading(true);
    try {
      await axiosAuth.put(`/domains/${editForm._id}`, {
        name: editForm.name,
        whiteUrl: editForm.whiteUrl,
        blackUrl: editForm.blackUrl,
      });
      toast.success("Domínio atualizado com sucesso!");
      setEditOpen(false);
      onRefresh();
    } catch {
      toast.error("Erro ao atualizar domínio");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (domain: Domain) => {
    setCheckingId(domain._id as string);
    try {
      const { data } = await axiosAuth.get<DomainStatusInfo>(`/domains/${domain._id}/status`);
      const info: DomainStatusInfo = {
        status: (data?.status as DomainStatus) ?? "UNKNOWN",
        reason: data?.reason,
        checkedAt: data?.checkedAt,
      };
      setStatusById((prev) => ({ ...prev, [domain._id as string]: info }));

      if (info.status === "ACTIVE") toast.success(`"${domain.name}" está ativo`);
      else if (info.status === "PROPAGATING") toast.message("DNS propagando...");
      else if (info.status === "PENDING") toast.message("Aguardando configuração no provedor de DNS");
      else if (info.status === "ERROR") toast.error(info.reason ?? "Configuração incorreta");
    } catch {
      toast.error("Erro ao verificar status");
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Domínios Cadastrados</CardTitle>

          {/* Criar domínio */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Domínio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Nome do Domínio (ex: teste.promocao.com.br)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="White URL"
                  value={form.whiteUrl}
                  onChange={(e) => setForm({ ...form, whiteUrl: e.target.value })}
                  required
                />
                <Input
                  placeholder="Black URL"
                  value={form.blackUrl}
                  onChange={(e) => setForm({ ...form, blackUrl: e.target.value })}
                  required
                />
                <div className="rounded-md border p-3 text-sm">
                  <p className="font-medium mb-1">Você vai precisar criar este CNAME no seu provedor:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span>Tipo:</span>
                      <code className="px-2 py-0.5 rounded bg-muted">CNAME</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Host:</span>
                      <code className="px-2 py-0.5 rounded bg-muted">{form.name || "seu-sub.seudominio.com"}</code>
                      <Button variant="ghost" size="icon" onClick={() => copy(form.name)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Target (valor):</span>
                      <code className="px-2 py-0.5 rounded bg-muted">
                        {userId ? computeTarget(form.name || "sub.dominio.com") : "—"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copy(userId ? computeTarget(form.name) : "")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Salvando..." : "Cadastrar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Confirmar exclusão */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Domínio</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir o domínio{" "}
                <span className="font-semibold text-foreground">{selectedDomain?.name}</span>?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        {/* Lista */}
        <CardContent className="space-y-4">
          {domains.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum domínio cadastrado ainda.</p>
          ) : (
            domains.map((domain) => {
              const localStatus = statusById[domain._id as string]?.status;
              const status: DomainStatus =
                (domain as any)?.status ?? localStatus ?? "UNKNOWN";
              const reason = statusById[domain._id as string]?.reason;

              const target = (domain as any)?.content ?? (userId ? computeTarget(domain.name) : "");

              return (
                <div
                  key={domain._id}
                  className="p-4 rounded border border-border bg-secondary/30 space-y-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">{domain.name}</p>
                        {renderStatusBadge(status)}
                        <button
                          className="inline-flex items-center text-xs text-muted-foreground"
                          title={reason || "Status do DNS/rota"}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground">White: {domain.whiteUrl}</p>
                      <p className="text-sm text-muted-foreground">Black: {domain.blackUrl}</p>

                      <div className="text-xs mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">CNAME alvo:</span>
                          <code className="px-2 py-0.5 rounded bg-muted">{target}</code>
                          <Button variant="ghost" size="icon" onClick={() => copy(target)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInstructionsDomain(domain);
                          setInstructionsOpen(true);
                        }}
                      >
                        Instruções
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => checkStatus(domain)}
                        disabled={checkingId === domain._id}
                      >
                        <RefreshCcw className={`h-4 w-4 mr-2 ${checkingId === domain._id ? "animate-spin" : ""}`} />
                        Testar
                      </Button>

                      <Pencil
                        size={18}
                        className="cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditForm(domain);
                          setEditOpen(true);
                        }}
                      />
                      <Trash
                        size={18}
                        className="cursor-pointer text-destructive hover:text-red-600"
                        onClick={() => {
                          setSelectedDomain(domain);
                          setDeleteOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  {status === "ERROR" && reason && (
                    <p className="text-xs text-red-400">Detalhes: {reason}</p>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Domínio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              placeholder="Nome do Domínio"
              value={editForm?.name || ""}
              onChange={(e) =>
                setEditForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              }
              required
            />
            <Input
              placeholder="White URL"
              value={editForm?.whiteUrl || ""}
              onChange={(e) =>
                setEditForm((prev) => (prev ? { ...prev, whiteUrl: e.target.value } : prev))
              }
              required
            />
            <Input
              placeholder="Black URL"
              value={editForm?.blackUrl || ""}
              onChange={(e) =>
                setEditForm((prev) => (prev ? { ...prev, blackUrl: e.target.value } : prev))
              }
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Atualizar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Instruções */}
      <Dialog open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Como ativar seu domínio</DialogTitle>
          </DialogHeader>

          {instructionsDomain && (
            <div className="space-y-4 text-sm">
              <p>
                Para que o cloaker funcione, você precisa criar um registro DNS no seu provedor
                apontando <span className="font-semibold">{instructionsDomain.name}</span> para o nosso alvo.
              </p>

              <div className="rounded-md border p-3">
                <p className="font-medium mb-2">Valores a configurar:</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span>Tipo:</span>
                    <code className="px-2 py-0.5 rounded bg-muted">CNAME</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Host / Nome:</span>
                    <code className="px-2 py-0.5 rounded bg-muted">{instructionsDomain.name}</code>
                    <Button variant="ghost" size="icon" onClick={() => copy(instructionsDomain.name)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target / Valor:</span>
                    <code className="px-2 py-0.5 rounded bg-muted">
                      {(instructionsDomain as any)?.content ??
                        (userId ? computeTarget(instructionsDomain.name) : "")}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copy(
                          (instructionsDomain as any)?.content ??
                            (userId ? computeTarget(instructionsDomain.name) : "")
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Proxy / CDN (se houver):</span>
                    <code className="px-2 py-0.5 rounded bg-muted">Desativado (DNS only)</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>TTL:</span>
                    <code className="px-2 py-0.5 rounded bg-muted">Auto</code>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-3 space-y-2">
                <p className="font-medium">Passo a passo (genérico):</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Acesse o painel do seu provedor de DNS.</li>
                  <li>Abra a seção <strong>DNS</strong> (Registros DNS ou Zona DNS).</li>
                  <li>Clique em <strong>Adicionar registro</strong> e selecione <strong>CNAME</strong>.</li>
                  <li>Em <strong>Host/Nome</strong>, use o seu subdomínio (ex.: <code>teste</code> se for <code>teste.seudominio.com.br</code>). Alguns provedores aceitam o FQDN completo.</li>
                  <li>Em <strong>Target/Valor</strong>, cole o alvo acima.</li>
                  <li>Desative o proxy/CDN se existir a opção (DNS only).</li>
                  <li>Salve e aguarde a propagação (normalmente minutos até algumas horas).</li>
                </ol>
              </div>

              <div className="rounded-md border p-3 space-y-2">
                <p className="font-medium">Cloudflare (exemplo):</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Sites &gt; selecione seu domínio.</li>
                  <li>Aba <strong>DNS</strong> &gt; <strong>Add record</strong>.</li>
                  <li>Type: <strong>CNAME</strong>.</li>
                  <li>Name: seu subdomínio (ex.: <code>teste</code>).</li>
                  <li>Target: cole o <strong>Target/Valor</strong> acima.</li>
                  <li>Proxy status: <strong>DNS only</strong> (ícone cinza).</li>
                  <li>Salvar.</li>
                </ol>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setInstructionsOpen(false)}>
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setInstructionsOpen(false);
                    if (instructionsDomain) checkStatus(instructionsDomain);
                  }}
                >
                  Testar configuração
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
