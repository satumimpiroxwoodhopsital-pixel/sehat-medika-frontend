import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';

const JobDetail = () => {
  const { id } = useParams();
  const { jobs } = useJobStore();
  const job = jobs.find(j => j.id === id);

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

  const typeLabel = (type: string) => {
    switch(type) {
      case 'full-time': return 'Full-Time';
      case 'part-time': return 'Part-Time';
      case 'contract': return 'Contract';
      default: return type;
    }
  };

  const typeBadgeColor = (type: string) => {
    switch(type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-orange-100 text-orange-800';
      case 'contract': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/careers/jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Listings
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {job.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Posted {new Date(job.posted_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${typeBadgeColor(job.type)}`}>
              {typeLabel(job.type)}
            </span>
          </div>

          <Link
            to={`/careers/jobs/${job.id}/apply`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-50 text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium text-gray-900">{job.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium text-gray-900">{typeLabel(job.type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium text-gray-900">{new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Link
              to={`/careers/jobs/${job.id}/apply`}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
