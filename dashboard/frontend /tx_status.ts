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
