export function MetricCard({ label, value, target, tone = 'neutral' }) {
  return <article className="metric-card"><div className={`metric-dot ${tone}`} /><div><p>{label}</p><strong>{value}</strong><small>{target}</small></div></article>;
}

