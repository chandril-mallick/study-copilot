import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    total_study_time: 0,
    completed_activities: 0,
    average_score: 0,
    streak_days: 0,
    weekly_progress: [],
    subject_performance: [],
    recent_activities: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // In a real app, this would call the backend API
        // For now, we'll use sample data
        setTimeout(() => {
          setAnalyticsData({
            total_study_time: 45,
            completed_activities: 12,
            average_score: 87,
            streak_days: 7,
            weekly_progress: [
              { week: 'Week 1', hours: 8, activities: 3 },
              { week: 'Week 2', hours: 12, activities: 5 },
              { week: 'Week 3', hours: 15, activities: 7 },
              { week: 'Week 4', hours: 10, activities: 4 }
            ],
            subject_performance: [
              { subject: 'Mathematics', score: 92, time_spent: 20 },
              { subject: 'Physics', score: 85, time_spent: 18 },
              { subject: 'Chemistry', score: 88, time_spent: 15 },
              { subject: 'Computer Science', score: 90, time_spent: 22 }
            ],
            recent_activities: [
              { activity: 'Completed Quiz', subject: 'Mathematics', score: 95, date: '2024-01-15' },
              { activity: 'Study Session', subject: 'Physics', time: 2, date: '2024-01-14' },
              { activity: 'Flashcard Review', subject: 'Chemistry', cards: 50, date: '2024-01-13' },
              { activity: 'Assignment Submitted', subject: 'Computer Science', grade: 'A', date: '2024-01-12' }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">📊 Analytics Dashboard</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Track your learning progress and performance insights
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{analyticsData.total_study_time}h</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Study Time</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{analyticsData.completed_activities}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Activities Completed</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{analyticsData.average_score}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Average Score</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{analyticsData.streak_days}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span>
            Weekly Progress
          </h3>
          <div className="space-y-3">
            {analyticsData.weekly_progress.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {week.week.slice(-1)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{week.week}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{week.activities} activities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">{week.hours}h</p>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-500 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(week.hours / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Subject Performance
          </h3>
          <div className="space-y-3">
            {analyticsData.subject_performance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` }}></div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{subject.subject}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{subject.time_spent}h studied</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">{subject.score}%</p>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-500 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          Recent Activities
        </h3>
        <div className="space-y-3">
          {analyticsData.recent_activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm">
                    {activity.activity.includes('Quiz') ? '🧠' :
                     activity.activity.includes('Study') ? '📚' :
                     activity.activity.includes('Flashcard') ? '🗂️' : '📝'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{activity.activity}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{activity.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {activity.score ? `${activity.score}%` :
                   activity.time ? `${activity.time}h` :
                   activity.cards ? `${activity.cards} cards` :
                   activity.grade || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 text-center">💡 AI Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="font-medium text-blue-100 mb-1">🏆 Best Performance</p>
            <p className="text-white">
              Your strongest subject is Mathematics with 92% average score. Keep up the excellent work!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="font-medium text-blue-100 mb-1">🎯 Improvement Area</p>
            <p className="text-white">
              Consider spending more time on Chemistry to improve your overall performance.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="font-medium text-blue-100 mb-1">⏰ Study Pattern</p>
            <p className="text-white">
              You're most productive in the evenings. Schedule difficult subjects for that time.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="font-medium text-blue-100 mb-1">🚀 Next Goal</p>
            <p className="text-white">
              Aim for 50 hours of study time this month to maintain your current streak!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
