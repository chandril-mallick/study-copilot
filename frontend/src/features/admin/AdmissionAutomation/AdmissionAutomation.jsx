import React, { useState, useEffect } from 'react';
import { automationService } from '../../../services/automationService';
import { 
  GraduationCap, Plus, CheckCircle2, XCircle, Clock, Search, Filter,
  Loader2, Eye, FileCheck, TrendingUp, Users, BookOpen
} from 'lucide-react';
import Toast from '../../../components/Toast';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';

const AdmissionAutomation = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newApplication, setNewApplication] = useState({
    user_id: '',
    course_applied: '',
    department: '',
    previous_qualification: '',
    previous_percentage: '',
    entrance_exam_score: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filterStatus, filterDepartment]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const status = filterStatus !== 'all' ? filterStatus : null;
      const department = filterDepartment !== 'all' ? filterDepartment : null;
      const data = await automationService.getAdmissionApplications(status, department);
      setApplications(data);
    } catch (err) {
      setToast({ message: 'Failed to load applications', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await automationService.getAdmissionStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    try {
      await automationService.createAdmissionApplication({
        ...newApplication,
        user_id: parseInt(newApplication.user_id),
        previous_percentage: newApplication.previous_percentage ? parseFloat(newApplication.previous_percentage) : null,
        entrance_exam_score: newApplication.entrance_exam_score ? parseFloat(newApplication.entrance_exam_score) : null
      });
      setToast({ message: 'Application created successfully!', type: 'success' });
      setShowCreateModal(false);
      setNewApplication({ user_id: '', course_applied: '', department: '', previous_qualification: '', previous_percentage: '', entrance_exam_score: '' });
      fetchApplications();
      fetchStats();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to create application', type: 'error' });
    }
  };

  const handleApprove = async (id) => {
    try {
      await automationService.approveAdmission(id);
      setToast({ message: 'Application approved!', type: 'success' });
      fetchApplications();
      fetchStats();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to approve', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await automationService.rejectAdmission(id, reason);
      setToast({ message: 'Application rejected', type: 'success' });
      fetchApplications();
      fetchStats();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to reject', type: 'error' });
    }
  };

  const handleVerify = async (id, result) => {
    const notes = prompt('Enter verification notes (optional):');
    try {
      await automationService.verifyAdmissionDocuments(id, result, notes || null);
      setToast({ message: `Documents ${result}`, type: 'success' });
      fetchApplications();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to verify', type: 'error' });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.course_applied.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const departments = ['all', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Bio-Technology', 'Business', 'Other'];

  const getStatusBadge = (status) => {
    const variants = {
      pending: { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Pending' },
      under_review: { bg: 'bg-blue-500/20', text: 'text-blue-500', label: 'Under Review' },
      approved: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Approved' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Rejected' },
      verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-500', label: 'Verified' },
      flagged: { bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'Flagged' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={`${variant.bg} ${variant.text} border-none`}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="glass-card rounded-card-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-500" />
              Admission Automation
            </h1>
            <p className="text-gray-400">AI-powered admission application processing</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-card bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-neon transition-all font-medium"
          >
            <Plus className="h-5 w-5" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-neon-blue" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-white">{stats.rejected}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Approval Rate</p>
              <p className="text-2xl font-bold text-white">{stats.approval_rate}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card rounded-card-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-card rounded-card-lg p-12 text-center">
          <GraduationCap className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No Applications Found</h3>
          <p className="text-gray-400 mb-6">Create a new admission application to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-card bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            Create Application
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="glass-card rounded-card-lg p-6 hover:shadow-neon transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading font-semibold text-white text-lg">{app.application_number}</h3>
                    {getStatusBadge(app.status)}
                    {app.ai_score && (
                      <Badge className="bg-purple-500/20 text-purple-500 border-none">
                        AI Score: {app.ai_score.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Course:</span>
                      <span className="text-white ml-2">{app.course_applied}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Department:</span>
                      <span className="text-white ml-2">{app.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Verification:</span>
                      <span className="text-white ml-2 capitalize">{app.verification_status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { /* View details */ }}
                    className="p-2 rounded-card bg-charcoal-light/30 hover:bg-charcoal-light/50 text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {app.status === 'pending' || app.status === 'under_review' ? (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="p-2 rounded-card bg-green-500/20 hover:bg-green-500/30 text-green-500 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="p-2 rounded-card bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                  {app.verification_status === 'pending' ? (
                    <button
                      onClick={() => handleVerify(app.id, 'verified')}
                      className="p-2 rounded-card bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 transition-colors"
                      title="Verify Documents"
                    >
                      <FileCheck className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="glass-card rounded-card-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold text-white">Create Admission Application</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-charcoal-light/50">
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <input
                  type="number"
                  value={newApplication.user_id}
                  onChange={(e) => setNewApplication({ ...newApplication, user_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Course Applied</label>
                <input
                  type="text"
                  value={newApplication.course_applied}
                  onChange={(e) => setNewApplication({ ...newApplication, course_applied: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  placeholder="e.g., B.Tech Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <select
                  value={newApplication.department}
                  onChange={(e) => setNewApplication({ ...newApplication, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Bio-Technology">Bio-Technology</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Qualification</label>
                <input
                  type="text"
                  value={newApplication.previous_qualification}
                  onChange={(e) => setNewApplication({ ...newApplication, previous_qualification: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  placeholder="e.g., 12th Standard"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newApplication.previous_percentage}
                  onChange={(e) => setNewApplication({ ...newApplication, previous_percentage: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entrance Exam Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={newApplication.entrance_exam_score}
                  onChange={(e) => setNewApplication({ ...newApplication, entrance_exam_score: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-card bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-neon transition-all"
                >
                  Create Application
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

      {/* Toast */}
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

export default AdmissionAutomation;

