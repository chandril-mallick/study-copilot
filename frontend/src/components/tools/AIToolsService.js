const API_BASE_URL = 'http://localhost:8000';

class AIToolsService {
  static async makeRequest(action, data, isFormData = false) {
    let endpoint = '';
    let options = {};

    switch (action) {
      case 'study-plan':
        endpoint = `${API_BASE_URL}/tools/study-plan`;
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        break;
      case 'quiz-generator':
      case 'quiz':
        endpoint = `${API_BASE_URL}/tools/quiz`;
        if (isFormData) {
          options = {
            method: 'POST',
            body: data  // FormData
          };
        } else {
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          };
        }
        break;
      case 'summarize':
        endpoint = `${API_BASE_URL}/tools/summarize`;
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        break;
      case 'chat':
        endpoint = `${API_BASE_URL}/tools/chat`;
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        break;
      case 'lesson-plan':
        endpoint = `${API_BASE_URL}/tools/lesson-plan`;
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        break;
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'An error occurred');
    }

    return result;
  }

  static async checkOllamaStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/ollama/status`);
      const data = await response.json();
      return data.available ? 'connected' : 'disconnected';
    } catch (error) {
      console.error('Failed to check Ollama status:', error);
      return 'disconnected';
    }
  }

  static async fetchAvailableModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/ollama/models`);
      const data = await response.json();
      if (data.success) {
        return data.models.map(model => model.name);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      return [];
    }
  }
}

export default AIToolsService;
