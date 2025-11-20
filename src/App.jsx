import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Vendas from './pages/Vendas';
import Relatorios from './pages/Relatorios';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/Login';
import { authService } from './services/authService';
import './styles/global.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app">
      {!isLogin && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

      <div className="main-content">
        {!isLogin && (
          <Navbar
            onMenuToggle={toggleSidebar}
            isMenuOpen={sidebarOpen}
            onLogout={handleLogout}
          />
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendas"
            element={
              <ProtectedRoute>
                <Vendas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute>
                <Relatorios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
