// Q&A Forum API Service
const QNA_API_BASE = import.meta.env.VITE_QNA_API_URL || 'http://localhost:8001/api/qna';

// Helper function to make requests with error handling
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Network error or other fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Q&A Forum service');
    }
    throw error;
  }
};

export const qnaService = {
  // Get all questions with optional filters
  async getQuestions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.subject && filters.subject !== 'all') params.append('subject', filters.subject);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.search) params.append('search', filters.search);
    params.append('sort_by', filters.sortBy || 'newest');
    
    const queryString = params.toString();
    return makeRequest(`${QNA_API_BASE}/questions${queryString ? '?' + queryString : ''}`);
  },

  // Get single question
  async getQuestion(questionId) {
    return makeRequest(`${QNA_API_BASE}/questions/${questionId}`);
  },

  // Create new question
  async createQuestion(questionData) {
    return makeRequest(`${QNA_API_BASE}/questions`, {
      method: 'POST',
      body: JSON.stringify({
        title: questionData.title,
        content: questionData.content,
        subject: questionData.subject,
        author_name: questionData.authorName || 'Guest User',
        author_type: questionData.authorType || 'student',
        tags: questionData.tags || []
      })
    });
  },

  // Create answer
  async createAnswer(questionId, answerData) {
    return makeRequest(`${QNA_API_BASE}/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify({
        content: answerData.content,
        author_name: answerData.authorName || 'Guest User',
        author_type: answerData.authorType || 'student'
      })
    });
  },

  // Vote on question
  async voteQuestion(questionId, voteType) {
    return makeRequest(`${QNA_API_BASE}/questions/${questionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote_type: voteType })
    });
  },

  // Vote on answer
  async voteAnswer(answerId, voteType) {
    return makeRequest(`${QNA_API_BASE}/answers/${answerId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote_type: voteType })
    });
  },

  // Accept answer
  async acceptAnswer(answerId) {
    return makeRequest(`${QNA_API_BASE}/answers/${answerId}/accept`, {
      method: 'POST'
    });
  },

  // Get all subjects with counts
  async getSubjects() {
    try {
      // Get subjects list
      const subjects = await makeRequest(`${QNA_API_BASE}/subjects`);
      
      // Get questions to count by subject
      const questions = await makeRequest(`${QNA_API_BASE}/questions?limit=1000`);
      
      // Count questions per subject
      const subjectCounts = {};
      questions.forEach(q => {
        if (q.subject) {
          subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
        }
      });
      
      // Format as objects with id, name, count
      return subjects.map((subject, index) => ({
        id: subject,
        name: subject,
        count: subjectCounts[subject] || 0
      }));
    } catch (error) {
      // Fallback to default subjects
      return [
        { id: 'Mathematics', name: 'Mathematics', count: 0 },
        { id: 'Physics', name: 'Physics', count: 0 },
        { id: 'Chemistry', name: 'Chemistry', count: 0 },
        { id: 'Computer Science', name: 'Computer Science', count: 0 }
      ];
    }
  },

  // Get all tags
  async getTags() {
    return makeRequest(`${QNA_API_BASE}/tags`);
  },

  // Check if service is online
  async checkHealth() {
    try {
      const response = await fetch(`${QNA_API_BASE.replace('/api/qna', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
};
