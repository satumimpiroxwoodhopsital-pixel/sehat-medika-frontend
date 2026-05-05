import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { usePatientStore } from '../stores/patientStore';
import { useAdminAuthStore } from '../admin/utils/authStore';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login: patientLogin } = usePatientAuthStore();
  const { fetchPatients } = usePatientStore();
  const { login: adminLogin, setToken } = useAdminAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const type = params.get('type');
    const needsProfile = params.get('needsProfile') === 'true';

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const decoded = atob(token);
      const discordId = decoded.split(':')[0];

      if (type === 'patient') {
        fetchPatients();
        const patient = usePatientStore.getState().patients.find(p => p.discord_id === discordId);

        if (patient) {
          patientLogin({ ...patient, type: 'patient' });
          if (needsProfile || !patient.profileCompleted) {
            navigate('/patient/profile', { replace: true });
          } else {
            navigate('/patient/dashboard', { replace: true });
          }
        } else {
          navigate('/patient/login', { replace: true });
        }
      } else if (type === 'admin') {
        fetch(`/api/admin-profile?discord_id=${discordId}`)
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setToken(token);
              adminLogin(data.user);
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate('/admin/login', { replace: true });
            }
          })
          .catch(() => navigate('/admin/login', { replace: true }));
      }
    } catch {
      navigate('/', { replace: true });
    }
  }, [params, navigate, patientLogin, fetchPatients, adminLogin, setToken]);

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
