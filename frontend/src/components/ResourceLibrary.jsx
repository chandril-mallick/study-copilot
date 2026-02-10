import React, { useState } from 'react';

const ResourceLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);

  const [universityResources] = useState([
    {
      id: 1,
      title: 'Advanced Calculus Syllabus',
      type: 'Syllabus',
      subject: 'Mathematics',
      description: 'Complete syllabus for Advanced Calculus course including topics and grading criteria.',
      url: '#',
      tags: ['mathematics', 'calculus', 'syllabus'],
      addedDate: '2024-01-10',
      isOfficial: true
    },
    {
      id: 2,
      title: 'Physics Lab Manual',
      type: 'Lab Manual',
      subject: 'Physics',
      description: 'Comprehensive lab manual with experiments and safety procedures.',
      url: '#',
      tags: ['physics', 'lab', 'experiments'],
      addedDate: '2024-01-08',
      isOfficial: true
    },
    {
      id: 3,
      title: 'Computer Science Project Guidelines',
      type: 'Guidelines',
      subject: 'Computer Science',
      description: 'Detailed guidelines for semester projects including requirements and deadlines.',
      url: '#',
      tags: ['computer-science', 'projects', 'guidelines'],
      addedDate: '2024-01-05',
      isOfficial: true
    }
  ]);

  const [externalResources] = useState([
    {
      id: 4,
      title: 'Khan Academy - Linear Algebra',
      type: 'Video Course',
      subject: 'Mathematics',
      description: 'Comprehensive video series on linear algebra fundamentals.',
      url: 'https://www.khanacademy.org/math/linear-algebra',
      tags: ['mathematics', 'linear-algebra', 'videos'],
      addedDate: '2024-01-12',
      isOfficial: false
    },
    {
      id: 5,
      title: 'MIT OpenCourseWare - Physics I',
      type: 'Course Materials',
      subject: 'Physics',
      description: 'Free course materials from MIT including lectures and problem sets.',
      url: 'https://ocw.mit.edu/courses/physics/8-01sc-classical-mechanics-fall-2016/',
      tags: ['physics', 'mechanics', 'course-materials'],
      addedDate: '2024-01-09',
      isOfficial: false
    },
    {
      id: 6,
      title: 'freeCodeCamp - JavaScript Algorithms',
      type: 'Interactive Tutorial',
      subject: 'Computer Science',
      description: 'Interactive coding challenges and tutorials for JavaScript algorithms.',
      url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
      tags: ['computer-science', 'javascript', 'algorithms'],
      addedDate: '2024-01-07',
      isOfficial: false
    }
  ]);

  const [personalResources, setPersonalResources] = useState([
    {
      id: 7,
      title: 'My Calculus Notes',
      type: 'Notes',
      subject: 'Mathematics',
      description: 'Personal notes from calculus lectures.',
      url: '#',
      tags: ['mathematics', 'calculus', 'personal-notes'],
      addedDate: '2024-01-15',
      isOfficial: false
    }
  ]);

  const [newResource, setNewResource] = useState({
    title: '',
    type: 'Notes',
    subject: '',
    description: '',
    url: '',
    tags: ''
  });

  const categories = [
    { id: 'all', name: 'All Resources', count: universityResources.length + externalResources.length + personalResources.length },
    { id: 'university', name: 'University Materials', count: universityResources.length },
    { id: 'external', name: 'External Resources', count: externalResources.length },
    { id: 'personal', name: 'My Library', count: personalResources.length }
  ];

  const getAllResources = () => {
    return [...universityResources, ...externalResources, ...personalResources];
  };

  const filteredResources = getAllResources().filter(resource => {
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'university' && resource.isOfficial) ||
      (activeCategory === 'external' && !resource.isOfficial && resource.id > 3) ||
      (activeCategory === 'personal' && resource.id > 6);

    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleAddResource = () => {
    if (!newResource.title || !newResource.subject || !newResource.description) return;

    const resource = {
      id: Date.now(),
      ...newResource,
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      addedDate: new Date().toISOString().split('T')[0],
      isOfficial: false
    };

    setPersonalResources(prev => [...prev, resource]);
    setShowAddModal(false);
    setNewResource({ title: '', type: 'Notes', subject: '', description: '', url: '', tags: '' });
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Syllabus': return '📋';
      case 'Lab Manual': return '🔬';
      case 'Guidelines': return '📋';
      case 'Video Course': return '🎥';
      case 'Course Materials': return '📚';
      case 'Interactive Tutorial': return '💻';
      case 'Notes': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">📚 Enhanced Resource Library</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Access university materials, external resources, and manage your personal library
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              ➕ Add Resource
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Resources Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getResourceIcon(resource.type)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-1">
                      {resource.title}
                    </h3>
                    <p className={`text-xs px-2 py-1 rounded inline-block mb-2 ${
                      resource.isOfficial
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {resource.type}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  resource.isOfficial
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {resource.subject}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Added: {resource.addedDate}
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium">
                  {resource.url.startsWith('http') ? 'Open' : 'View'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-2xl flex-shrink-0">{getResourceIcon(resource.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          resource.isOfficial
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {resource.type}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          {resource.subject}
                        </span>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium">
                      {resource.url.startsWith('http') ? 'Open' : 'View'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Added: {resource.addedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">🚀 Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
            📚 Browse University
          </button>
          <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
            🌐 External Resources
          </button>
          <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
            📝 My Library
          </button>
          <button className="bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 dark:border-gray-500">
            ⭐ Favorites
          </button>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Resource</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Resource title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option>Notes</option>
                    <option>Video</option>
                    <option>Article</option>
                    <option>Book</option>
                    <option>Website</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Subject"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL (optional)
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddResource}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add Resource
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Features */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">🔮 Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-blue-500">⭐</span>
            <span className="text-gray-600 dark:text-gray-300">Resource Rating System</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500">🔗</span>
            <span className="text-gray-600 dark:text-gray-300">Smart Recommendations</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-500">📱</span>
            <span className="text-gray-600 dark:text-gray-300">Offline Access</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-500">🤝</span>
            <span className="text-gray-600 dark:text-gray-300">Collaborative Annotations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;
