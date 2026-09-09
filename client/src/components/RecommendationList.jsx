export function RecommendationList({ recommendations = [] }) {
  if (!recommendations.length) return <div className="empty-inline"><span>✓</span><div><strong>No critical opportunities found</strong><p>This report has no actionable Lighthouse findings in the monitored audit set.</p></div></div>;
  return <div className="recommendation-list">{recommendations.map((item) => <article className="recommendation" key={item.auditId}><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span><div><h3>{item.issue}</h3><p className="impact">{item.impact}</p><p><strong>Recommended action</strong>{item.recommendation}</p></div></article>)}</div>;
}

