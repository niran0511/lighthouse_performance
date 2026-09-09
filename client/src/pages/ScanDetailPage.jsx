import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ScanReport } from '../components/ScanReport.jsx';
import { api, readApiError } from '../services/api.js';

export function ScanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [error, setError] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const getScan = useCallback(async () => {
    try { const { data } = await api.get(`/scans/${id}`); setScan(data.scan); } catch (requestError) { setError(readApiError(requestError, 'Unable to open this report.')); }
  }, [id]);
  useEffect(() => { getScan(); }, [getScan]);
  useEffect(() => {
    if (!scan || !['PENDING', 'RUNNING'].includes(scan.status)) return undefined;
    const timer = window.setInterval(getScan, 3_000);
    return () => window.clearInterval(timer);
  }, [scan?.status, getScan]);
  const retry = async () => { setIsWorking(true); try { const { data } = await api.post(`/scans/${id}/retry`); setScan(data.scan); } catch (requestError) { setError(readApiError(requestError)); } finally { setIsWorking(false); } };
  const remove = async () => { if (!window.confirm('Delete this scan report? This cannot be undone.')) return; setIsWorking(true); try { await api.delete(`/scans/${id}`); navigate('/history'); } catch (requestError) { setError(readApiError(requestError)); } finally { setIsWorking(false); } };
  if (error && !scan) return <section className="empty-state"><h2>Report unavailable</h2><p>{error}</p><Link className="button secondary" to="/history">Back to history</Link></section>;
  if (!scan) return <div className="loading-state"><span className="loader" /> Loading report…</div>;
  return <><section className="detail-title"><div><Link className="back-link" to="/history">← Scan history</Link><span className="eyebrow">Detailed analysis</span><h1>Performance report</h1></div><div className="detail-actions">{scan.status === 'FAILED' && <button type="button" className="button primary" onClick={retry} disabled={isWorking}>Retry scan</button>}<button type="button" className="button danger-outline" onClick={remove} disabled={isWorking}>Delete</button></div></section>{error ? <div className="page-error" role="alert">{error}</div> : null}<section className="dashboard-report full-report"><ScanReport scan={scan} /></section></>;
}

