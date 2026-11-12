export function txStatusText(tx: {
  paid_status?: number;
  tx_confirmations?: number;
  required_confirmations?: number;
}): string {
  if (tx.paid_status === 1) return "Confirmed";
  const got = tx.tx_confirmations ?? 0;
  const need = tx.required_confirmations ?? 0;
  return `${got}/${need} confirmations`;
}

export function txStatusClass(tx: { paid_status?: number }): string {
  return tx.paid_status === 1 ? "confirmed" : "pending";
}

export function timeAgo(dateString: string): string {
  // db stores utc without zone, parse as utc not local
  const iso = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T") + "Z";
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function atomicToXmr(amount: bigint): string {
  if (amount < 0n) amount = -amount;
  const s = amount.toString().padStart(13, "0");
  const whole = s.slice(0, -12).replace(/^0+(?=\d)/, "");
  const frac = s.slice(-12).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}
