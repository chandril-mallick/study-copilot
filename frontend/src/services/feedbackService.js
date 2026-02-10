// Feedback Service - API calls for daily class feedback system

import api from './api';

export const feedbackService = {
  // Student endpoints
  async submitFeedback(data) {
    const response = await api.post('/api/student/feedback/submit', data);
    return response.data;
  },

  async getMyFeedback() {
    const response = await api.get('/api/student/feedback/my-feedback');
    return response.data;
  },

  async getClassSessions(date = null) {
    const params = date ? { date_filter: date } : {};
    const response = await api.get('/api/student/feedback/class-sessions', { params });
    return response.data;
  },

  // Faculty endpoints
  async createClassSession(data) {
    const response = await api.post('/api/faculty/feedback/create-session', data);
    return response.data;
  },

  async getDailyFeedback(date = null, subject = null) {
    const params = {};
    if (date) params.date_filter = date;
    if (subject) params.subject_filter = subject;
    const response = await api.get('/api/faculty/feedback/daily', { params });
    return response.data;
  },

  async getPendingFeedback() {
    const response = await api.get('/api/faculty/feedback/pending');
    return response.data;
  },

  async respondToFeedback(feedbackId, responseText) {
    const response = await api.post('/api/faculty/feedback/respond', {
      feedback_id: feedbackId,
      response: responseText
    });
    return response.data;
  },

  async getFeedbackStats(date = null) {
    const params = date ? { date_filter: date } : {};
    const response = await api.get('/api/faculty/feedback/stats', { params });
    return response.data;
  }
};
