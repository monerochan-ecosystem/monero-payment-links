const KRAKEN_URL = "https://api.kraken.com/0/public/Ticker?pair=XMRUSD";
const REFRESH_MS = 30_000;

let rate: number | null = null;
let fetchedAt = 0;
let inFlight: Promise<number> | null = null;

export function clearRateCache() {
  rate = null;
  fetchedAt = 0;
  inFlight = null;
}

async function fetchRate(): Promise<number> {
  const res = await fetch(KRAKEN_URL);
  if (!res.ok) throw new Error("kraken http " + res.status);
  const price = Number((await res.json())?.result?.XXMRZUSD?.c?.[0]);
  if (!(price > 0)) throw new Error("bad kraken price");
  rate = price;
  fetchedAt = Date.now();
  return price;
}

export async function getXmrUsdRate(): Promise<number> {
  if (rate != null && Date.now() - fetchedAt < REFRESH_MS) return rate;
  if (inFlight) return inFlight;
  inFlight = fetchRate().finally(() => {
    inFlight = null;
  });
  try {
    return await inFlight;
  } catch (e) {
    if (rate != null) return rate;
    throw e;
  }
}

export async function amountForCheckout(link: {
  amount: string;
  currency?: string | null;
}): Promise<string> {
  const n = Number(link.amount);
  if (!(n > 0)) throw new Error("bad amount");
  if ((link.currency ?? "XMR").toUpperCase() !== "USD") return String(n);
  return String(n / (await getXmrUsdRate()));
}

export function formatLinkAmountDisplay(link: {
  amount?: string | null;
  currency?: string | null;
}): string {
  const amount = (link.amount ?? "").trim() || "0";
  if ((link.currency ?? "XMR").toUpperCase() === "USD") return `$${amount}`;
  return `${amount} XMR`;
}
