export async function tokenizeCardBrowser(p: {
  number: string; holder_name: string; exp_month: string; exp_year: string; cvv: string;
}) {
  const pk = import.meta.env.VITE_PAGARME_PUBLIC_KEY; // pk_test_... / pk_live_...
  if (!pk) throw new Error("Chave pública ausente (VITE_PAGARME_PUBLIC_KEY)");

  const url = `https://api.pagar.me/core/v5/tokens?appId=${encodeURIComponent(pk)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // nada de Authorization
    body: JSON.stringify({
      type: "card",
      card: {
        number: p.number.replace(/\D+/g, ""),
        holder_name: p.holder_name,
        exp_month: p.exp_month,
        exp_year: p.exp_year,
        cvv: p.cvv,
      },
    }),
    mode: "cors",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Tokenização falhou (${res.status}): ${body}`);
  }
  const data = await res.json(); // { id: 'token_xxx', ... }
  if (!data?.id) throw new Error("Token inválido");
  return data.id as string;
}
