import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import Card from '../../components/Card';
import { dashboardService } from '../../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProdutos: 0,
    estoqueAtual: 0,
    valorEstoque: 0,
    produtosBaixoEstoque: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStatistics();
      setStats(data);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Activity className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem' }}>Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            <AlertTriangle size={32} />
            <p style={{ marginTop: '1rem' }}>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={loadDashboardData}
              style={{ marginTop: '1rem' }}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Dashboard HortiFlow
        </h1>
        <p style={{ color: '#64748b' }}>
          Visão geral do seu sistema de gestão de hortifruti
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <Card className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: '#dcfce7', 
              padding: '0.75rem', 
              borderRadius: '8px',
              color: '#16a34a'
            }}>
              <Package size={24} />
            </div>
            <div>
              <div className="stat-value">{stats.totalProdutos}</div>
              <div className="stat-label">Total de Produtos</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: '#dbeafe', 
              padding: '0.75rem', 
              borderRadius: '8px',
              color: '#2563eb'
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="stat-value">{stats.estoqueAtual}</div>
              <div className="stat-label">Estoque Atual</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: '#fef3c7', 
              padding: '0.75rem', 
              borderRadius: '8px',
              color: '#d97706'
            }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <div className="stat-value">R$ {stats.valorEstoque?.toFixed(2) || '0,00'}</div>
              <div className="stat-label">Valor em Estoque</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: '#fecaca', 
              padding: '0.75rem', 
              borderRadius: '8px',
              color: '#dc2626'
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="stat-value">{stats.produtosBaixoEstoque}</div>
              <div className="stat-label">Estoque Baixo</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2">
        <Card>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
            Ações Rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/products')}>
              <Package size={16} />
              Adicionar Produto
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/clients')}>
              <Users size={16} />
              Novo Cliente
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/vendas')}>
              <ShoppingCart size={16} />
              Nova Venda
            </button>
          </div>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
            Status do Sistema
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Backend API</span>
              <span style={{ 
                color: '#16a34a', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#16a34a', 
                  borderRadius: '50%' 
                }} />
                Online
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Banco de Dados</span>
              <span style={{ 
                color: '#16a34a', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#16a34a', 
                  borderRadius: '50%' 
                }} />
                Conectado
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
