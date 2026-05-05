import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { MessageCircle, Loader2 } from 'lucide-react';

const PatientLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, patient, logout, loading: authLoading } = usePatientAuthStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!patient) return;
    if (patient.profileCompleted) {
      navigate('/patient/dashboard', { replace: true });
    } else {
      navigate('/patient/profile', { replace: true });
    }
  }, [patient, navigate]);

  // Clear stale session
  useEffect(() => {
    if (patient && patient.profileCompleted === undefined) {
      logout();
    }
  }, []);

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login();
    } catch (e: any) {
      setError('Authentication failed: ' + (e?.message || 'Please try again.'));
      setLoading(false);
    }
  };

  if (authLoading || patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sehat Medika</h1>
          <p className="text-gray-500">Patient Portal Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login with Discord</h2>
            <p className="text-sm text-gray-600">
              Use your Discord account to login to the patient portal
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</>
            ) : (
              <><MessageCircle className="w-5 h-5" /> Login with Discord</>
            )}
          </button>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-primary inline-flex items-center gap-1">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
