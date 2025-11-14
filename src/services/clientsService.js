import api from './api';

// Clients API Service
export const clientsService = {
  // Get all clients
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch clients');
    }
  },

  // Get client by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch client');
    }
  },

  // Create new client
  create: async (clientData) => {
    try {
      const response = await api.post('/clientes', clientData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        // Se houver erros de campo específicos, retornar o primeiro
        if (errorData.fieldErrors) {
          const firstError = Object.values(errorData.fieldErrors)[0];
          throw new Error(firstError || 'Dados inválidos');
        }
        // Se houver mensagem geral, usar ela
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        throw new Error('Dados do cliente inválidos');
      }
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Falha ao criar cliente';
      throw new Error(errorMessage);
    }
  },

  // Update client
  update: async (id, clientData) => {
    try {
      const response = await api.put(`/clientes/${id}`, clientData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid client data');
      }
      if (error.response?.status === 404) {
        throw new Error('Client not found');
      }
      throw new Error('Failed to update client');
    }
  },

  // Delete client
  delete: async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Client not found');
      }
      throw new Error('Failed to delete client');
    }
  },

  // Search clients
  search: async (query) => {
    try {
      const response = await api.get('/clientes', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search clients');
    }
  }
};

export default clientsService;
