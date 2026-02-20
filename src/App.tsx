import { lazy, Suspense, useEffect } from 'react';
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
const BudgetManagement = lazy(() => import('./pages/BudgetManagement'));
const PendingValidation = lazy(() => import('./pages/PendingValidation'));

import { useFinanceStore } from './store/financeStore';

function App() {
  const setOnlineStatus = useFinanceStore(state => state.setOnlineStatus);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending" element={<ProtectedRoute><PendingValidation /></ProtectedRoute>} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ui-demo" element={<UIDemo />} />
                
                {/* Finance - Admin & RAF */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RAF']} />}>
                  <Route path="/finance" element={<FinancialHub />} />
                  <Route path="/finance/budget" element={<BudgetManagement />} />
                </Route>

                {/* HR & Payroll - Admin, RH, RAF */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RH', 'RAF']} />}>
                  <Route path="/hr" element={<HR />} />
                </Route>

                {/* Operations - Admin & Manager */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                  <Route path="/operations" element={<FieldOps />} />
                </Route>

                {/* Logistics - Admin, Manager, Staff */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']} />}>
                  <Route path="/logistics" element={<Logistics />} />
                </Route>

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/technical" element={<Technical />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
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
