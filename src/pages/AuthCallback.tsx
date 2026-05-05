import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { useAuthStore } from '../admin/utils/authStore';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { patient, isAuthenticated: patientAuth } = usePatientAuthStore();
  const { isAuthenticated: adminAuth } = useAuthStore();

  useEffect(() => {
    const type = params.get('type') || 'patient';

    supabase.auth.getSession().then(({ data }: any) => {
      if (data.session) {
        if (type === 'admin' || adminAuth) {
          navigate('/admin/dashboard', { replace: true });
        } else if (patient || patientAuth) {
          if (patient?.profileCompleted) {
            navigate('/patient/dashboard', { replace: true });
          } else {
            navigate('/patient/profile', { replace: true });
          }
        } else {
          setTimeout(() => {
            const p = usePatientAuthStore.getState().patient;
            if (p) {
              if (p.profileCompleted) {
                navigate('/patient/dashboard', { replace: true });
              } else {
                navigate('/patient/profile', { replace: true });
              }
            } else {
              navigate('/patient/login', { replace: true });
            }
          }, 1000);
        }
      } else {
        if (type === 'admin') {
          navigate('/admin/login', { replace: true });
        } else {
          navigate('/patient/login', { replace: true });
        }
      }
    });
  }, [params, navigate, patient, patientAuth, adminAuth]);

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
