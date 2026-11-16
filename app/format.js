export function timeLeft(iso) {
  const ms = Date.parse(iso) - Date.now();
  if (!Number.isFinite(ms)) return 'No deadline';
  if (ms <= 0) return 'closed';
  const hours = Math.floor(ms / 3600000);
  return hours >= 24 ? `${Math.floor(hours / 24)}d ${hours % 24}h` : hours ? `${hours}h ${Math.floor(ms / 60000) % 60}m` : `${Math.max(1, Math.ceil(ms / 60000))}m`;
}
export const formatPot = amount => '$' + Number(amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
export const formatFee = fee => Number(fee) > 0 ? '$' + Number(fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Free';
export const shortNum = n => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n || 0));
