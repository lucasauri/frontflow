import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, User } from 'lucide-react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { clientsService } from '../../services/clientsService';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({ nome: '', cpf: '', estado: '', telefone: '', cnpj: '' });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error('Clients error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsService.delete(id);
        setClients(clients.filter(c => c.id !== id));
      } catch (err) {
        alert('Erro ao excluir cliente');
      }
    }
  };

  const handleNewClient = () => {
    setClientForm({ nome: '', cpf: '', estado: '', telefone: '', cnpj: '' });
    setIsClientModalOpen(true);
  };

  const handleEdit = (id) => {
    console.log('Editar cliente', id);
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      // Validação: Nome é obrigatório
      if (!clientForm.nome || !clientForm.nome.trim()) {
        alert('O nome é obrigatório');
        return;
      }

      // Validação: CPF é obrigatório
      if (!clientForm.cpf || !clientForm.cpf.trim()) {
        alert('O CPF é obrigatório');
        return;
      }

      // Remove formatação do CPF (pontos e traços) para validação
      const cpfLimpo = clientForm.cpf.replace(/[.-]/g, '').trim();
      
      // Validação básica de CPF (11 dígitos)
      if (cpfLimpo.length !== 11 || !/^\d+$/.test(cpfLimpo)) {
        alert('CPF inválido. Deve conter 11 dígitos');
        return;
      }

      const payload = {
        nome: clientForm.nome.trim(),
        cpf: cpfLimpo,
        estado: clientForm.estado && clientForm.estado.trim() ? clientForm.estado.trim() : null,
        telefone: clientForm.telefone && clientForm.telefone.trim() ? clientForm.telefone.trim() : null,
        cnpj: clientForm.cnpj && clientForm.cnpj.trim() ? clientForm.cnpj.trim() : null
      };

      console.log('Payload sendo enviado:', payload);

      const created = await clientsService.create(payload);
      setClients([created, ...clients]);
      setIsClientModalOpen(false);
      setClientForm({ nome: '', cpf: '', estado: '', telefone: '', cnpj: '' });
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      console.error('Detalhes completos do erro:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Erro ao criar cliente';
      
      // Prioriza mensagem do erro lançado pelo service (já processado)
      if (err.message) {
        errorMessage = err.message;
      }
      
      // Se não houver mensagem, tenta pegar do response
      if (err.response?.data) {
        const data = err.response.data;
        // Prioriza erros de campo específicos (mais detalhados)
        if (data.fieldErrors) {
          const fieldErrors = Object.entries(data.fieldErrors);
          if (fieldErrors.length > 0) {
            const [campo, mensagem] = fieldErrors[0];
            errorMessage = `${campo}: ${mensagem}`;
          }
        } else if (data.message && errorMessage === 'Erro ao criar cliente') {
          errorMessage = data.message;
        }
      }
      
      alert(`Erro ao criar cliente: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Users className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem' }}>Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <Modal
        title="Novo Cliente"
        open={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        footer={(
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsClientModalOpen(false)}>Cancelar</button>
            <button type="submit" form="client-form" className="btn btn-primary">Salvar</button>
          </>
        )}
      >
        <form id="client-form" onSubmit={handleCreateClient}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={clientForm.nome} onChange={(e) => setClientForm({ ...clientForm, nome: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input className="form-input" value={clientForm.cpf} onChange={(e) => setClientForm({ ...clientForm, cpf: e.target.value })} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <input className="form-input" value={clientForm.estado} onChange={(e) => setClientForm({ ...clientForm, estado: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2" style={{ gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input className="form-input" value={clientForm.telefone} onChange={(e) => setClientForm({ ...clientForm, telefone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">CNPJ</label>
              <input className="form-input" value={clientForm.cnpj} onChange={(e) => setClientForm({ ...clientForm, cnpj: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Clientes
          </h1>
          <p style={{ color: '#64748b' }}>
            Gerencie sua base de clientes
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNewClient}>
          <Plus size={16} />
          Novo Cliente
        </button>
      </div>

      {error && (
        <div className="card" style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca',
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} />
            {error}
          </div>
        </div>
      )}

      <Card>
        {clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Users size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Nenhum cliente encontrado</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Comece adicionando seu primeiro cliente
            </p>
            <button className="btn btn-primary">
              <Plus size={16} />
              Adicionar Cliente
            </button>
          </div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>CPF</th>
                  <th>Estado</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#22c55e',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{client.nome}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {client.email || 'Sem email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{client.cpf || '-'}</td>
                    <td>{client.estado || '-'}</td>
                    <td>{client.telefone || '-'}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: client.cnpj ? '#dbeafe' : '#f0fdf4',
                        color: client.cnpj ? '#2563eb' : '#16a34a'
                      }}>
                        {client.cnpj ? 'PJ' : 'PF'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button"
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem' }}
                          onClick={() => handleEdit(client.id)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          type="button"
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', color: '#dc2626' }}
                          onClick={() => handleDelete(client.id)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Clients;
