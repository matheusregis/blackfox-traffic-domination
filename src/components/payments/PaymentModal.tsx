import React, { useEffect, useMemo, useRef, useState } from "react";
import { payments } from "@/services/paymentService";
import { tokenizeCardBrowser } from "@/services/pagarmeTokenize";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  amount: number; // em centavos
  metadata?: Record<string, any>;
};
type PayMethod = "card" | "pix";

const BRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const onlyDigits = (s: string) => s.replace(/\D+/g, "");
const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
};
const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.length <= 5 ? d : d.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};
// ——— máscaras novas ———
const formatCardNumber = (v: string) => {
  const d = onlyDigits(v).slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};
const formatExpiry = (v: string) => {
  const d = onlyDigits(v).slice(0, 4); // MMYY
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

const MAX_INSTALLMENTS = 12;
const MIN_INSTALLMENT_CENTS = 500;

// taxas do gateway por quantidade de parcelas
const installmentsOpt = [
  {
    "1x": 0.0559,
    "2x": 0.0859,
    "3x": 0.0984,
    "4x": 0.1109,
    "5x": 0.1234,
    "6x": 0.1359,
    "7x": 0.1534,
    "8x": 0.1659,
    "9x": 0.1784,
    "10x": 0.1909,
    "11x": 0.2034,
    "12x": 0.2159,
  },
];

// ---------- UI helpers ----------
function Stepper({ step, max }: { step: 1 | 2 | 3 | 4; max: 3 | 4 }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {Array.from({ length: max }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              step >= (s as any)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </div>
          {s < max && <div className="w-10 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground animate-spin" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

// ---------- Steps ----------
function MethodStep({
  method,
  setMethod,
}: {
  method: PayMethod;
  setMethod: (m: PayMethod) => void;
}) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Forma de pagamento</Label>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={method === "card" ? "default" : "outline"}
          onClick={() => setMethod("card")}
          className="h-12"
        >
          Cartão de crédito
        </Button>
        <Button
          type="button"
          variant={method === "pix" ? "default" : "outline"}
          onClick={() => setMethod("pix")}
          className="h-12"
        >
          Pix
        </Button>
      </div>
    </div>
  );
}

function PersonalStep({
  method,
  name,
  setName,
  cpfView,
  setCpfRaw,
  setCpfView,
  email,
  setEmail,
  phoneView,
  setPhoneRaw,
  setPhoneView,
  street,
  setStreet,
  number,
  setNumber,
  complement,
  setComplement,
  neighborhood,
  setNeighborhood,
  zipView,
  setZipRaw,
  setZipView,
  city,
  setCity,
  ufView,
  setUfRaw,
  setUfView,
  countryView,
  setCountryRaw,
  setCountryView,
}: any) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Dados pessoais</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Nome</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input
            value={cpfView}
            onChange={(e) => {
              const d = onlyDigits(e.target.value).slice(0, 11);
              setCpfRaw(d);
              setCpfView(maskCPF(d));
            }}
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {method === "card" && (
          <>
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <Label>Telefone (DDI+DDD+número)</Label>
              <Input
                value={phoneView}
                onChange={(e) => {
                  const d = onlyDigits(e.target.value).slice(0, 14);
                  setPhoneRaw(d);
                  setPhoneView(d);
                }}
                placeholder="554999999999"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <Separator className="md:col-span-2" />

            <div>
              <Label>Rua</Label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rua das Palmeiras"
              />
            </div>
            <div>
              <Label>Número</Label>
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="123"
              />
            </div>
            <div>
              <Label>Complemento</Label>
              <Input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto 502"
              />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Centro"
              />
            </div>

            <div>
              <Label>CEP</Label>
              <Input
                value={zipView}
                onChange={(e) => {
                  const d = onlyDigits(e.target.value).slice(0, 8);
                  setZipRaw(d);
                  setZipView(maskCEP(d));
                }}
                placeholder="88010-000"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Florianópolis"
              />
            </div>
            <div>
              <Label>UF</Label>
              <Input
                value={ufView}
                onChange={(e) => {
                  const v = e.target.value.toUpperCase().slice(0, 2);
                  setUfRaw(v);
                  setUfView(v);
                }}
                placeholder="SC"
                maxLength={2}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <Label>País</Label>
              <Input
                value={countryView}
                onChange={(e) => {
                  const v = e.target.value.toUpperCase();
                  setCountryRaw(v);
                  setCountryView(v);
                }}
                placeholder="BR"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardStep({
  amountBase,
  installmentOptions,
  installments,
  setInstallments,
  currentPer,
  currentTotal,
  currentFee,
  currentRate,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExp,
  setCardExp,
  cardCvv,
  setCardCvv,
  canPayCard,
  handlePayCard,
  paying,
}: any) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Pagamento no cartão</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <Label>Número do cartão</Label>
          <Input
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4111 1111 1111 1111"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            disabled={paying}
          />
        </div>
        <div>
          <Label>Nome impresso</Label>
          <Input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="APROVADO"
            autoComplete="off"
            spellCheck={false}
            disabled={paying}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Validade (MM/AA)</Label>
            <Input
              value={cardExp}
              onChange={(e) => setCardExp(formatExpiry(e.target.value))}
              placeholder="12/26"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              disabled={paying}
            />
          </div>
          <div>
            <Label>CVV</Label>
            <Input
              value={cardCvv}
              onChange={(e) =>
                setCardCvv(onlyDigits(e.target.value).slice(0, 4))
              }
              placeholder="123"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              disabled={paying}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Parcelas</Label>
          <select
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            disabled={paying}
          >
            {installmentOptions.map((opt: any) => (
              <option key={opt.n} value={opt.n}>
                {opt.n}x de {BRL(opt.per)} (total {BRL(opt.total)})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            Valor base: <b>{BRL(amountBase)}</b> • Taxa (
            {(currentRate * 100).toFixed(2)}%): <b>{BRL(currentFee)}</b> • Total
            com taxa: <b>{BRL(currentTotal)}</b>
          </p>
        </div>

        <div className="md:col-span-2">
          <Button
            className="w-full h-11"
            disabled={!canPayCard || paying}
            aria-busy={paying}
            onClick={handlePayCard}
          >
            {paying ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Processando…
              </span>
            ) : (
              `Pagar ${installments}x de ${BRL(currentPer)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PixStep({ pixData, loading, pixCountdown, copyTxt, genPix }: any) {
  return (
    <div className="space-y-4">
      <Label className="text-base">Pague com Pix</Label>
      <div className="space-y-3">
        {!pixData && (
          <Spinner
            label={loading ? "Gerando QR Code..." : "Preparando Pix..."}
          />
        )}

        {pixData?.qr_code_base64 && (
          <img
            src={`data:image/png;base64,${pixData.qr_code_base64}`}
            alt="QR Code Pix"
            className="mx-auto w-56 h-56"
          />
        )}

        <div>
          <Label>Copia e Cola</Label>
          <div className="flex gap-2">
            <Input readOnly value={pixData?.copia_cola || ""} />
            <Button
              type="button"
              variant="secondary"
              onClick={() => copyTxt(pixData?.copia_cola)}
              disabled={!pixData || loading}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Expira em:{" "}
            {pixCountdown > 0
              ? `${String(Math.floor(pixCountdown / 60)).padStart(
                  2,
                  "0"
                )}:${String(pixCountdown % 60).padStart(2, "0")}`
              : "expirado"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={genPix} disabled={loading}>
            {loading ? "Gerando..." : "Gerar novo Pix"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FinalStep({ approved }: { approved: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3">
      {approved ? (
        <>
          <CheckCircle2 className="w-12 h-12 text-green-600" />
          <div className="text-lg font-semibold">Pagamento aprovado</div>
          <div className="text-sm text-muted-foreground">Redirecionando…</div>
        </>
      ) : (
        <Spinner label="Processando pagamento…" />
      )}
    </div>
  );
}

// ---------- PaymentModal ----------
export function PaymentModal({ open, onOpenChange, amount, metadata }: Props) {
  const { toast } = useToast();

  // fluxo
  const [method, setMethod] = useState<PayMethod>("card");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  // dados
  const [name, setName] = useState("");
  const [cpfRaw, setCpfRaw] = useState("");
  const [cpfView, setCpfView] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneView, setPhoneView] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [zipRaw, setZipRaw] = useState("");
  const [zipView, setZipView] = useState("");
  const [city, setCity] = useState("");
  const [ufRaw, setUfRaw] = useState("SC");
  const [ufView, setUfView] = useState("SC");
  const [countryRaw, setCountryRaw] = useState("BR");
  const [countryView, setCountryView] = useState("BR");

  // cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [paying, setPaying] = useState(false);

  // Pix
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any | null>(null);
  const [pixCountdown, setPixCountdown] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // SSE + Polling
  const esRef = useRef<EventSource | null>(null);
  const pollRef = useRef<number | null>(null);
  const closeSSE = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  };
  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // ======= parcelas com taxa =======
  const ratesObj = installmentsOpt[0] as Record<string, number>;
  const installmentOptions = useMemo(() => {
    const opts: {
      n: number;
      per: number;
      total: number;
      fee: number;
      rate: number;
    }[] = [];
    for (let n = 1; n <= MAX_INSTALLMENTS; n++) {
      const rate = ratesObj[`${n}x`] ?? 0;
      const fee = Math.round(amount * rate);
      const total = amount + fee;
      const per = Math.round(total / n);
      if (per >= MIN_INSTALLMENT_CENTS) {
        opts.push({ n, per, total, fee, rate });
      }
    }
    if (!opts.length) {
      const rate = ratesObj["1x"] ?? 0;
      const fee = Math.round(amount * rate);
      opts.push({ n: 1, per: amount + fee, total: amount + fee, fee, rate });
    }
    return opts;
  }, [amount, ratesObj]);

  useEffect(() => {
    if (!installmentOptions.find((o) => o.n === installments))
      setInstallments(installmentOptions[0]?.n ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installmentOptions]);

  const current = useMemo(
    () =>
      installmentOptions.find((o) => o.n === installments) ||
      installmentOptions[0],
    [installmentOptions, installments]
  );
  const curRate = current?.rate ?? 0;
  const curFee = current?.fee ?? 0;
  const curTotal = current?.total ?? amount;
  const curPer = current?.per ?? amount;

  // consolidados
  const cpf = cpfRaw;
  const phone = phoneRaw;
  const zip = zipRaw;
  const uf = ufRaw.toUpperCase();
  const country = (countryRaw || "BR").toUpperCase();
  const address =
    method === "card"
      ? {
          street,
          number,
          complement: complement || undefined,
          neighborhood: neighborhood || undefined,
          zip_code: zip,
          city,
          state: uf,
          country,
        }
      : undefined;

  const canNextFromStep1 = !!method;
  const canNextFromStep2 =
    method === "card"
      ? !!(
          name &&
          email &&
          cpf.length === 11 &&
          phone.length >= 10 &&
          address?.street &&
          address?.number &&
          address?.zip_code?.length === 8 &&
          address?.city &&
          address?.state?.length === 2 &&
          address?.country
        )
      : !!(name && cpf.length === 11);
  const canPayCard = !!(
    name &&
    email &&
    cpf.length === 11 &&
    cardNumber &&
    cardName &&
    cardExp &&
    cardCvv
  );

  // Pix countdown
  useEffect(() => {
    if (!pixData?.expires_at) return;
    const expiry =
      typeof pixData.expires_at === "string"
        ? new Date(pixData.expires_at).getTime()
        : (pixData.expires_at as number);
    const tick = () => {
      const now = Date.now();
      const delta = Math.max(0, Math.floor((expiry - now) / 1000));
      setPixCountdown(delta);
      if (delta <= 0 && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    tick();
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(tick, 1000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [pixData?.expires_at]);

  // === SSE + Polling ===
  function onPaid() {
    setApproved(true);
    setStep(4);
    toast({
      title: "Pagamento aprovado",
      description: "Tudo certo! Liberando acesso…",
    });
    setPaying(false);
    closeSSE();
    stopPolling();
    setTimeout(() => {
      onOpenChange(false);
      window.location.href = "/dashboard";
    }, 5000);
  }

  function startPolling(id: string) {
    stopPolling();
    pollRef.current = window.setInterval(async () => {
      try {
        const st = await payments.status(id);
        if ((st?.order_status || "").toLowerCase() === "paid") onPaid();
      } catch {
        /* ignora */
      }
    }, 5000) as unknown as number;
  }

  function startSSE(id: string, moveToStep4 = true) {
    if (esRef.current && (esRef.current as any).__orderId === id) return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    setOrderId(id);
    if (moveToStep4) {
      setStep(4); // mostra “processando…”
      setApproved(false);
    }

    startPolling(id); // fallback

    const es = new EventSource(payments.sseUrl(id));
    (es as any).__orderId = id;
    esRef.current = es;

    es.onopen = () => console.debug("[SSE] open", id);

    es.onmessage = (ev) => {
      let payload: any;
      try {
        payload = JSON.parse(ev.data);
      } catch {
        return;
      }
      const raw =
        payload?.status ??
        payload?.order_status ??
        payload?.charge_status ??
        "";
      const status = String(raw).toLowerCase();

      const approvedStatuses = ["paid", "captured", "approved", "succeeded"];
      if (approvedStatuses.includes(status)) {
        onPaid();
        return;
      }
      if (["failed", "canceled", "refused"].includes(status)) {
        es.close();
        esRef.current = null;
        stopPolling();
        setPaying(false);
        setStep(3);
        toast({
          variant: "destructive",
          title: "Pagamento não aprovado",
          description: "Tente novamente.",
        });
      }
    };

    es.onerror = (e) => {
      console.warn("[SSE] error", e);
      // polling segura
    };
  }

  function resetAll() {
    setMethod("card");
    setStep(1);
    setApproved(false);
    setOrderId(null);
    setPixData(null);
    setPixCountdown(0);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setName("");
    setCpfRaw("");
    setCpfView("");
    setPhoneRaw("");
    setPhoneView("");
    setEmail("");
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setZipRaw("");
    setZipView("");
    setCity("");
    setUfRaw("SC");
    setUfView("SC");
    setCountryRaw("BR");
    setCountryView("BR");
    setCardNumber("");
    setCardName("");
    setCardExp("");
    setCardCvv("");
    setInstallments(1);
    setPaying(false);
    closeSSE();
    stopPolling();
  }

  // ações
  async function handlePayCard() {
    setApproved(false);
    setStep(3); // já vai para o step de pagamento, e em seguida o SSE coloca no 4
    setPaying(true); // evita spam
    try {
      const exp = onlyDigits(cardExp);
      if (exp.length !== 4) throw new Error("Validade inválida (use MM/AA)");
      const exp_month = exp.slice(0, 2);
      const exp_year = "20" + exp.slice(2);
      const card_token = await tokenizeCardBrowser({
        number: onlyDigits(cardNumber),
        holder_name: cardName,
        exp_month,
        exp_year,
        cvv: onlyDigits(cardCvv),
      });

      // cobrar já com a taxa do gateway embutida
      const chargedAmount = curTotal;

      const resp = await payments.charge({
        amount: chargedAmount,
        card_token,
        installments,
        customer: { name, email, document: cpf, phone, address },
        billingAddress: address,
        metadata: { ...(metadata || {}), fee_rate: curRate, fee_cents: curFee },
        description: metadata?.plan || "Cobrança",
      });
      const data = resp?.data;
      const id = data?.id || data?.data?.id || data?.order_id;
      if (!id) throw new Error("Pedido criado, mas sem ID");
      startSSE(id, true);
    } catch (e: any) {
      console.error("[handlePayCard] error:", e?.response?.data || e);
      setPaying(false);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: e?.message || "Falha ao processar pagamento",
      });
    }
  }

  async function genPix() {
    setPixData(null);
    setLoading(true);
    try {
      if (!name || cpf.length !== 11) {
        throw new Error("Preencha nome e CPF (11 dígitos).");
      }
      const { data } = await payments.pix({
        amount,
        description: metadata?.plan || "Cobrança Pix",
        metadata: metadata || {},
        customer: { name, document: cpf },
      });
      const normalized = data?.data ?? data;
      setPixData(normalized);

      // assina SSE mas mantém no passo 3 (QR visível)
      if (normalized?.order_id) startSSE(normalized.order_id, false);

      // countdown
      const exp = normalized?.expires_at
        ? new Date(normalized.expires_at).getTime()
        : 0;
      if (exp > 0) {
        const delta = Math.max(0, Math.floor((exp - Date.now()) / 1000));
        setPixCountdown(delta);
      }
    } catch (e: any) {
      console.error("[genPix] error:", e?.response?.data || e);
      toast({
        variant: "destructive",
        title: "Erro ao gerar Pix",
        description:
          e?.response?.data?.message || e?.message || "Falha ao gerar Pix",
      });
    } finally {
      setLoading(false);
    }
  }

  // gera Pix automaticamente ao entrar no passo 3 (modo Pix)
  useEffect(() => {
    if (open && step === 3 && method === "pix" && !pixData && !loading) {
      genPix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, method]);

  useEffect(() => {
    if (!open) resetAll();
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetAll();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {method === "card" ? "Pagamento — Cartão" : "Pagamento — Pix"} •{" "}
            {BRL(amount)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Stepper step={step} max={4} />

          {step === 1 && <MethodStep method={method} setMethod={setMethod} />}

          {step === 2 && (
            <PersonalStep
              method={method}
              name={name}
              setName={setName}
              cpfView={cpfView}
              setCpfRaw={setCpfRaw}
              setCpfView={setCpfView}
              email={email}
              setEmail={setEmail}
              phoneView={phoneView}
              setPhoneRaw={setPhoneRaw}
              setPhoneView={setPhoneView}
              street={street}
              setStreet={setStreet}
              number={number}
              setNumber={setNumber}
              complement={complement}
              setComplement={setComplement}
              neighborhood={neighborhood}
              setNeighborhood={setNeighborhood}
              zipView={zipView}
              setZipRaw={setZipRaw}
              setZipView={setZipView}
              city={city}
              setCity={setCity}
              ufView={ufView}
              setUfRaw={setUfRaw}
              setUfView={setUfView}
              countryView={countryView}
              setCountryRaw={setCountryRaw}
              setCountryView={setCountryView}
            />
          )}

          {step === 3 &&
            (method === "card" ? (
              <CardStep
                amountBase={amount}
                installmentOptions={installmentOptions}
                installments={installments}
                setInstallments={setInstallments}
                currentPer={curPer}
                currentTotal={curTotal}
                currentFee={curFee}
                currentRate={curRate}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                cardExp={cardExp}
                setCardExp={setCardExp}
                cardCvv={cardCvv}
                setCardCvv={setCardCvv}
                canPayCard={canPayCard}
                handlePayCard={handlePayCard}
                paying={paying}
              />
            ) : (
              <PixStep
                pixData={pixData}
                loading={!pixData || loading}
                pixCountdown={pixCountdown}
                copyTxt={async (t?: string) => {
                  if (!t) return;
                  await navigator.clipboard.writeText(t);
                }}
                genPix={genPix}
              />
            ))}

          {step === 4 && <FinalStep approved={approved} />}

          <Separator />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}
              disabled={step === 1}
            >
              Voltar
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                disabled={
                  (step === 1 && !canNextFromStep1) ||
                  (step === 2 && !canNextFromStep2)
                }
              >
                Avançar
              </Button>
            ) : method === "card" ? null : (
              <div />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
