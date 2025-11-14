import api from './api';

// Dashboard API Service
export const dashboardService = {
  // Get dashboard statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/dashboard/estatisticas');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard statistics');
    }
  },

  // Get system health
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch system health');
    }
  },

  // Get database health
  getDatabaseHealth: async () => {
    try {
      const response = await api.get('/health/database');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch database health');
    }
  }
};

export default dashboardService;
