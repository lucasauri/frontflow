import api from './api';

// Products API Service
export const productsService = {
  // Get all products
  getAll: async () => {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  // Get product by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const response = await api.post('/produtos', productData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Dados do produto inválidos. Verifique se todos os campos obrigatórios estão preenchidos corretamente.';
        throw new Error(errorMessage);
      }
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Falha ao criar produto';
      throw new Error(errorMessage);
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await api.put(`/produtos/${id}`, productData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid product data');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to update product');
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to delete product');
    }
  },

  // Get products with low stock
  getLowStock: async () => {
    try {
      const response = await api.get('/produtos/estoque-baixo');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch low stock products');
    }
  },

  // Add stock movement
  addMovement: async (id, movementData) => {
    try {
      const response = await api.post(`/produtos/${id}/movimentacao`, movementData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Invalid movement data');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to add movement');
    }
  },

  // Get product statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/produtos/estatisticas');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product statistics');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/produtos/health');
      return response.data;
    } catch (error) {
      throw new Error('Products service health check failed');
    }
  }
};

export default productsService;
