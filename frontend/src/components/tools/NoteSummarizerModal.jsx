import React from 'react';
import Modal from './Modal';
import { useNotesForm } from './hooks';
import { useAIResponse } from './hooks';

const NoteSummarizerModal = ({ isOpen, onClose }) => {
  const { formData, updateForm, resetForm } = useNotesForm();
  const { aiResponse, isLoading, makeAIRequest, clearResponse } = useAIResponse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      maxLength: parseInt(formData.maxLength) || 200
    };
    await makeAIRequest('summarize', payload);
  };

  const handleClose = () => {
    onClose();
    resetForm();
    clearResponse();
  };

  if (!isOpen) return null;

  return (
    <Modal title="AI Note Summarizer" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateForm({ content: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Paste your study notes here..."
            rows={8}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Summary Length (words)
          </label>
          <input
            type="number"
            value={formData.maxLength}
            onChange={(e) => updateForm({ maxLength: parseInt(e.target.value) })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="50"
            max="500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
        >
          {isLoading ? 'Summarizing...' : 'Generate Summary'}
        </button>
      </form>

      {aiResponse && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">AI Generated Summary:</h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {aiResponse.summary || aiResponse.error}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NoteSummarizerModal;
