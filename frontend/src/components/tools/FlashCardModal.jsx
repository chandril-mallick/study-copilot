import React, { useState } from 'react';
import Modal from './Modal';
import { useFlashcardForm } from './hooks';
import { useAIResponse } from './hooks';

const FlashCardModal = ({ isOpen, onClose }) => {
  const { formData, updateForm, resetForm } = useFlashcardForm();
  const { isLoading, makeAIRequest, clearResponse } = useAIResponse();

  const [flashcardCards, setFlashcardCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

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
      numCards: parseInt(formData.numCards),
      cardType: formData.cardType,
      priorityAreas: formData.priorityAreas
    };

    console.log('Sending payload:', { ...payload, content: payload.content.substring(0, 100) + '...' });

    try {
      const result = await makeAIRequest('flashcards', payload);
      if (result.success) {
        setFlashcardCards(result.cards);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setUserAnswers({});
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateForm({ uploadedFile: file });
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcardCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const selectAnswer = (cardIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [cardIndex]: answer
    });
  };

  const getCardScore = () => {
    let correct = 0;
    flashcardCards.forEach((card, index) => {
      if (userAnswers[index] === card.correct_answer) {
        correct++;
      }
    });
    return { correct, total: flashcardCards.length };
  };

  const handleClose = () => {
    onClose();
    resetForm();
    setFlashcardCards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setUserAnswers({});
    clearResponse();
  };

  if (!isOpen) return null;

  return (
    <Modal title="🗂️ AI Flash Card Generator" onClose={handleClose}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Generate AI Flashcards with FAISS Vector Search
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload documents or paste content to create intelligent MCQs using FAISS-indexed chunks and vector search technology.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">📄 Content Source</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload File (PDF, TXT, DOC)
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {formData.uploadedFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✅ File uploaded: {formData.uploadedFile.name}
                  </p>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-blue-50 dark:bg-blue-900/20 text-gray-500 dark:text-gray-400">OR</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste Content or Describe Topic
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateForm({ content: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Paste your study content here or describe the topic you want flashcards for..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Card Settings */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-3">⚙️ Card Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => updateForm({ subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Mathematics, Physics, Biology"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Calculus, Photosynthesis, World History"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Cards
                </label>
                <select
                  value={formData.numCards}
                  onChange={(e) => updateForm({ numCards: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="5">5 Cards</option>
                  <option value="10">10 Cards</option>
                  <option value="15">15 Cards</option>
                  <option value="20">20 Cards</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateForm({ difficulty: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || (!formData.content?.trim() && !formData.uploadedFile && !formData.subject) || (formData.content?.trim().length < 50 && formData.uploadedFile === null)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing with FAISS Vector Search...
                </div>
              ) : (
                '🚀 Generate with FAISS Search'
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

        {/* Flash Card Practice Interface */}
        {flashcardCards.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  📚 FAISS-Powered Practice Mode
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Generated using vector search on indexed content chunks
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Card {currentCardIndex + 1} of {flashcardCards.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / flashcardCards.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Flash Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              {(() => {
                const currentCard = flashcardCards[currentCardIndex];
                if (!currentCard) return null;

                return (
                  <div className="text-center">
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        currentCard.priority === 'high' || currentCard.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        currentCard.priority === 'medium' || currentCard.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      }`}>
                        {currentCard.priority?.toUpperCase()} Priority • {currentCard.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      {currentCard.question}
                    </h4>

                    {!showAnswer ? (
                      <div className="space-y-3">
                        {currentCard.options && (
                          <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                            {currentCard.options.split(/[A-D]\)/).slice(1).map((option, index) => {
                              const letter = String.fromCharCode(65 + index); // A, B, C, D
                              return (
                                <button
                                  key={letter}
                                  onClick={() => selectAnswer(currentCardIndex, letter)}
                                  className={`p-3 text-left rounded-lg border transition-colors ${
                                    userAnswers[currentCardIndex] === letter
                                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {letter}) {option.trim()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <button
                          onClick={() => setShowAnswer(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          Show Answer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${
                          userAnswers[currentCardIndex] === currentCard.correct_answer
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-2xl ${
                              userAnswers[currentCardIndex] === currentCard.correct_answer ? '✅' : '❌'
                            }`}></span>
                            <span className={`font-medium ${
                              userAnswers[currentCardIndex] === currentCard.correct_answer
                                ? 'text-green-800 dark:text-green-300'
                                : 'text-red-800 dark:text-red-300'
                            }`}>
                              {userAnswers[currentCardIndex] === currentCard.correct_answer ? 'Correct!' : 'Incorrect'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Correct Answer:</strong> {currentCard.correct_answer}) {
                              currentCard.options?.split(/[A-D]\)/).slice(1)[
                                currentCard.correct_answer.charCodeAt(0) - 65
                              ]?.trim()
                            }
                          </div>
                        </div>

                        {currentCard.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Explanation:</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {currentCard.explanation}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={prevCard}
                            disabled={currentCardIndex === 0}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ← Previous
                          </button>
                          <button
                            onClick={nextCard}
                            disabled={currentCardIndex === flashcardCards.length - 1}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Results Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">📊 Session Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{flashcardCards.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{getCardScore().correct}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{getCardScore().total - getCardScore().correct}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round((getCardScore().correct / getCardScore().total) * 100)}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FlashCardModal;
