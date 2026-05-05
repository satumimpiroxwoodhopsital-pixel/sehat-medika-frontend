import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Briefcase, ArrowRight } from 'lucide-react';

const JobApplicationConfirmation = () => {
  const location = useLocation();
  const { jobTitle } = location.state || {};

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Your job application has been successfully submitted.
          </p>
          {jobTitle && (
            <p className="text-gray-700 font-medium mb-8">
              Applied for: <span className="text-primary">{jobTitle}</span>
            </p>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">
                  Our HR team will review your application and contact you if your profile matches our requirements.
                  Thank you for your interest in joining Sehat Medika Hospital.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/careers/jobs"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse More Jobs <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationConfirmation;
