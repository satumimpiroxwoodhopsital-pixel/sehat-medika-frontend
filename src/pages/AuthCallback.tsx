import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { useAuthStore } from '../admin/utils/authStore';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { patient, isAuthenticated: patientAuth, loading } = usePatientAuthStore();
  const { isAuthenticated: adminAuth } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const type = params.get('type') || 'patient';

    // If already authenticated, redirect
    if (patient && patient.profileCompleted) {
      navigate('/patient/dashboard', { replace: true });
      return;
    }
    if (patient && !patient.profileCompleted) {
      navigate('/patient/profile', { replace: true });
      return;
    }
    if (adminAuth) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    // If still loading after 5 seconds, redirect to login
    const timer = setTimeout(() => {
      if (loading) {
        setError('Session not found. Redirecting to login...');
        setTimeout(() => {
          if (type === 'admin') {
            navigate('/admin/login', { replace: true });
          } else {
            navigate('/patient/login', { replace: true });
          }
        }, 2000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [params, navigate, patient, patientAuth, adminAuth, loading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
