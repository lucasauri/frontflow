import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hortiflow.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data?.accessToken) {
        navigate('/');
      } else {
        setError(data?.message || 'Falha no login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0b1020' }}>
      <form onSubmit={handleSubmit} style={{ background: '#121832', padding: 24, borderRadius: 12, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color: '#fff', margin: 0, marginBottom: 16 }}>HortiFlow</h2>
        <p style={{ color: '#9aa4bf', marginTop: 0, marginBottom: 24 }}>Acesse sua conta</p>
        {error && (
          <div style={{ background: '#2b1533', color: '#ff86a5', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        )}
        <label style={{ color: '#c7d2fe', fontSize: 12 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginTop: 6, marginBottom: 14, padding: '10px 12px', borderRadius: 8, border: '1px solid #2a3759', background: '#0e1430', color: '#e5e7eb' }}
        />
        <label style={{ color: '#c7d2fe', fontSize: 12 }}>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginTop: 6, marginBottom: 18, padding: '10px 12px', borderRadius: 8, border: '1px solid #2a3759', background: '#0e1430', color: '#e5e7eb' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: 0, background: '#22c55e', color: '#0b1020', fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
