const labels = {
  PENDING: 'Preparing scan', RUNNING: 'Analysis in progress', COMPLETED: 'Analysis complete', FAILED: 'Scan failed',
};

export function ScanStatus({ status }) {
  const normalized = status || 'PENDING';
  return <span className={`status-pill ${normalized.toLowerCase()}`}><i />{labels[normalized] || normalized}</span>;
}

