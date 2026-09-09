export function classifyScore(score) {
  const normalized = Number(score);
  if (!Number.isFinite(normalized)) return 'UNKNOWN';
  if (normalized >= 90) return 'GOOD';
  if (normalized >= 50) return 'NEEDS_IMPROVEMENT';
  return 'POOR';
}

export function percentageScore(score) {
  if (!Number.isFinite(score)) return null;
  return Math.round(score <= 1 ? score * 100 : score);
}

