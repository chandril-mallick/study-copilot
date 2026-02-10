// Study Groups API Service
import api from './api';

export const studyGroupService = {
  // List all study groups
  async getStudyGroups(subject = null) {
    const params = subject ? { subject } : {};
    const response = await api.get('/api/student/study-groups', { params });
    return response.data;
  },

  // Get specific group details
  async getStudyGroup(groupId) {
    const response = await api.get(`/api/student/study-groups/${groupId}`);
    return response.data;
  },

  // Create new study group
  async createStudyGroup(groupData) {
    const response = await api.post('/api/student/study-groups', {
      name: groupData.name,
      subject: groupData.subject,
      description: groupData.description,
      max_members: groupData.maxMembers || 10
    });
    return response.data;
  },

  // Join a study group
  async joinGroup(groupId) {
    const response = await api.post(`/api/student/study-groups/${groupId}/join`);
    return response.data;
  },

  // Leave a study group
  async leaveGroup(groupId) {
    const response = await api.post(`/api/student/study-groups/${groupId}/leave`);
    return response.data;
  },

  // Get group messages
  async getGroupMessages(groupId) {
    const response = await api.get(`/api/student/study-groups/${groupId}/messages`);
    return response.data;
  },

  // Post message to group
  async postGroupMessage(groupId, content) {
    const response = await api.post(`/api/student/study-groups/${groupId}/messages`, {
      content
    });
    return response.data;
  },

  // Get group suggestions
  async getGroupSuggestions() {
    try {
      const response = await api.get('/api/student/study-groups/suggestions');
      return response.data;
    } catch (err) {
      // If endpoint doesn't exist, return empty suggestions
      console.warn('Suggestions endpoint not available:', err);
      return { suggestions: [] };
    }
  }
};
