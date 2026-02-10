// Automation Service for Scholarship and Admission
import api from './api';

export const automationService = {
  // ===== SCHOLARSHIP =====
  
  // Get all scholarship applications
  async getScholarshipApplications(status = null) {
    const params = status ? { status } : {};
    const response = await api.get('/api/admin/automation/scholarship/applications', { params });
    return response.data;
  },

  // Create scholarship application
  async createScholarshipApplication(data) {
    const response = await api.post('/api/admin/automation/scholarship/apply', data);
    return response.data;
  },

  // Approve scholarship
  async approveScholarship(applicationId, approvedAmount = null) {
    const response = await api.post(`/api/admin/automation/scholarship/${applicationId}/approve`, {
      approved_amount: approvedAmount
    });
    return response.data;
  },

  // Reject scholarship
  async rejectScholarship(applicationId, reason) {
    const response = await api.post(`/api/admin/automation/scholarship/${applicationId}/reject`, {
      reason
    });
    return response.data;
  },

  // Verify scholarship documents
  async verifyScholarshipDocuments(applicationId, verificationResult, notes = null) {
    const response = await api.post(`/api/admin/automation/scholarship/${applicationId}/verify`, {
      verification_result: verificationResult,
      notes
    });
    return response.data;
  },

  // Get scholarship stats
  async getScholarshipStats() {
    const response = await api.get('/api/admin/automation/scholarship/stats');
    return response.data;
  },

  // ===== ADMISSION =====

  // Get all admission applications
  async getAdmissionApplications(status = null, department = null) {
    const params = {};
    if (status) params.status = status;
    if (department) params.department = department;
    const response = await api.get('/api/admin/automation/admission/applications', { params });
    return response.data;
  },

  // Create admission application
  async createAdmissionApplication(data) {
    const response = await api.post('/api/admin/automation/admission/apply', data);
    return response.data;
  },

  // Approve admission
  async approveAdmission(applicationId) {
    const response = await api.post(`/api/admin/automation/admission/${applicationId}/approve`);
    return response.data;
  },

  // Reject admission
  async rejectAdmission(applicationId, reason) {
    const response = await api.post(`/api/admin/automation/admission/${applicationId}/reject`, {
      reason
    });
    return response.data;
  },

  // Verify admission documents
  async verifyAdmissionDocuments(applicationId, verificationResult, notes = null) {
    const response = await api.post(`/api/admin/automation/admission/${applicationId}/verify`, {
      verification_result: verificationResult,
      notes
    });
    return response.data;
  },

  // Get admission stats
  async getAdmissionStats() {
    const response = await api.get('/api/admin/automation/admission/stats');
    return response.data;
  }
};

