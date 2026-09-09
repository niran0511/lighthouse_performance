import { ScoreCard } from './ScoreCard.jsx';
import { MetricCard } from './MetricCard.jsx';
import { RecommendationList } from './RecommendationList.jsx';
import { ScanStatus } from './ScanStatus.jsx';
import { formatCls, formatDate, formatMilliseconds, formatSeconds } from '../utils/format.js';

export function ScanReport({ scan, compact = false }) {
  const metrics = scan.metrics || {};
  return <>
    <section className="report-head">
      <div><span className="eyebrow">{compact ? 'Latest report' : 'Scan report'}</span><h2>{scan.url}</h2><p>{formatDate(scan.createdAt)} · Desktop · Lighthouse {scan.lighthouseVersion || 'pending'}</p></div><ScanStatus status={scan.status} />
    </section>
    {scan.status === 'FAILED' ? <div className="report-error"><strong>We couldn’t complete this scan.</strong><p>{scan.error || 'Please try again in a moment.'}</p></div> : null}
    {scan.status !== 'COMPLETED' ? <div className="scan-progress"><div className="progress-orb" /><div><strong>{scan.status === 'PENDING' ? 'Initializing scan…' : 'Running Lighthouse…'}</strong><p>{scan.status === 'PENDING' ? 'Checking the target and preparing Chromium.' : 'Collecting metrics, audits, and recommendations. This can take a minute.'}</p></div></div> : <>
      <div className="score-grid"><ScoreCard label="Performance" score={scan.performanceScore} /><ScoreCard label="Accessibility" score={scan.accessibilityScore} /><ScoreCard label="Best practices" score={scan.bestPracticesScore} /><ScoreCard label="SEO" score={scan.seoScore} /></div>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">Field signals</span><h2>Core Web Vitals</h2></div><span className="caption">Lab data · Desktop</span></div><div className="metric-grid"><MetricCard label="Largest Contentful Paint" value={formatSeconds(metrics.lcp)} target="Target: ≤ 2.5 s" tone={metrics.lcp > 4 ? 'danger' : metrics.lcp > 2.5 ? 'warning' : 'good'} /><MetricCard label="Cumulative Layout Shift" value={formatCls(metrics.cls)} target="Target: ≤ 0.1" tone={metrics.cls > 0.25 ? 'danger' : metrics.cls > 0.1 ? 'warning' : 'good'} /><MetricCard label="First Contentful Paint" value={formatSeconds(metrics.fcp)} target="Target: ≤ 1.8 s" tone={metrics.fcp > 3 ? 'danger' : metrics.fcp > 1.8 ? 'warning' : 'good'} /><MetricCard label="Total Blocking Time" value={formatMilliseconds(metrics.tbt)} target="Target: ≤ 200 ms" tone={metrics.tbt > 600 ? 'danger' : metrics.tbt > 200 ? 'warning' : 'good'} /><MetricCard label="Speed Index" value={formatSeconds(metrics.speedIndex)} target="Lower is better" /></div></section>
      {!compact && <section className="panel recommendations-panel"><div className="panel-heading"><div><span className="eyebrow">Prioritized work</span><h2>Recommendations</h2></div><span className="caption">{scan.recommendations?.length || 0} findings</span></div><RecommendationList recommendations={scan.recommendations} /></section>}
    </>}
  </>;
}

