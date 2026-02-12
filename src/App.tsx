import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FinancialHub from './pages/FinancialHub';
import HR from './pages/HR';
import FieldOps from './pages/FieldOps';
import Logistics from './pages/Logistics';
import Technical from './pages/Technical';

function App() {
  return (
    <Router>
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
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
