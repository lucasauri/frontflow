import api from './api';

const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Erro desconhecido';
};

export const relatoriosService = {
  /**
   * Gera relatório completo de vendas
   */
  gerarRelatorioCompleto: async (dataInicio, dataFim) => {
    try {
      const response = await api.get('/relatorios/vendas/completo', {
        params: {
          dataInicio,
          dataFim
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Gera relatório resumido de vendas
   */
  gerarRelatorioResumo: async (dataInicio, dataFim) => {
    try {
      const response = await api.get('/relatorios/vendas/resumo', {
        params: {
          dataInicio,
          dataFim
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Gera relatório por cliente
   */
  gerarRelatorioPorCliente: async (dataInicio, dataFim, clienteId) => {
    try {
      const response = await api.get(`/relatorios/vendas/cliente/${clienteId}`, {
        params: {
          dataInicio,
          dataFim
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Gera relatório por produto
   */
  gerarRelatorioPorProduto: async (dataInicio, dataFim, produtoId) => {
    try {
      const response = await api.get(`/relatorios/vendas/produto/${produtoId}`, {
        params: {
          dataInicio,
          dataFim
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
};
