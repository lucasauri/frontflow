import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Vendas from './pages/Vendas';
import './styles/global.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className="main-content">
          <Navbar 
            onMenuToggle={toggleSidebar}
            isMenuOpen={sidebarOpen}
            user={{ name: 'Admin', email: 'admin@hortiflow.com' }}
            onLogout={() => console.log('Logout')}
          />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/vendas" element={<Vendas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
