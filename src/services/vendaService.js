import api from './api';

export const vendaService = {
  // Criar nova venda
  criarVenda: async (vendaData) => {
    try {
      const response = await api.post('/vendas', vendaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Listar todas as vendas
  listarVendas: async () => {
    try {
      const response = await api.get('/vendas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar venda por ID
  buscarVenda: async (id) => {
    try {
      const response = await api.get(`/vendas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Finalizar venda
  finalizarVenda: async (id, formaPagamento) => {
    try {
      const response = await api.put(`/vendas/${id}/finalizar?formaPagamento=${encodeURIComponent(formaPagamento)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancelar venda
  cancelarVenda: async (id) => {
    try {
      const response = await api.put(`/vendas/${id}/cancelar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar vendas por cliente
  buscarPorCliente: async (clienteId) => {
    try {
      const response = await api.get(`/vendas/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar vendas por status
  buscarPorStatus: async (status) => {
    try {
      const response = await api.get(`/vendas/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar vendas por número
  buscarPorNumero: async (numeroVenda) => {
    try {
      const response = await api.get(`/vendas/numero/${numeroVenda}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Gerar PDF da venda
  gerarPdf: async (vendaId) => {
    try {
      const response = await api.get(`/vendas/${vendaId}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};