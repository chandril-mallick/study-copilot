import { useState, useCallback } from 'react';
import AIToolsService from './AIToolsService';

export const useAIResponse = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const makeAIRequest = useCallback(async (action, data, isFormData = false) => {
    setIsLoading(true);
    try {
      const result = await AIToolsService.makeRequest(action, data, isFormData);
      setAiResponse(result);
      return result;
    } catch (error) {
      setAiResponse({ error: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setAiResponse('');
  }, []);

  return {
    aiResponse,
    isLoading,
    makeAIRequest,
    clearResponse
  };
};

export const useOllamaStatus = () => {
  const [ollamaStatus, setOllamaStatus] = useState('unknown');

  const checkOllamaStatus = useCallback(async () => {
    const status = await AIToolsService.checkOllamaStatus();
    setOllamaStatus(status);
  }, []);

  return {
    ollamaStatus,
    checkOllamaStatus,
    getStatusColor: () => {
      switch (ollamaStatus) {
        case 'connected': return 'text-green-500';
        case 'disconnected': return 'text-red-500';
        default: return 'text-yellow-500';
      }
    },
    getStatusText: () => {
      switch (ollamaStatus) {
        case 'connected': return 'AI Ready';
        case 'disconnected': return 'AI Offline';
        default: return 'Checking AI...';
      }
    }
  };
};

export const useStudyPlanForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    duration: '',
    difficulty: 'intermediate',
    goals: '',
    learning_style: 'visual',
    study_time: '2 hours per day',
    study_time_period: 'morning',
    weakAreas: ''
  });

  const updateForm = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      subject: '',
      duration: '',
      difficulty: 'intermediate',
      goals: '',
      learning_style: 'visual',
      study_time: '2 hours per day',
      study_time_period: 'morning',
      weakAreas: ''
    });
  }, []);

  return {
    formData,
    updateForm,
    resetForm
  };
};

export const useQuizForm = () => {
  const [formData, setFormData] = useState({
    content: '',
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    numQuestions: '5',
    questionType: 'multiple-choice',
    uploadedFile: null
  });

  const updateForm = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      content: '',
      subject: '',
      topic: '',
      difficulty: 'intermediate',
      numQuestions: '5',
      questionType: 'multiple-choice',
      uploadedFile: null
    });
  }, []);

  return {
    formData,
    updateForm,
    resetForm
  };
};

export const useNotesForm = () => {
  const [formData, setFormData] = useState({
    content: '',
    maxLength: '200'
  });

  const updateForm = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      content: '',
      maxLength: '200'
    });
  }, []);

  return {
    formData,
    updateForm,
    resetForm
  };
};

export const useFlashcardForm = () => {
  const [formData, setFormData] = useState({
    content: '',
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    numCards: '10',
    cardType: 'mcq',
    priorityAreas: [],
    uploadedFile: null
  });

  const updateForm = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      content: '',
      subject: '',
      topic: '',
      difficulty: 'intermediate',
      numCards: '10',
      cardType: 'mcq',
      priorityAreas: [],
      uploadedFile: null
    });
  }, []);

  return {
    formData,
    updateForm,
    resetForm
  };
};
