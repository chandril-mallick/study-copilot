import React, { useState, useEffect } from 'react';
import { automationService } from '../../../services/automationService';
import { 
  Award, Plus, CheckCircle2, XCircle, Clock, Search, Filter,
  Loader2, AlertCircle, Eye, FileCheck, TrendingUp, Users
} from 'lucide-react';
import Toast from '../../../components/Toast';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const ScholarshipAutomation = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newApplication, setNewApplication] = useState({
    user_id: '',
    scholarship_type: 'merit',
    amount_requested: '',
    academic_performance: '',
    family_income: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const status = filterStatus !== 'all' ? filterStatus : null;
      const data = await automationService.getScholarshipApplications(status);
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setToast({ message: 'Failed to load applications', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await automationService.getScholarshipStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    try {
      await automationService.createScholarshipApplication({
        ...newApplication,
        user_id: parseInt(newApplication.user_id),
        amount_requested: parseFloat(newApplication.amount_requested),
        academic_performance: newApplication.academic_performance ? parseFloat(newApplication.academic_performance) : null,
        family_income: newApplication.family_income ? parseFloat(newApplication.family_income) : null
      });
      setToast({ message: 'Application created successfully!', type: 'success' });
      setShowCreateModal(false);
      setNewApplication({ user_id: '', scholarship_type: 'merit', amount_requested: '', academic_performance: '', family_income: '' });
      fetchApplications();
      fetchStats();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to create application', type: 'error' });
    }
  };

  const handleApprove = async (id, approvedAmount = null) => {
    try {
      await automationService.approveScholarship(id, approvedAmount);
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
      await automationService.rejectScholarship(id, reason);
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
      await automationService.verifyScholarshipDocuments(id, result, notes || null);
      setToast({ message: `Documents ${result}`, type: 'success' });
      fetchApplications();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to verify', type: 'error' });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.scholarship_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
              <Award className="h-8 w-8 text-yellow-500" />
              Scholarship Automation
            </h1>
            <p className="text-gray-400">AI-powered scholarship application processing</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-card bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-neon transition-all font-medium"
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
          <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No Applications Found</h3>
          <p className="text-gray-400 mb-6">Create a new scholarship application to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-card bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
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
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-2 capitalize">{app.scholarship_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white ml-2">₹{app.amount_requested.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Verification:</span>
                      <span className="text-white ml-2 capitalize">{app.verification_status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { /* View details - TODO: Implement details modal */ }}
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
              <h3 className="text-xl font-heading font-semibold text-white">Create Scholarship Application</h3>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Scholarship Type</label>
                <select
                  value={newApplication.scholarship_type}
                  onChange={(e) => setNewApplication({ ...newApplication, scholarship_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                >
                  <option value="merit">Merit-based</option>
                  <option value="need-based">Need-based</option>
                  <option value="sports">Sports</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount Requested (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newApplication.amount_requested}
                  onChange={(e) => setNewApplication({ ...newApplication, amount_requested: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Academic Performance (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newApplication.academic_performance}
                  onChange={(e) => setNewApplication({ ...newApplication, academic_performance: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Family Income (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newApplication.family_income}
                  onChange={(e) => setNewApplication({ ...newApplication, family_income: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-charcoal-light/30 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-card bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:shadow-neon transition-all"
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

export default ScholarshipAutomation;

