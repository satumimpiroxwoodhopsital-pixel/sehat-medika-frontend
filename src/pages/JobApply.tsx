import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, Send } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import { useApplicationStore } from '../stores/applicationStore';
import type { FormQuestion } from '../types';

const applicationSchema = z.object({
  applicant_name: z.string().min(2, 'Name must be at least 2 characters'),
  discord_id: z.string().min(2, 'Discord ID is required'),
  phone: z.string().optional(),
  cover_letter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formAnswers, setFormAnswers] = useState<{ [key: string]: string | string[] }>({});
  const { jobs } = useJobStore();

  const job = jobs.find(j => j.id === id);

  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });
  const { addApplication } = useApplicationStore();

  if (!job) {
    return (
      <div className="bg-bg-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Job not found.</p>
          <Link to="/careers/jobs" className="text-primary hover:text-primary-dark">
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  const questions: FormQuestion[] = job.form_questions || [];

  const handleAnswerChange = (questionId: string, value: string | string[], type: string) => {
    if (type === 'checkbox') {
      const current = (formAnswers[questionId] as string[]) || [];
      const arr = Array.isArray(current) ? current : [];
      const newArr = arr.includes(value as string)
        ? arr.filter(v => v !== value)
        : [...arr, value as string];
      setFormAnswers({ ...formAnswers, [questionId]: newArr });
    } else {
      setFormAnswers({ ...formAnswers, [questionId]: value });
    }
  };

  const validateAnswers = (): boolean => {
    for (const q of questions) {
      if (q.required) {
        const ans = formAnswers[q.id];
        if (!ans || (Array.isArray(ans) && ans.length === 0)) {
          alert(`Please answer required question: ${q.question}`);
          return false;
        }
      }
    }
    return true;
  };

  const onSubmit = (data: ApplicationFormData) => {
    if (!cvFile) {
      alert('Please upload your CV/Resume');
      return;
    }
    if (!validateAnswers()) return;

    const newApplication = {
      id: Date.now().toString(),
      job_id: job.id,
      applicant_name: data.applicant_name,
      discord_id: data.discord_id,
      phone: data.phone || '',
      cv_path: cvFile.name,
      cover_letter: data.cover_letter || '',
      form_answers: formAnswers,
      status: 'new' as const,
      applied_at: new Date().toISOString().split('T')[0],
    };
    addApplication(newApplication);
    navigate('/careers/jobs/confirmation', {
      state: { jobTitle: job.title }
    });
  };

  const renderQuestion = (q: FormQuestion) => {
    const isRequired = q.required;
    const error = isRequired && !formAnswers[q.id];

    switch (q.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(formAnswers[q.id] as string) || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value, 'text')}
            className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
            placeholder="Your answer"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={(formAnswers[q.id] as string) || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value, 'textarea')}
            rows={3}
            className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none`}
            placeholder="Your answer"
          />
        );
      case 'select':
        return (
          <select
            value={(formAnswers[q.id] as string) || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value, 'select')}
            className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white`}
          >
            <option value="">Select an option</option>
            {(q.options || []).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {(q.options || []).map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question_${q.id}`}
                  value={opt}
                  checked={(formAnswers[q.id] as string) === opt}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, 'radio')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(q.options || []).map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={opt}
                  checked={((formAnswers[q.id] as string[]) || []).includes(opt)}
                  onChange={() => handleAnswerChange(q.id, opt, 'checkbox')}
                  className="text-primary focus:ring-primary rounded"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to={`/careers/jobs/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h1>
          <p className="text-gray-600">{job.department} • {job.location}</p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                {...register('applicant_name')}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your full name"
              />
              {errors.applicant_name && <p className="text-red-500 text-sm mt-1">{errors.applicant_name.message}</p>}
            </div>

            {/* Discord ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discord ID *</label>
              <input
                {...register('discord_id')}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your Discord ID"
              />
              {errors.discord_id && <p className="text-red-500 text-sm mt-1">{errors.discord_id.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="+62 812 3456 7890"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CV / Resume *</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                />
                <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {cvFile && (
                <p className="text-sm text-green-600 mt-1">✓ {cvFile.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            {/* Custom Form Questions */}
            {questions.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Questions</h3>
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {idx + 1}. {q.question} {q.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderQuestion(q)}
                      {q.required && !formAnswers[q.id] && (
                        <p className="text-xs text-red-500 mt-1">This field is required</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
              <textarea
                {...register('cover_letter')}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                placeholder="Tell us why you're a great fit for this position..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              Submit Application <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApply;
