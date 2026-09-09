import { useState } from 'react';

function validateUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? '' : 'Only HTTP and HTTPS URLs can be scanned.';
  } catch {
    return 'Enter a complete URL, such as https://example.com.';
  }
}

export function ScanForm({ onSubmit, isScanning = false }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateUrl(url.trim());
    if (validationError) { setError(validationError); return; }
    setError('');
    await onSubmit(url.trim()).catch((message) => setError(message));
  };
  return <form className="scan-form" onSubmit={handleSubmit} noValidate>
    <label htmlFor="scan-url">Website URL</label>
    <div className="url-input-wrap"><span aria-hidden="true">⌁</span><input id="scan-url" type="url" inputMode="url" placeholder="https://example.com" value={url} onChange={(event) => setUrl(event.target.value)} disabled={isScanning} aria-describedby={error ? 'url-error' : undefined} /><button className="button primary" disabled={isScanning}>{isScanning ? 'Scanning…' : 'Run Lighthouse scan'} <span aria-hidden="true">→</span></button></div>
    {error ? <p id="url-error" className="field-error" role="alert">{error}</p> : <p className="field-hint">We scan public websites only. Private networks and local URLs are blocked.</p>}
  </form>;
}

