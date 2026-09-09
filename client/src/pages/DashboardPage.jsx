import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanForm } from '../components/ScanForm.jsx';
import { ScanReport } from '../components/ScanReport.jsx';
import { api, readApiError } from '../services/api.js';

export function DashboardPage() {
  const [scans, setScans] = useState([]);
  const [currentScan, setCurrentScan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadScans = useCallback(async () => {
    try {
      const { data } = await api.get('/scans', { params: { limit: 8 } });
      setScans(data.scans);
      setCurrentScan((selected) => selected || data.scans[0] || null);
    } catch (requestError) { setError(readApiError(requestError, 'Unable to load your scan history.')); } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { loadScans(); }, [loadScans]);

  useEffect(() => {
    if (!currentScan || !['PENDING', 'RUNNING'].includes(currentScan.status)) return undefined;
    const poll = async () => {
      try {
        const { data } = await api.get(`/scans/${currentScan._id}`);
        setCurrentScan(data.scan);
        setScans((items) => [data.scan, ...items.filter((item) => item._id !== data.scan._id)]);
      } catch (requestError) { setError(readApiError(requestError)); }
    };
    const timer = window.setInterval(poll, 3_000);
    return () => window.clearInterval(timer);
  }, [currentScan?._id, currentScan?.status]);

  const submitScan = async (url) => {
    setIsSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/scans', { url });
      setCurrentScan(data.scan);
      setScans((items) => [data.scan, ...items.filter((item) => item._id !== data.scan._id)]);
    } catch (requestError) { throw readApiError(requestError, 'Unable to queue the scan.'); } finally { setIsSubmitting(false); }
  };

  return <>
    <section className="page-title"><div><span className="eyebrow">Performance workspace</span><h1>Good morning.</h1><p>Keep your web experience fast, stable, and easy to use.</p></div>{scans.length > 0 && <Link className="button secondary" to="/history">View all scans <span>→</span></Link>}</section>
    <section className="scanner-panel"><div className="scanner-copy"><span className="scanner-icon">◌</span><div><h2>Run a new analysis</h2><p>Get desktop Lighthouse diagnostics and prioritized implementation guidance.</p></div></div><ScanForm onSubmit={submitScan} isScanning={isSubmitting || ['PENDING', 'RUNNING'].includes(currentScan?.status)} /></section>
    {error ? <div className="page-error" role="alert">{error}</div> : null}
    {isLoading ? <div className="loading-state"><span className="loader" /> Loading your performance workspace…</div> : null}
    {!isLoading && !currentScan ? <section className="empty-state"><div className="empty-orb">⌁</div><h2>Your first report starts here</h2><p>Enter a public website URL above to collect Lighthouse scores, Web Vitals, and actionable fixes.</p></section> : null}
    {currentScan ? <section className="dashboard-report"><ScanReport scan={currentScan} /><div className="report-footer"><Link to={`/scan/${currentScan._id}`}>Open full report <span>→</span></Link></div></section> : null}
  </>;
}

