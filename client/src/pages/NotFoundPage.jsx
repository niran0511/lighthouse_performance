import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <section className="empty-state"><div className="empty-orb">?</div><h2>That page does not exist</h2><p>Let’s get you back to performance monitoring.</p><Link className="button primary" to="/dashboard">Go to dashboard</Link></section>;
}

