import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from './Logo.jsx';

const links = [
  { to: '/dashboard', label: 'Overview', icon: '◫' },
  { to: '/history', label: 'Scan history', icon: '◷' },
];

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map((name) => name[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/dashboard"><Logo /><span>Lighthouse<span>Monitor</span></span></NavLink>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span>{link.icon}</span>{link.label}</NavLink>)}
        </nav>
        <div className="sidebar-note"><span className="live-dot" /> Live analysis<br /><small>Powered by Lighthouse</small></div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><Logo /><span>Lighthouse Monitor</span></div>
          <div className="account-menu"><span className="avatar">{initials}</span><div><strong>{user?.name}</strong><small>{user?.email}</small></div><button type="button" className="button-icon" onClick={handleLogout} aria-label="Log out" title="Log out">⇥</button></div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

