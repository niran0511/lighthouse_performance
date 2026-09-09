import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { AppShell } from './components/AppShell.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ScanDetailPage } from './pages/ScanDetailPage.jsx';

function ProtectedPage({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="app-loader"><span className="loader" /> Restoring your workspace…</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <AppShell>{children}</AppShell>;
}

export function App() {
  return <Routes><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/dashboard" element={<ProtectedPage><DashboardPage /></ProtectedPage>} /><Route path="/history" element={<ProtectedPage><HistoryPage /></ProtectedPage>} /><Route path="/scan/:id" element={<ProtectedPage><ScanDetailPage /></ProtectedPage>} /><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="*" element={<ProtectedPage><NotFoundPage /></ProtectedPage>} /></Routes>;
}

