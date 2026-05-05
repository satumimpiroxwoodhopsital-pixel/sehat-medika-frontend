import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Briefcase, MapPin, Clock } from 'lucide-react';
import { useJobStore } from '../../stores/jobStore';
import type { Job, FormQuestion } from '../../types';

const JobsManage = () => {
  const { jobs, addJob, updateJob, deleteJob } = useJobStore();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', department: '', type: 'full-time' as Job['type'], location: '', description: '', requirements: [''],
    form_questions: [] as FormQuestion[], is_published: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      title: formData.title,
      department: formData.department,
      type: formData.type,
      location: formData.location,
      description: formData.description,
      requirements: formData.requirements.filter(r => r.trim()),
      form_questions: formData.form_questions,
      is_published: formData.is_published,
    };
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      const newJob: Job = {
        id: Date.now().toString(),
        ...jobData,
        is_closed: false,
        posted_date: new Date().toISOString().split('T')[0],
      };
      addJob(newJob);
    }
    setShowForm(false); setEditingJob(null);
    setFormData({ title: '', department: '', type: 'full-time', location: '', description: '', requirements: [''], form_questions: [], is_published: true });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title, department: job.department, type: job.type, location: job.location,
      description: job.description, requirements: [...job.requirements], form_questions: [...(job.form_questions || [])],
      is_published: job.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => { deleteJob(id); setShowDeleteConfirm(null); };
  const toggleStatus = (id: string, field: 'is_published' | 'is_closed') => {
    const job = jobs.find(j => j.id === id);
    if (job) updateJob(id, { [field]: !job[field] } as any);
  };

  const addRequirement = () => { setFormData({ ...formData, requirements: [...formData.requirements, ''] }); };
  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...formData.requirements]; newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  const addQuestion = () => {
    const newQ: FormQuestion = {
      id: Date.now().toString(), question: '', type: 'text', required: false, options: [],
    };
    setFormData({ ...formData, form_questions: [...formData.form_questions, newQ] });
  };
  const updateQuestion = (index: number, updated: Partial<FormQuestion>) => {
    const newQs = [...formData.form_questions];
    newQs[index] = { ...newQs[index], ...updated };
    setFormData({ ...formData, form_questions: newQs });
  };
  const removeQuestion = (index: number) => {
    setFormData({ ...formData, form_questions: formData.form_questions.filter((_, i) => i !== index) });
  };
  const updateQuestionOption = (qIndex: number, oIndex: number, value: string) => {
    const newQs = [...formData.form_questions];
    const opts = [...(newQs[qIndex].options || [])]; opts[oIndex] = value;
    newQs[qIndex] = { ...newQs[qIndex], options: opts };
    setFormData({ ...formData, form_questions: newQs });
  };
  const addOption = (qIndex: number) => {
    const newQs = [...formData.form_questions];
    newQs[qIndex] = { ...newQs[qIndex], options: [...(newQs[qIndex].options || []), ''] };
    setFormData({ ...formData, form_questions: newQs });
  };
  const removeOption = (qIndex: number, oIndex: number) => {
    const newQs = [...formData.form_questions];
    newQs[qIndex] = { ...newQs[qIndex], options: newQs[qIndex].options?.filter((_, i) => i !== oIndex) || [] };
    setFormData({ ...formData, form_questions: newQs });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-600 mt-1">{jobs.filter(j => !j.is_closed).length} open positions</p></div>
        <button onClick={() => { setShowForm(true); setEditingJob(null);
          setFormData({ title: '', department: '', type: 'full-time', location: '', description: '', requirements: [''], form_questions: [], is_published: true }); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Job</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as Job['type']})}
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

              {/* Form Creator Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Form Creator - Custom Questions</label>
                  <button type="button" onClick={addQuestion} className="text-sm text-primary hover:text-primary-dark">+ Add Question</button>
                </div>
                {formData.form_questions.map((q, qIdx) => (
                  <div key={q.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-500">Question {qIdx + 1}</span>
                      <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input type="text" value={q.question} onChange={e => updateQuestion(qIdx, { question: e.target.value })}
                      className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Enter your question" />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <select value={q.type} onChange={e => updateQuestion(qIdx, { type: e.target.value as FormQuestion['type'], options: ['select','checkbox','radio'].includes(e.target.value) ? q.options : [] })}>
                        <option value="text">Text Input</option>
                        <option value="textarea">Text Area</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio Button</option>
                      </select>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={q.required} onChange={e => updateQuestion(qIdx, { required: e.target.checked })} />
                        <span className="text-sm">Required</span>
                      </label>
                    </div>
                    {['select','checkbox','radio'].includes(q.type) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Options</label>
                        {(q.options || []).map((opt, oIdx) => (
                          <div key={oIdx} className="flex gap-2 mb-1">
                            <input type="text" value={opt} onChange={e => updateQuestionOption(qIdx, oIdx, e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded" placeholder={`Option ${oIdx + 1}`} />
                            <button type="button" onClick={() => removeOption(qIdx, oIdx)} className="text-red-500">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addOption(qIdx)} className="text-xs text-primary hover:text-primary-dark">+ Add Option</button>
                      </div>
                    )}
                  </div>
                ))}
                {formData.form_questions.length === 0 && (
                  <p className="text-sm text-gray-400">No custom questions yet. Click "+ Add Question" to create form fields for applicants.</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark">{editingJob ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                  {job.form_questions && job.form_questions.length > 0 && (
                    <span className="flex items-center gap-1 text-blue-600">{job.form_questions.length} custom question(s)</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(job.id, 'is_published')} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${job.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {job.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {job.is_published ? 'Published' : 'Draft'}
                </button>
                <button onClick={() => toggleStatus(job.id, 'is_closed')} className={`px-2 py-1 rounded-full text-xs font-medium ${job.is_closed ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {job.is_closed ? 'Closed' : 'Open'}
                </button>
                <button onClick={() => handleEdit(job)} className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setShowDeleteConfirm(job.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Job?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManage;
