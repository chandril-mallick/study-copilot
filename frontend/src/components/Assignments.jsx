import React, { useState } from 'react';

const Assignments = ({ viewMode = 'student' }) => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Advanced Calculus Problem Set',
      subject: 'Mathematics',
      description: 'Solve problems 1-10 from chapter 5 on differential equations.',
      dueDate: '2024-01-20',
      status: 'pending', // pending, submitted, graded
      submissionDate: null,
      grade: null,
      feedback: null,
      maxGrade: 100,
      isTeacher: false
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Write a lab report on the pendulum experiment including calculations and conclusions.',
      dueDate: '2024-01-18',
      status: 'submitted',
      submissionDate: '2024-01-17',
      grade: null,
      feedback: null,
      maxGrade: 50,
      isTeacher: false
    },
    {
      id: 3,
      title: 'Computer Science Project',
      subject: 'Computer Science',
      description: 'Develop a simple web application using React and Node.js.',
      dueDate: '2024-01-25',
      status: 'graded',
      submissionDate: '2024-01-24',
      grade: 85,
      feedback: 'Good work! The application is functional but could use better error handling.',
      maxGrade: 100,
      isTeacher: false
    }
  ]);

  const [teacherAssignments] = useState([
    {
      id: 4,
      title: 'Mathematics Midterm Exam',
      subject: 'Mathematics',
      description: 'Comprehensive midterm covering chapters 1-6.',
      dueDate: '2024-01-22',
      submissions: 45,
      graded: 32,
      status: 'active'
    },
    {
      id: 5,
      title: 'Physics Quiz',
      subject: 'Physics',
      description: 'Short quiz on mechanics principles.',
      dueDate: '2024-01-19',
      submissions: 48,
      graded: 48,
      status: 'completed'
    }
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [plagiarismCheck, setPlagiarismCheck] = useState(null);

  const handleSubmitAssignment = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionFile(file);
      // Simulate plagiarism check
      setTimeout(() => {
        const similarity = Math.floor(Math.random() * 20); // 0-20% similarity
        setPlagiarismCheck({
          similarity: similarity,
          status: similarity < 10 ? 'low' : similarity < 20 ? 'medium' : 'high',
          report: `Detected ${similarity}% similarity with existing content. ${similarity < 10 ? 'This appears to be original work.' : similarity < 20 ? 'Some similarities found, please review.' : 'High similarity detected, please ensure originality.'}`
        });
      }, 2000);
    }
  };

  const handleConfirmSubmission = () => {
    if (!submissionFile) return;

    setAssignments(prev => prev.map(assignment =>
      assignment.id === selectedAssignment.id
        ? {
            ...assignment,
            status: 'submitted',
            submissionDate: new Date().toISOString().split('T')[0],
            grade: null,
            feedback: null
          }
        : assignment
    ));

    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionFile(null);
    setPlagiarismCheck(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'submitted': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'graded': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400';
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                 {viewMode === 'teacher' ? '📋 Assignments Dashboard' : '📝 My Assignments'}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                 {viewMode === 'teacher' ? 'Manage, Grade, and Distribute Assignments' : 'Track your pending tasks and submissions'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'student' ? (
        <>
          {/* Student Assignments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span>
              My Assignments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="group bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      assignment.status === 'pending' ? 'bg-yellow-400' : 
                      assignment.status === 'submitted' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>

                  <div className="flex justify-between items-start mb-3 pl-3">
                     <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{assignment.subject}</span>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                     </span>
                  </div>

                  <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 pl-3 group-hover:text-blue-600 transition-colors">
                    {assignment.title}
                  </h4>

                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 pl-3 line-clamp-2">
                    {assignment.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 pl-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                       <span>📅</span> Due: <span className="font-medium text-gray-700 dark:text-gray-200">{assignment.dueDate}</span>
                    </div>
                    {assignment.grade && (
                       <div className="flex items-center gap-1">
                          <span>🏆</span> Grade: <span className={getGradeColor(assignment.grade)}>{assignment.grade}/{assignment.maxGrade}</span>
                       </div>
                    )}
                  </div>

                  {/* Feedback Section */}
                  {assignment.feedback && (
                     <div className="ml-3 mb-4 text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 text-gray-600 italic">
                        " {assignment.feedback} "
                     </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pl-3 mt-auto pt-3 border-t border-gray-100 dark:border-gray-600 flex gap-3">
                    {assignment.status === 'pending' && (
                       <button
                         onClick={() => handleSubmitAssignment(assignment.id)}
                         className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                       >
                         <span>📤</span> Submit Work
                       </button>
                    )}
                    {assignment.status === 'submitted' && (
                       <div className="flex-1 text-center py-2 text-sm text-blue-600 bg-blue-50 rounded-lg font-medium">
                          <span className="animate-pulse">●</span> Processing Grade
                       </div>
                    )}
                    {assignment.status === 'graded' && (
                       <button className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-green-200">
                          View Detailed Report
                       </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions for Students */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">🚀 Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                📋 View All
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                ⏰ Due Soon
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                ✅ Completed
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                📊 Grades
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Teacher Assignments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Assignment Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block mb-2">
                        {assignment.subject}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {assignment.dueDate}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      assignment.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Submissions: {assignment.submissions}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        Graded: {assignment.graded}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(assignment.graded / assignment.submissions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium">
                      View Submissions
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-xs font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions for Teachers */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">🚀 Teacher Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                ➕ Create Assignment
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                📊 Grade Reports
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                💬 Send Feedback
              </button>
              <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
                📈 Analytics
              </button>
            </div>
          </div>
        </>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Submit Assignment: {selectedAssignment.title}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {plagiarismCheck && (
                <div className={`p-3 rounded-lg ${
                  plagiarismCheck.status === 'low' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                  plagiarismCheck.status === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                  'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                    Plagiarism Check Results
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Similarity: <span className={`font-semibold ${
                      plagiarismCheck.status === 'low' ? 'text-green-600 dark:text-green-400' :
                      plagiarismCheck.status === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {plagiarismCheck.similarity}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {plagiarismCheck.report}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmSubmission}
                  disabled={!submissionFile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Submit Assignment
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedAssignment(null);
                    setSubmissionFile(null);
                    setPlagiarismCheck(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">🔮 Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-blue-500">📱</span>
            <span className="text-gray-600 dark:text-gray-300">Mobile App Integration</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">🤖</span>
            <span className="text-gray-600 dark:text-gray-300">AI Grading Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-500">📊</span>
            <span className="text-gray-600 dark:text-gray-300">Advanced Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-500">📧</span>
            <span className="text-gray-600 dark:text-gray-300">Automated Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
