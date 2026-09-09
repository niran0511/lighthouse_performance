import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanStatus } from '../components/ScanStatus.jsx';
import { api, readApiError } from '../services/api.js';
import { formatDate, truncateUrl } from '../utils/format.js';

export function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { try { const { data } = await api.get('/scans', { params: { limit: 100 } }); setScans(data.scans); } catch (requestError) { setError(readApiError(requestError)); } finally { setIsLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const remove = async (id) => { if (!window.confirm('Delete this scan report? This cannot be undone.')) return; try { await api.delete(`/scans/${id}`); setScans((items) => items.filter((scan) => scan._id !== id)); } catch (requestError) { setError(readApiError(requestError)); } };
  return <><section className="page-title"><div><span className="eyebrow">Your archive</span><h1>Scan history</h1><p>Review completed analyses and track your performance baseline.</p></div><Link className="button primary" to="/dashboard">New scan <span>→</span></Link></section>{error && <div className="page-error" role="alert">{error}</div>}{isLoading ? <div className="loading-state"><span className="loader" /> Loading your reports…</div> : scans.length === 0 ? <section className="empty-state"><div className="empty-orb">◷</div><h2>No reports yet</h2><p>Run your first Lighthouse scan to build a performance history.</p><Link className="button primary" to="/dashboard">Run a scan</Link></section> : <section className="history-panel"><div className="history-summary"><span>{scans.length} saved {scans.length === 1 ? 'scan' : 'scans'}</span><span>Newest first</span></div><div className="table-wrap"><table><thead><tr><th>Website</th><th>Performance</th><th>Accessibility</th><th>SEO</th><th>Status</th><th>Date</th><th aria-label="Actions" /></tr></thead><tbody>{scans.map((scan) => <tr key={scan._id}><td><Link className="url-link" to={`/scan/${scan._id}`} title={scan.url}>{truncateUrl(scan.url, 42)}</Link></td><td><span className={`table-score ${scan.performanceScore >= 90 ? 'good' : scan.performanceScore >= 50 ? 'warning' : 'danger'}`}>{scan.performanceScore ?? '—'}</span></td><td>{scan.accessibilityScore ?? '—'}</td><td>{scan.seoScore ?? '—'}</td><td><ScanStatus status={scan.status} /></td><td>{formatDate(scan.createdAt)}</td><td><div className="table-actions"><Link to={`/scan/${scan._id}`} aria-label="Open scan">→</Link><button type="button" onClick={() => remove(scan._id)} aria-label="Delete scan">×</button></div></td></tr>)}</tbody></table></div></section>}</>;
}

