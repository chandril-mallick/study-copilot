import React, { useState, useEffect, useRef } from 'react';
import { studyGroupService } from '../services/studyGroupService';
import { authService } from '../services/authService';
import { 
  Loader2, Users, MessageSquare, Plus, X, AlertCircle, Search, 
  Filter, Send, Clock, User, CheckCircle2, Hash, ArrowLeft,
  Crown, Settings
} from 'lucide-react';
import Toast from './Toast';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

const StudyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Group chat state
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
    maxMembers: 10
  });

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSubject]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupDetails();
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studyGroupService.getStudyGroups(filterSubject !== 'all' ? filterSubject : null);
      setGroups(data);
    } catch (err) {
      setError('Failed to load study groups. Please try again.');
      console.error('Error fetching groups:', err);
      setToast({ message: 'Failed to load study groups', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async () => {
    if (!selectedGroup) return;
    try {
      const details = await studyGroupService.getStudyGroup(selectedGroup.id);
      setGroupDetails(details);
      // Fetch members (we'll need to add this to backend or get from group details)
    } catch (err) {
      console.error('Error fetching group details:', err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedGroup) return;
    setLoadingMessages(true);
    try {
      const data = await studyGroupService.getGroupMessages(selectedGroup.id);
      setMessages(data.reverse()); // Reverse to show oldest first
    } catch (err) {
      console.error('Error fetching messages:', err);
      setToast({ message: 'Failed to load messages', type: 'error' });
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await studyGroupService.getGroupSuggestions();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await studyGroupService.joinGroup(groupId);
      setToast({ message: 'Successfully joined study group!', type: 'success' });
      fetchGroups(); // Refresh list
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to join group';
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    try {
      await studyGroupService.leaveGroup(groupId);
      setToast({ message: 'Successfully left study group', type: 'success' });
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
      fetchGroups(); // Refresh list
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to leave group';
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.subject || !newGroup.description) {
      setToast({ message: 'Please fill in all fields', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      await studyGroupService.createStudyGroup(newGroup);
      setToast({ message: 'Study group created successfully!', type: 'success' });
      setShowCreateModal(false);
      setNewGroup({ name: '', subject: '', description: '', maxMembers: 10 });
      fetchGroups(); // Refresh list
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create group';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterGroup = async (group) => {
    if (!group.is_member) {
      setToast({ message: 'You must join the group first', type: 'warning' });
      return;
    }
    setSelectedGroup(group);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup) return;

    setSendingMessage(true);
    try {
      await studyGroupService.postGroupMessage(selectedGroup.id, newMessage.trim());
      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to send message';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Engineering', 'Business', 'Other'];

  if (selectedGroup) {
    // Group Chat View
    return (
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="glass-card rounded-card-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 rounded-lg hover:bg-charcoal-light/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                  {selectedGroup.name}
                  {selectedGroup.is_member && (
                    <Badge variant="outline" className="bg-emerald-DEFAULT/20 text-emerald-DEFAULT border-emerald-DEFAULT/50">
                      Member
                    </Badge>
                  )}
                </h2>
                <p className="text-sm text-gray-400">{selectedGroup.subject} • {selectedGroup.members_count}/{selectedGroup.max_members} members</p>
              </div>
            </div>
            <button
              onClick={() => handleLeaveGroup(selectedGroup.id)}
              className="px-3 py-2 rounded-card bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
            >
              Leave Group
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 glass-card rounded-card-lg overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {loadingMessages && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-neon-blue" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isCurrentUser = msg.user_id === authService.getCurrentUser()?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isCurrentUser ? 'bg-neon-blue text-white' : 'bg-charcoal-light text-gray-300'}>
                          {msg.user_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">{msg.user_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? 'bg-neon-blue text-white'
                              : 'bg-charcoal-light/50 text-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-charcoal-light/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="px-4 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  if (error && groups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card rounded-card-lg p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchGroups}
            className="px-4 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-neon-blue" />
              Study Groups
            </h1>
            <p className="text-gray-400">Connect with fellow students for collaborative learning</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowSuggestions(!showSuggestions);
                if (!showSuggestions) fetchSuggestions();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-card bg-emerald-DEFAULT/20 hover:bg-emerald-DEFAULT/30 text-emerald-DEFAULT font-medium transition-colors"
            >
              <Hash className="h-4 w-4" />
              Suggestions
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-card bg-gradient-to-r from-neon-blue to-emerald-DEFAULT text-white hover:shadow-neon transition-all font-medium"
            >
              <Plus className="h-5 w-5" />
              Create Group
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="glass-card rounded-card-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
              <Hash className="h-5 w-5 text-emerald-DEFAULT" />
              Suggested Groups for You
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="p-2 rounded-lg hover:bg-charcoal-light/50"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((group) => (
              <div key={group.id} className="bg-charcoal-light/30 rounded-lg p-4 border border-emerald-DEFAULT/30">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{group.name}</h4>
                  <Badge className="bg-emerald-DEFAULT/20 text-emerald-DEFAULT border-emerald-DEFAULT/50">
                    Suggested
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{group.subject}</p>
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  className="w-full px-3 py-2 rounded-card bg-emerald-DEFAULT hover:bg-emerald-DEFAULT/80 text-white text-sm font-medium transition-colors"
                >
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="glass-card rounded-card-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="glass-card rounded-card-lg p-12 text-center">
          <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">
            {searchTerm ? 'No Groups Found' : 'No Study Groups Yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a study group!'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white font-medium"
            >
              Create First Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <div key={group.id} className="glass-card rounded-card-lg p-6 hover:shadow-neon transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-white text-lg mb-1">{group.name}</h3>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                    {group.subject}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{group.members_count}/{group.max_members}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {group.description || 'No description provided'}
              </p>

              <div className="flex gap-2">
                {group.is_member ? (
                  <>
                    <button
                      onClick={() => handleEnterGroup(group)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-card bg-emerald-DEFAULT/20 hover:bg-emerald-DEFAULT/30 text-emerald-DEFAULT text-sm font-medium transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Enter Group
                    </button>
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      className="px-3 py-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white text-sm font-medium transition-colors"
                    >
                      Leave
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={group.members_count >= group.max_members}
                    className="w-full px-3 py-2 rounded-card bg-neon-blue hover:bg-neon-blue-dark text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {group.members_count >= group.max_members ? 'Group Full' : 'Join Group'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="glass-card rounded-card-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold text-white">Create New Study Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-charcoal-light/50">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  placeholder="e.g., Advanced Calculus Study"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <select
                  value={newGroup.subject}
                  onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Biology">Biology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 resize-none"
                  placeholder="Describe your study group..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Members</label>
                <input
                  type="number"
                  value={newGroup.maxMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) || 10 })}
                  min="2"
                  max="50"
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-card bg-gradient-to-r from-neon-blue to-emerald-DEFAULT text-white font-medium hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Group'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default StudyGroups;
