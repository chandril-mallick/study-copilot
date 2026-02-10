// Student API Service
import api from './api';

export const studentService = {
  // Learning Path
  async getLearningPath() {
    const response = await api.get('/api/student/learning-path');
    return response.data;
  },

  async updateProgress(week, progress) {
    const response = await api.post('/api/student/learning-path/progress', { week, progress });
    return response.data;
  },

  async getWeakTopics() {
    const response = await api.get('/api/student/learning-path/weak-topics');
    return response.data;
  },

  // AI Tutor
  async getTutorModes() {
    const response = await api.get('/api/student/tutor/modes');
    return response.data;
  },

  async chatWithTutor(message, mode, sessionId = null) {
    const response = await api.post('/api/student/tutor/chat', {
      message,
      mode,
      session_id: sessionId
    });
    return response.data;
  },

  async getStepByStepExplanation(topic, difficulty = 'intermediate') {
    const response = await api.post('/api/student/tutor/explain', null, {
      params: { topic, difficulty }
    });
    return response.data;
  },

  // Assignments
  async getAssignments() {
    const response = await api.get('/api/student/assignments');
    return response.data;
  },

  async getAssignment(id) {
    const response = await api.get(`/api/student/assignments/${id}`);
    return response.data;
  },

  async getAssignmentHints(id, question, context = null) {
    const response = await api.post(`/api/student/assignments/${id}/hints`, {
      question,
      context
    });
    return response.data;
  },

  async submitAssignment(id, content) {
    const response = await api.post(`/api/student/assignments/${id}/submit`, {
      content
    });
    return response.data;
  },

  async updateSubmission(id, content) {
    const response = await api.put(`/api/student/assignments/${id}/submit`, {
      content
    });
    return response.data;
  },

  async deleteSubmission(id) {
    const response = await api.delete(`/api/student/assignments/${id}/submit`);
    return response.data;
  },

  async checkPlagiarism(id, content) {
    const response = await api.post(`/api/student/assignments/${id}/plagiarism-check`, {
      content
    });
    return response.data;
  },

  // Revision Engine
  async generateSummary(content, subject, maxLength = 500) {
    const response = await api.post('/api/student/revision/summary', {
      content,
      subject,
      max_length: maxLength
    });
    return response.data;
  },

  async generateMindMap(topic, subject, content = "") {
    const response = await api.post('/api/student/revision/mindmap', {
      topic,
      subject,
      content
    });
    return response.data;
  },

  async generateFlashcards(content, numCards = 10, subject = "") {
    const response = await api.post('/api/student/revision/flashcards', {
      content,
      subject,
      num_cards: numCards
    });
    return response.data;
  },

  async getRevisionHistory() {
    const response = await api.get('/api/student/revision/history');
    return response.data;
  },

  // Study Groups
  async getStudyGroups(subject = null) {
    const response = await api.get('/api/student/study-groups', {
      params: subject ? { subject } : {}
    });
    return response.data;
  },

  async createStudyGroup(name, subject, maxMembers, skillLevel, meetingSchedule) {
    const response = await api.post('/api/student/study-groups', {
      name,
      subject,
      max_members: maxMembers,
      skill_level: skillLevel,
      meeting_schedule: meetingSchedule
    });
    return response.data;
  },

  async joinStudyGroup(groupId) {
    const response = await api.post(`/api/student/study-groups/${groupId}/join`);
    return response.data;
  },

  async getGroupSuggestions() {
    const response = await api.get('/api/student/study-groups/suggestions');
    return response.data;
  }
};
