import api from './api';

export const studentApplicationService = {
  // ===== SCHOLARSHIP =====
  
  // Get all my scholarship applications
  async getMyScholarshipApplications() {
    const response = await api.get('/api/student/applications/scholarships');
    return response.data;
  },

  // Get details of a specific scholarship application
  async getScholarshipApplicationDetails(applicationId) {
    const response = await api.get(`/api/student/applications/scholarships/${applicationId}`);
    return response.data;
  },

  // Apply for a scholarship
  async applyForScholarship(data) {
    const response = await api.post('/api/student/applications/scholarships', data);
    return response.data;
  },


  // ===== ADMISSION =====

  // Get all my admission applications
  async getMyAdmissionApplications() {
    const response = await api.get('/api/student/applications/admissions');
    return response.data;
  },

  // Get details of a specific admission application
  async getAdmissionApplicationDetails(applicationId) {
    const response = await api.get(`/api/student/applications/admissions/${applicationId}`);
    return response.data;
  },

  // Apply for admission
  async applyForAdmission(data) {
    const response = await api.post('/api/student/applications/admissions', data);
    return response.data;
  }
};
