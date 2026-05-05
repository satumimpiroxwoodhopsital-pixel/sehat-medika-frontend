import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { usePatientStore } from '../stores/patientStore';
import { useAuthStore } from '../admin/utils/authStore';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login: patientLogin } = usePatientAuthStore();
  const { fetchPatients } = usePatientStore();
  const { loginWithDiscordOAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const type = params.get('type');
    const needsProfile = params.get('needsProfile') === 'true';

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const handleAuth = async () => {
      try {
        const decoded = atob(token);
        const discordId = decoded.split(':')[0];

        if (type === 'patient') {
          fetchPatients();
          const patient = usePatientStore.getState().patients.find(p => p.discord_id === discordId);

          if (patient) {
            patientLogin({
              id: patient.id,
              discord_id: patient.discord_id!,
              username: patient.name,
              patientId: patient.id,
              profileCompleted: !needsProfile,
            });
            if (needsProfile) {
              navigate('/patient/profile', { replace: true });
            } else {
              navigate('/patient/dashboard', { replace: true });
            }
          } else {
            navigate('/patient/login', { replace: true });
          }
        } else if (type === 'admin') {
          const success = await loginWithDiscordOAuth(discordId);
          if (success) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/admin/login', { replace: true });
          }
        }
      } catch {
        navigate('/', { replace: true });
      }
    };

    handleAuth();
  }, [params, navigate, patientLogin, fetchPatients, loginWithDiscordOAuth]);

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
