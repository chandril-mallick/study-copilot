// Faculty API Service
import api from './api';

export const facultyService = {
  // Auto-Grader
  async autoGradeSubmission(submissionId, rubric = null) {
    const response = await api.post('/api/faculty/grade/auto', {
      submission_id: submissionId,
      rubric
    });
    return response.data;
  },

  async getPendingSubmissions() {
    const response = await api.get('/api/faculty/grade/pending');
    return response.data;
  },

  async deleteSubmission(submissionId) {
    const response = await api.delete(`/api/faculty/grade/submissions/${submissionId}`);
    return response.data;
  },

  async bulkGrade(assignmentId, autoGrade = true) {
    const response = await api.post('/api/faculty/grade/bulk', {
      assignment_id: assignmentId,
      auto_grade: autoGrade
    });
    return response.data;
  },

  // Assignment Management
  async createAssignment(assignmentData) {
    const response = await api.post('/api/faculty/assignments', {
      title: assignmentData.title,
      description: assignmentData.description,
      subject: assignmentData.subject,
      due_date: assignmentData.dueDate,
      max_marks: assignmentData.maxMarks
    });
    return response.data;
  },

  async updateAssignment(assignmentId, assignmentData) {
    const response = await api.put(`/api/faculty/assignments/${assignmentId}`, {
      title: assignmentData.title,
      description: assignmentData.description,
      subject: assignmentData.subject,
      due_date: assignmentData.dueDate,
      max_marks: assignmentData.maxMarks
    });
    return response.data;
  },

  async getAssignmentSubmissions(assignmentId) {
    const response = await api.get(`/api/faculty/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  async getAssignments() {
    const response = await api.get('/api/faculty/assignments');
    return response.data;
  },

  async deleteAssignment(assignmentId) {
    const response = await api.delete(`/api/faculty/assignments/${assignmentId}`);
    return response.data;
  },

  // Dashboard
  async getDashboardStats() {
    const response = await api.get('/api/faculty/dashboard/stats');
    return response.data;
  },

  async getAtRiskStudents() {
    const response = await api.get('/api/faculty/dashboard/at-risk-students');
    return response.data;
  },

  // Lesson Generator
  async generateLesson(topic, subject, duration = '45 minutes') {
    const response = await api.post('/api/faculty/lessons/generate', null, {
      params: { topic, subject, duration }
    });
    return response.data;
  },

  // Question Bank
  // Question Bank
  async generateQuestions(topic, subject, sourceText = "", numQuestions = 10, difficulty = 'mixed') {
    const response = await api.post('/api/faculty/questions/generate', {
      topic, 
      subject, 
      context: sourceText,
      num_questions: numQuestions, 
      difficulty 
    });
    return response.data;
  },

  // Plagiarism Scanner
  async scanPlagiarism(submissionId) {
    const response = await api.post('/api/faculty/plagiarism/scan', null, {
      params: { submission_id: submissionId }
    });
    return response.data;
  },

  // Manual Grading
  async manualGradeSubmission(submissionId, grade, feedback) {
    const response = await api.post('/api/faculty/grade/manual', {
      submission_id: submissionId,
      grade: grade,
      feedback: feedback
    });
    return response.data;
  }
};
