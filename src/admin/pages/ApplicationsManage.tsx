import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useJobStore } from '../../stores/jobStore';
import { useApplicationStore } from '../../stores/applicationStore';
import type { Job } from '../../types';

const statusColors: { [key: string]: string } = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  interviewed: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-green-100 text-green-800',
};

const ApplicationsManage = () => {
  const { jobs, addJob } = useJobStore();
  const { applications, updateApplicationStatus } = useApplicationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [showJobForm, setShowJobForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', department: '', type: 'full-time' as Job['type'], location: '', description: '', requirements: [''], is_published: true,
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.discord_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = selectedJob === 'all' || app.job_id === selectedJob;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getJobTitle = (jobId: string) => jobs.find(j => j.id === jobId)?.title || 'Unknown';

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Date.now().toString(),
      title: formData.title,
      department: formData.department,
      type: formData.type,
      location: formData.location,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim()),
      form_questions: [],
      is_published: true,
      is_closed: false,
      posted_date: new Date().toISOString().split('T')[0],
    };
    addJob(newJob);
    setShowJobForm(false);
    setFormData({ title: '', department: '', type: 'full-time', location: '', description: '', requirements: [''], is_published: true });
  };

  const addRequirement = () => setFormData({ ...formData, requirements: [...formData.requirements, ''] });
  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...formData.requirements]; newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">{applications.length} total applications</p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Job</h2>
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as Job['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                    <option value="full-time">Full-Time</option><option value="part-time">Part-Time</option><option value="contract">Contract</option>
                  </select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                {formData.requirements.map((req, idx) => (
                  <input key={idx} type="text" value={req} onChange={e => updateRequirement(idx, e.target.value)}
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder={`Requirement ${idx + 1}`} />
                ))}
                <button type="button" onClick={addRequirement} className="text-sm text-primary hover:text-primary-dark">+ Add Requirement</button>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowJobForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or Discord ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="interviewed">Interviewed</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Job</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Discord ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{app.applicant_name}</p>
                    <p className="text-xs text-gray-500">{app.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getJobTitle(app.job_id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.discord_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && <div className="text-center py-8 text-gray-500">No applications found.</div>}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsManage;
