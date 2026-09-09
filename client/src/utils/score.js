export function classifyScore(score) {
  if (!Number.isFinite(score)) return { label: 'Unavailable', tone: 'neutral' };
  if (score >= 90) return { label: 'Good', tone: 'good' };
  if (score >= 50) return { label: 'Needs improvement', tone: 'warning' };
  return { label: 'Poor', tone: 'danger' };
}

export function scoreColor(score) {
  return classifyScore(score).tone;
}

