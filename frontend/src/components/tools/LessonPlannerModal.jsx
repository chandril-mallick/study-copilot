import React, { useState } from 'react';
import Modal from './Modal';
import AIToolsService from './AIToolsService';
import { jsPDF } from 'jspdf';

const LessonPlannerModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    grade: 'General',
    duration: '45 minutes',
    lessonType: 'Theory',
    objectives: '',
    resources: ''
  });

  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const exportToPDF = () => {
    console.log('Export PDF button clicked');
    
    if (!aiResponse) {
      const errorMsg = 'No lesson plan data available to export';
      console.error(errorMsg);
      setError(errorMsg);
      alert(errorMsg);
      return;
    }
    
    console.log('AI Response data for PDF export:', JSON.stringify(aiResponse, null, 2));
    
    if (!aiResponse.lesson_plan) {
      const errorMsg = 'Lesson plan data is not in the expected format';
      console.error(errorMsg, { response: aiResponse });
      setError(errorMsg);
      alert(errorMsg + ' (check console for details)');
      return;
    }

    console.log('AI Response data:', JSON.stringify(aiResponse, null, 2));
    
    if (!aiResponse.lesson_plan) {
      const errorMsg = 'Lesson plan data is not in the expected format';
      console.error(errorMsg, { response: aiResponse });
      setError(errorMsg);
      alert(errorMsg + ' (check console for details)');
      return;
    }
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.setFont('helvetica', 'bold');
      doc.text('Lesson Plan', 105, 20, { align: 'center' });
      
      // Add metadata
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);
      
      let yPos = 50;
      
      // Helper function to add sections
      const addSection = (title, content, isList = false) => {
        if (!content || (Array.isArray(content) && content.length === 0)) return yPos;
        
        // Add section title
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, yPos);
        yPos += 8;
        
        // Add section content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        try {
          if (isList && Array.isArray(content)) {
            content.forEach((item) => {
              const text = typeof item === 'string' ? item : JSON.stringify(item);
              const lines = doc.splitTextToSize(`• ${text}`, 180);
              doc.text(lines, 20, yPos);
              yPos += (lines.length * 6) + 2;
            });
          } else if (typeof content === 'string') {
            const lines = doc.splitTextToSize(content, 180);
            doc.text(lines, 20, yPos);
            yPos += (lines.length * 6) + 10;
          } else if (typeof content === 'object' && content !== null) {
            // Handle nested objects
            const text = JSON.stringify(content, null, 2);
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 20, yPos);
            yPos += (lines.length * 6) + 10;
          }
        } catch (error) {
          console.error('Error adding section:', error);
          const errorText = `Error displaying section: ${error.message}`;
          const lines = doc.splitTextToSize(errorText, 180);
          doc.text(lines, 20, yPos);
          yPos += (lines.length * 6) + 10;
        }
        
        yPos += 10; // Add extra space between sections
        return yPos;
      };

      // Try different response formats
      const lessonPlanData = aiResponse.lesson_plan || aiResponse.lessonPlan || aiResponse;
      
      if (typeof lessonPlanData === 'object' && lessonPlanData !== null) {
        Object.entries(lessonPlanData).forEach(([key, value]) => {
          // Skip null/undefined values
          if (value == null) return;
          
          try {
            if (key.toLowerCase().includes('title')) {
              doc.setFontSize(16);
              doc.setFont('helvetica', 'bold');
              const title = typeof value === 'string' ? value : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              doc.text(title, 105, yPos, { align: 'center' });
              yPos += 15;
            } else if (Array.isArray(value)) {
              yPos = addSection(
                key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value,
                true
              );
            } else if (typeof value === 'string' && value.trim()) {
              yPos = addSection(
                key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value
              );
            } else if (typeof value === 'object') {
              // Handle nested objects
              yPos = addSection(
                key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value
              );
            }
            
            // Add new page if needed
            if (yPos > 250) {
              doc.addPage();
              yPos = 20;
            }
          } catch (error) {
            console.error(`Error processing section ${key}:`, error);
          }
        });
      } else if (typeof lessonPlanData === 'string') {
        // Handle case where lesson plan is just a string
        yPos = addSection('Lesson Plan', lessonPlanData);
      } else {
        // Fallback: stringify the entire response
        yPos = addSection('Lesson Plan', JSON.stringify(lessonPlanData, null, 2));
      }
      
      // Save the PDF
      const fileName = `lesson_plan_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      console.log('PDF generated successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      topic: '',
      grade: 'General',
      duration: '45 minutes',
      lessonType: 'Theory',
      objectives: '',
      resources: ''
    });
  };

  const clearResponse = () => {
    setAiResponse(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.topic.trim()) {
      setError('Please provide both subject and topic');
      return;
    }

    if (formData.subject.trim().length < 2) {
      setError('Subject must be at least 2 characters long');
      return;
    }

    if (formData.topic.trim().length < 2) {
      setError('Topic must be at least 2 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      subject: formData.subject.trim(),
      topic: formData.topic.trim(),
      grade: formData.grade,
      duration: formData.duration,
      lesson_type: formData.lessonType,
      objectives: formData.objectives.trim(),
      resources: formData.resources.trim()
    };

    console.log('Sending lesson plan payload:', payload);

    try {
      const result = await AIToolsService.makeRequest('lesson-plan', payload, false);
      console.log('Lesson plan generation result:', result);
      if (result.success) {
        console.log('Generated lesson plan:', result.lesson_plan);
        console.log('Lesson plan sections:', Object.keys(result.lesson_plan));
        setAiResponse(result);
      } else {
        console.error('Lesson plan generation failed:', result.message);
        setError(result.message || 'Failed to generate lesson plan');
      }
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      setError(error.message || 'Failed to generate lesson plan. Please check if Ollama is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
    clearResponse();
  };

  if (!isOpen) return null;

  return (
    <Modal title="📚 AI Lesson Planner" onClose={handleClose}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Generate AI-Powered Lesson Plans
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create comprehensive lesson plans with objectives, activities, assessments, and resources tailored to your needs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, Biology, History"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Photosynthesis, Quadratic Equations, World War II"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade Level
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="General">General</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Grade 1-2">Grade 1-2</option>
                <option value="Grade 3-5">Grade 3-5</option>
                <option value="Grade 6-8">Grade 6-8</option>
                <option value="Grade 9-10">Grade 9-10</option>
                <option value="Grade 11-12">Grade 11-12</option>
                <option value="College">College</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
              </select>
            </div>

            {/* Lesson Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lesson Type
              </label>
              <select
                name="lessonType"
                value={formData.lessonType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Lab">Lab</option>
                <option value="Discussion">Discussion</option>
                <option value="Project">Project</option>
                <option value="Review">Review</option>
              </select>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Learning Objectives (Optional)
            </label>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              placeholder="e.g., Students will be able to explain the process of photosynthesis and identify the key components involved."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Available Resources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Available Resources (Optional)
            </label>
            <textarea
              name="resources"
              value={formData.resources}
              onChange={handleInputChange}
              placeholder="e.g., Textbooks, Projector, Lab equipment, Videos, Charts, Models"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-red-500 text-lg">⚠️</span>
                <div>
                  <p className="text-red-600 dark:text-red-400 font-medium">Error Generating Lesson Plan</p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                  <div className="mt-2 text-xs text-red-500 dark:text-red-300">
                    <p><strong>Troubleshooting tips:</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Ensure Ollama is running on your system</li>
                      <li>Check that the 'gemma3:1b' model is installed</li>
                      <li>Try with simpler subject and topic names</li>
                      <li>Check your internet connection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Lesson Plan...
                </span>
              ) : (
                '🚀 Generate Lesson Plan'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Lesson Plan Results */}
        {aiResponse && aiResponse.lesson_plan && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            {console.log('Rendering lesson plan:', aiResponse.lesson_plan)}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  AI-Generated Lesson Plan
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Comprehensive lesson plan with objectives, activities, and assessments
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
              {/* Lesson Title */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  📘 {aiResponse.lesson_plan.lesson_title || 'Generated Lesson Plan'}
                </h4>
              </div>

              {/* Dynamic content rendering */}
              {Object.entries(aiResponse.lesson_plan).map(([key, value]) => {
                if (key === 'lesson_title') return null; // Already displayed above

                if (Array.isArray(value) && value.length > 0) {
                  return (
                    <div key={key}>
                      <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        📋 {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h5>
                      <ul className="space-y-2">
                        {value.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                } else if (typeof value === 'string' && value.trim()) {
                  return (
                    <div key={key}>
                      <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        📄 {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        {value}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                💾 Save Lesson Plan
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                📊 Assign to Students
              </button>
              <button 
                onClick={exportToPDF}
                className="col-span-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => {
                  console.log('Test PDF button clicked');
                  try {
                    const doc = new jsPDF();
                    doc.setFontSize(20);
                    doc.text('Test PDF Export', 105, 20, { align: 'center' });
                    doc.setFontSize(12);
                    doc.text('If you can see this, PDF export is working!', 20, 40);
                    doc.save('test_export.pdf');
                    console.log('Test PDF generated successfully');
                  } catch (error) {
                    console.error('Test PDF error:', error);
                    alert('Test PDF failed: ' + error.message);
                  }
                }}
                className="col-span-2 px-4 py-2 border border-blue-300 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🧪 Test PDF Export
              </button>
            </div>
          </div>
        )}

        {/* Fallback display for raw response */}
        {aiResponse && !aiResponse.lesson_plan && aiResponse.lessonPlan && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  AI-Generated Lesson Plan
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Lesson plan generated successfully
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                {typeof aiResponse.lessonPlan === 'string' ? aiResponse.lessonPlan : JSON.stringify(aiResponse.lessonPlan, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                💾 Save Lesson Plan
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                📊 Assign to Students
              </button>
              <button 
                onClick={exportToPDF}
                className="col-span-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>Export PDF</span>
              </button>
              <button 
                onClick={() => {
                  console.log('Test PDF button clicked');
                  try {
                    const doc = new jsPDF();
                    doc.setFontSize(20);
                    doc.text('Test PDF Export', 105, 20, { align: 'center' });
                    doc.setFontSize(12);
                    doc.text('If you can see this, PDF export is working!', 20, 40);
                    doc.save('test_export.pdf');
                    console.log('Test PDF generated successfully');
                  } catch (error) {
                    console.error('Test PDF error:', error);
                    alert('Test PDF failed: ' + error.message);
                  }
                }}
                className="col-span-2 px-4 py-2 border border-blue-300 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                🧪 Test PDF Export
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LessonPlannerModal;
