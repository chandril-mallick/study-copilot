import api from './api';

export const adminService = {
  // === WORKFLOWS ===
  async getWorkflows() {
    const response = await api.get('/api/admin/workflows');
    return response.data;
  },

  async createWorkflow(workflowData) {
    const response = await api.post('/api/admin/workflows', workflowData);
    return response.data;
  },

  // === INSTITUTION BRAIN ===
  async getInstitutionStats() {
    const response = await api.get('/api/admin/brain/stats');
    return response.data;
  },
  
  async getAiAccuracyMetrics() {
    const response = await api.get('/api/admin/brain/accuracy');
    return response.data;
  },

  // === ROLE INSIGHTS ===
  async getActivityHeatmap() {
      const response = await api.get('/api/admin/insights/activity');
      return response.data;
  },

  async getRoleInsights(role) {
      const response = await api.get(`/api/admin/insights/role/${role}`);
      return response.data;
  },

  // === SECURITY ===
  async getSecurityLogs() {
      const response = await api.get('/api/admin/security/logs');
      return response.data;
  },
  
  async getThreats() {
      const response = await api.get('/api/admin/security/threats');
      return response.data;
  },

  // === MANAGEMENT BENCHMARKS ===
  async getPlacementBenchmark() {
      const response = await api.get('/api/admin/management/benchmark/placement');
      return response.data;
  },

  async getResearchBenchmark() {
      const response = await api.get('/api/admin/management/benchmark/research');
      return response.data;
  },

  // === PREDICTIVE INSIGHTS ===
  async getDropoutRisks() {
      const response = await api.get('/api/admin/management/predict/dropout');
      return response.data;
  },

  async getPerformancePredictions() {
      const response = await api.get('/api/admin/management/predict/performance');
      return response.data;
  },

  // === POLICY GENERATOR ===
  async generatePolicy(topic, templateType) {
      const response = await api.post('/api/admin/management/policy/generate', null, {
          params: { topic, template_type: templateType }
      });
      return response.data;
  }
};
