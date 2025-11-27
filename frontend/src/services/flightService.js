import api from '../lib/api';

export const flightService = {
  // Listar todos os voos
  async getAll() {
    const response = await api.get('/flights');
    return response.data;
  },

  // Obter detalhes de um voo
  async getById(id) {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },

  // Criar novo monitoramento
  async create(data) {
    const response = await api.post('/flights', data);
    return response.data;
  },

  // Atualizar voo
  async update(id, data) {
    const response = await api.put(`/flights/${id}`, data);
    return response.data;
  },

  // Deletar voo
  async delete(id) {
    const response = await api.delete(`/flights/${id}`);
    return response.data;
  },

  // Buscar ofertas em tempo real
  async getOffers(id) {
    const response = await api.get(`/flights/${id}/offers`);
    return response.data;
  },

  // Forçar verificação de preço
  async checkNow(id) {
    const response = await api.post(`/flights/${id}/check`);
    return response.data;
  },

  // Forçar verificação
  async checkNow(id) {
    const response = await api.post(`/flights/${id}/check`);
    return response.data;
  },

  // Obter histórico de preços
  async getHistory(id, limit = 100) {
    const response = await api.get(`/flights/${id}/history`, { params: { limit } });
    return response.data;
  },

  // Obter estatísticas
  async getStats(id) {
    const response = await api.get(`/flights/${id}/stats`);
    return response.data;
  }
};
