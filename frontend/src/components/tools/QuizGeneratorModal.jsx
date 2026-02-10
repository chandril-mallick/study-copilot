import React from 'react';
import Modal from './Modal';
import { useQuizForm } from './hooks';
import { useAIResponse } from './hooks';

const QuizGeneratorModal = ({ isOpen, onClose }) => {
  const { formData, updateForm, resetForm } = useQuizForm();
  const { aiResponse, isLoading, makeAIRequest, clearResponse } = useAIResponse();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let content = formData.content;

    // If file is uploaded, read it
    if (formData.uploadedFile) {
      try {
        const fileContent = await formData.uploadedFile.text();
        content = fileContent;
        console.log(`File uploaded: ${formData.uploadedFile.name}, Content length: ${fileContent.length}`);
      } catch (error) {
        console.error('Error reading file:', error);
        return;
      }
    }

    // Validate content
    if (!content || content.trim().length < 50) {
      alert('Please provide meaningful content (at least 50 characters) or upload a file.');
      return;
    }

    const payload = {
      content: content.trim(),
      subject: formData.subject,
      topic: formData.topic,
      difficulty: formData.difficulty,
      numQuestions: parseInt(formData.numQuestions) || 5,
      questionType: formData.questionType
    };

    console.log('Sending quiz payload:', { ...payload, content: payload.content.substring(0, 100) + '...' });

    await makeAIRequest('quiz', payload, false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
    clearResponse();
  };

  if (!isOpen) return null;

  return (
    <Modal title="🤖 AI Quiz Generator " onClose={handleClose}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Generate AI Quizzes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload documents or paste content to create intelligent quizzes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-3">📁 Module Upload</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Module File (PDF, TXT, DOCX) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt,.docx,.doc"
                  onChange={(e) => updateForm({ uploadedFile: e.target.files[0] })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: PDF, TXT, DOCX. Max size: 10MB.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or Provide Module Content Manually (Optional)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateForm({ content: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Paste module content here if not uploading a file..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Quiz Configuration */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">⚙️ Quiz Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject/Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => updateForm({ subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mathematics, Physics, History"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => updateForm({ topic: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Calculus, Photosynthesis, World History"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateForm({ difficulty: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Type
                </label>
                <select
                  value={formData.questionType}
                  onChange={(e) => updateForm({ questionType: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={formData.numQuestions}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    updateForm({ numQuestions: isNaN(value) ? 5 : value });
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || (!formData.content?.trim() && !formData.uploadedFile && !formData.subject) || (formData.content?.trim().length < 50 && formData.uploadedFile === null)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate '
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Quiz Results */}
        {aiResponse && aiResponse.quiz && (
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Quiz Generated
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Created using AI based on your provided module.
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-h-96 overflow-y-auto">
              {aiResponse.quiz.questions ? (
                <div className="space-y-4">
                  {aiResponse.quiz.questions.map((q, index) => (
                    <div key={`question-${index}`} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                        {index + 1}. {q.question}
                      </h4>
                      {q.options && (
                        <div className="space-y-1 mb-2">
                          {q.options.map((option, optIndex) => (
                            <div key={`option-${index}-${optIndex}`} className="text-sm text-gray-600 dark:text-gray-300">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.correctAnswer && (
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          Correct Answer: {q.correctAnswer}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {aiResponse.quiz.rawResponse || aiResponse.error}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                💾 Save Quiz
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                📊 Assign to Students
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                📋 Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuizGeneratorModal;
