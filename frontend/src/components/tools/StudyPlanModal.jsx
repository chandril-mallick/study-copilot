import React, { useState } from 'react';
import Modal from './Modal';
import { useStudyPlanForm } from './hooks';
import { useAIResponse } from './hooks';

const StudyPlanModal = ({ isOpen, onClose }) => {
  const { formData, updateForm, resetForm } = useStudyPlanForm();
  const { aiResponse, isLoading, makeAIRequest } = useAIResponse();
  const [progress, setProgress] = useState({});

  const toggleTaskProgress = (weekIndex, dayIndex, taskIndex) => {
    const key = `${weekIndex}-${dayIndex}-${taskIndex}`;
    setProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTotalProgress = () => {
    if (!aiResponse?.studyPlan?.weeks) return 0;
    let totalTasks = 0;
    let completedTasks = 0;

    aiResponse.studyPlan.weeks.forEach(week => {
      week.days?.forEach(day => {
        day.tasks?.forEach((_, taskIndex) => {
          totalTasks++;
          const key = `${aiResponse.studyPlan.weeks.indexOf(week)}-${week.days.indexOf(day)}-${taskIndex}`;
          if (progress[key]) completedTasks++;
        });
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getWeekProgress = (weekIndex) => {
    const week = aiResponse?.studyPlan?.weeks?.[weekIndex];
    if (!week?.days) return 0;

    let totalTasks = 0;
    let completedTasks = 0;

    week.days.forEach(day => {
      day.tasks?.forEach((_, taskIndex) => {
        totalTasks++;
        const key = `${weekIndex}-${week.days.indexOf(day)}-${taskIndex}`;
        if (progress[key]) completedTasks++;
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      duration: parseInt(formData.duration) || 0
    };
    await makeAIRequest('study-plan', payload);
  };

  const resetProgress = () => {
    setProgress({});
  };

  const isWeakArea = (topic) => {
    if (!formData.weakAreas) return false;
    const weakAreasList = formData.weakAreas.toLowerCase().split(',').map(area => area.trim());
    return weakAreasList.some(area => topic.toLowerCase().includes(area));
  };

  if (!isOpen) return null;

  return (
    <Modal title="🎯 AI Study Planner" onClose={onClose}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Create Your Personalized Study Plan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Our AI will analyze your requirements and create a customized study plan tailored to your learning style and goals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">📚 Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject/Topic *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => updateForm({ subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (weeks) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => updateForm({ duration: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4"
                  min="1"
                  max="52"
                  required
                />
              </div>
            </div>
          </div>

          {/* Learning Profile */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-3">🎓 Learning Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Style
                </label>
                <select
                  value={formData.learning_style}
                  onChange={(e) => updateForm({ learning_style: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="visual">Visual Learner</option>
                  <option value="auditory">Auditory Learner</option>
                  <option value="kinesthetic">Hands-on Learner</option>
                  <option value="reading">Reading/Writing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Time
                </label>
                <input
                  type="text"
                  value={formData.study_time}
                  onChange={(e) => updateForm({ study_time: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 2 hours per day"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Time Period
                </label>
                <select
                  value={formData.study_time_period}
                  onChange={(e) => updateForm({ study_time_period: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goals and Preferences */}
          <div className="bg-gradient-to-br from-purple-50 to-red-50 dark:from-purple-900/20 dark:to-red-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Goals & Preferences
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                PRIORITY SECTION
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateForm({ difficulty: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Grade/Goal (Optional)
                </label>
                <input
                  type="text"
                  value={formData.targetGrade || ''}
                  onChange={(e) => updateForm({ targetGrade: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., A+, Pass the exam, Master the topic"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  🎯 Areas to Focus On (Optional)
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                    HIGH PRIORITY
                  </span>
                </span>
              </label>
              <textarea
                value={formData.weakAreas || ''}
                onChange={(e) => updateForm({ weakAreas: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Calculus, Problem solving, Time management, Statistics, Linear algebra - These areas will be prioritized with HIGH PRIORITY badges and more time allocation"
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                💡 Tip: Areas you specify here will get special priority in your study plan with more time and detailed tasks
              </p>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Goals (Optional)
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => updateForm({ goals: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Focus on calculus, improve problem-solving skills, prepare for exams"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Plan...
                </div>
              ) : (
                '🎯 Generate Study Plan'
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </form>

        {/* Results Section */}
        {aiResponse && (
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Your Personalized Study Plan
              </h3>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-h-96 overflow-y-auto">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiResponse && aiResponse.studyPlan && typeof aiResponse.studyPlan === 'object' ? (
                  <div className="space-y-4">
                    {/* Subject Header */}
                    <div className="border-b pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          📚 {aiResponse.studyPlan.subject}
                        </h4>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Overall Progress
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getTotalProgress()}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {getTotalProgress()}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {aiResponse.studyPlan.totalWeeks} Week Study Plan • Est. {aiResponse.studyPlan.estimatedHoursPerWeek} per week
                      </p>
                    </div>

                    {/* Study Plan Weeks */}
                    <div className="space-y-4">
                      {aiResponse.studyPlan.weeks && Array.isArray(aiResponse.studyPlan.weeks) ? (
                        aiResponse.studyPlan.weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">📆</span>
                              <h5 className="font-medium text-gray-800 dark:text-white">
                                Week {week.week}: {week.weekTitle}
                              </h5>
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                {week.days?.length || 0} days
                              </span>
                              <div className="flex items-center gap-2 ml-auto">
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${getWeekProgress(weekIndex)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {getWeekProgress(weekIndex)}%
                                </span>
                              </div>
                            </div>

                            {/* Days in Week */}
                            <div className="space-y-2 ml-6">
                              {week.days && Array.isArray(week.days) ? (
                                week.days.map((day, dayIndex) => (
                                  <div key={dayIndex} className={`bg-white dark:bg-gray-800 rounded-lg p-3 border-2 transition-colors ${
                                    isWeakArea(day.topic) ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                                  }`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                          Day {day.day}:
                                        </span>
                                        <span className="font-medium text-gray-800 dark:text-white">
                                          {day.topic}
                                        </span>
                                        {isWeakArea(day.topic) && (
                                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                                            🎯 PRIORITY
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {day.estimatedHours}h
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          day.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                          day.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        }`}>
                                          {day.priority?.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-1 ml-4">
                                      {day.tasks && Array.isArray(day.tasks) ? (
                                        day.tasks.map((task, taskIndex) => {
                                          const taskKey = `${weekIndex}-${dayIndex}-${taskIndex}`;
                                          const isCompleted = progress[taskKey] || false;
                                          return (
                                            <div key={taskIndex} className={`flex items-center justify-between text-sm p-2 rounded transition-colors ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                              <div className="flex items-center gap-2 flex-1">
                                                <input
                                                  type="checkbox"
                                                  checked={isCompleted}
                                                  onChange={() => toggleTaskProgress(weekIndex, dayIndex, taskIndex)}
                                                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <span className={`flex-1 ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                  {task.task}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                  {task.estimatedMinutes}m
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                  task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                }`}>
                                                  {task.priority?.toUpperCase()}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="text-sm text-gray-500 italic">No tasks specified</div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500 italic">No days planned</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">No weekly plan available</div>
                      )}
                    </div>
                  </div>
                ) : aiResponse && aiResponse.studyPlan && typeof aiResponse.studyPlan === 'string' ? (
                  aiResponse.studyPlan.split('\n').map((line, index) => (
                    <div key={index}>{line || <br />}</div>
                  ))
                ) : aiResponse && aiResponse.error ? (
                  <div className="text-red-600 dark:text-red-400">Error: {aiResponse.error}</div>
                ) : (
                  <div className="text-gray-500 italic">No response generated yet. Please try again.</div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                💾 Save Plan
              </button>
              <button
                onClick={resetProgress}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                🔄 Reset Progress ({getTotalProgress()}%)
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

export default StudyPlanModal;
