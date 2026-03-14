import React, { useState, useEffect } from 'react';
import { studentApplicationService } from '../../../services/studentApplicationService';
import { 
  Award, GraduationCap, Plus, Clock, CheckCircle2, 
  XCircle, Loader2, BookOpen, AlertCircle, FileText, Search
} from 'lucide-react';
import Toast from '../../../components/Toast';
import { Badge } from '../../../components/ui/badge';

const StudentApplications = () => {
  const [activeTab, setActiveTab] = useState('scholarships'); // 'scholarships' or 'admissions'
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modals
  const [showApplyScholarshipModal, setShowApplyScholarshipModal] = useState(false);
  const [showApplyAdmissionModal, setShowApplyAdmissionModal] = useState(false);

  // Forms
  const [scholarshipForm, setScholarshipForm] = useState({
    scholarship_type: 'merit',
    amount_requested: '',
    academic_performance: '',
    family_income: ''
  });

  const [admissionForm, setAdmissionForm] = useState({
    course_applied: '',
    department: '',
    previous_qualification: '',
    previous_percentage: '',
    entrance_exam_score: ''
  });

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      if (activeTab === 'scholarships') {
        const data = await studentApplicationService.getMyScholarshipApplications();
        setApplications(data.applications || []);
      } else {
        const data = await studentApplicationService.getMyAdmissionApplications();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}:`, err);
      // Fails silently if empty/error and shows 0, or show toast
      setToast({ message: `Failed to load ${activeTab}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyScholarship = async (e) => {
    e.preventDefault();
    try {
      await studentApplicationService.applyForScholarship({
        ...scholarshipForm,
        amount_requested: parseFloat(scholarshipForm.amount_requested),
        academic_performance: scholarshipForm.academic_performance ? parseFloat(scholarshipForm.academic_performance) : null,
        family_income: scholarshipForm.family_income ? parseFloat(scholarshipForm.family_income) : null
      });
      setToast({ message: 'Scholarship application submitted!', type: 'success' });
      setShowApplyScholarshipModal(false);
      setScholarshipForm({ scholarship_type: 'merit', amount_requested: '', academic_performance: '', family_income: '' });
      fetchApplications();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to submit application', type: 'error' });
    }
  };

  const handleApplyAdmission = async (e) => {
    e.preventDefault();
    try {
      await studentApplicationService.applyForAdmission({
        ...admissionForm,
        previous_percentage: admissionForm.previous_percentage ? parseFloat(admissionForm.previous_percentage) : null,
        entrance_exam_score: admissionForm.entrance_exam_score ? parseFloat(admissionForm.entrance_exam_score) : null
      });
      setToast({ message: 'Admission application submitted!', type: 'success' });
      setShowApplyAdmissionModal(false);
      setAdmissionForm({ course_applied: '', department: '', previous_qualification: '', previous_percentage: '', entrance_exam_score: '' });
      fetchApplications();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to submit application', type: 'error' });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { bg: 'bg-amber-500/20', text: 'text-amber-500', icon: <Clock className="w-3 h-3 mr-1"/> },
      under_review: { bg: 'bg-blue-500/20', text: 'text-blue-500', icon: <Search className="w-3 h-3 mr-1"/> },
      approved: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <CheckCircle2 className="w-3 h-3 mr-1"/> },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-500', icon: <XCircle className="w-3 h-3 mr-1"/> }
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={`${variant.bg} ${variant.text} border-none flex items-center capitalize`}>
        {variant.icon} {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getVerificationBadge = (status) => {
    if (!status || status === 'pending') return null;
    const isVerified = status === 'verified';
    return (
      <Badge className={`ml-2 ${isVerified ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'} border-none capitalize`}>
        {isVerified ? 'Docs Verified' : 'Docs Flagged'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="glass-card rounded-card-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-500" />
              My Applications
            </h1>
            <p className="text-gray-400">Manage and track your admissions and scholarships</p>
          </div>
          <div className="flex bg-charcoal-light/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scholarships' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Scholarships
            </button>
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admissions' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Admissions
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        {activeTab === 'scholarships' ? (
          <button
            onClick={() => setShowApplyScholarshipModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-card bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-neon transition-all font-medium"
          >
            <Plus className="h-5 w-5" />
            Apply for Scholarship
          </button>
        ) : (
          <button
            onClick={() => setShowApplyAdmissionModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-card bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-neon transition-all font-medium"
          >
            <Plus className="h-5 w-5" />
            Apply for Admission
          </button>
        )}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card rounded-card-lg p-12 text-center">
          {activeTab === 'scholarships' ? (
            <Award className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          ) : (
            <GraduationCap className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          )}
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No Applications Found</h3>
          <p className="text-gray-400 mb-6">You haven't submitted any {activeTab} applications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="glass-card rounded-card-lg p-6 hover:shadow-neon transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-white text-lg">{app.application_number}</h3>
                    {getStatusBadge(app.status)}
                    {getVerificationBadge(app.verification_status)}
                  </div>
                  <span className="text-xs text-gray-500">
                    Submitted on {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-4 p-4 rounded-xl bg-charcoal-light/30 border border-charcoal-light/20">
                {activeTab === 'scholarships' ? (
                  <>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase mb-1">Scholarship Type</span>
                      <span className="text-white capitalize font-medium">{app.scholarship_type.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase mb-1">Amount Requested</span>
                      <span className="text-white font-medium">₹{app.amount_requested.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase mb-1">Course Applied</span>
                      <span className="text-white font-medium">{app.course_applied}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase mb-1">Department</span>
                      <span className="text-white font-medium">{app.department}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scholarship Modal */}
      {showApplyScholarshipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="glass-card rounded-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold text-white">Apply for Scholarship</h3>
              <button onClick={() => setShowApplyScholarshipModal(false)} className="p-2 rounded-lg hover:bg-charcoal-light/50">
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleApplyScholarship} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scholarship Type</label>
                <select
                  value={scholarshipForm.scholarship_type}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, scholarship_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  value={scholarshipForm.amount_requested}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, amount_requested: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Academic Performance (GPA/%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={scholarshipForm.academic_performance}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, academic_performance: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Family Income (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={scholarshipForm.family_income}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, family_income: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-card bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:shadow-neon transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admission Modal */}
      {showApplyAdmissionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="glass-card rounded-card-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold text-white">Apply for Admission</h3>
              <button onClick={() => setShowApplyAdmissionModal(false)} className="p-2 rounded-lg hover:bg-charcoal-light/50">
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleApplyAdmission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Course Applying For</label>
                <input
                  type="text"
                  value={admissionForm.course_applied}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, course_applied: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Master of Computer Applications"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <select
                  value={admissionForm.department}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  value={admissionForm.previous_qualification}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, previous_qualification: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. B.Sc IT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Previous Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={admissionForm.previous_percentage}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, previous_percentage: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Entrance Exam Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={admissionForm.entrance_exam_score}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, entrance_exam_score: e.target.value })}
                  className="w-full px-4 py-3 rounded-card bg-charcoal-light/50 border border-gray-600 focus:border-indigo-500 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-card bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-neon transition-all"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default StudentApplications;
