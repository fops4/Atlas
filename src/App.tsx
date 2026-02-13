import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoader } from './components/ui/LoadingSpinner';

// Eager load authentication pages (needed immediately)
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load main application pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FinancialHub = lazy(() => import('./pages/FinancialHub'));
const HR = lazy(() => import('./pages/HR'));
const FieldOps = lazy(() => import('./pages/FieldOps'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Technical = lazy(() => import('./pages/Technical'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UIDemo = lazy(() => import('./pages/UIDemo'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/finance" element={<FinancialHub />} />
                <Route path="/hr" element={<HR />} />
                <Route path="/operations" element={<FieldOps />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/technical" element={<Technical />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ui-demo" element={<UIDemo />} />
              </Route>
            </Route>
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
