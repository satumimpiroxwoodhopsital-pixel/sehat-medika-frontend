import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Stethoscope, MessageCircle } from 'lucide-react';

const LoginChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If role is passed via state, redirect directly to the respective login
  useEffect(() => {
    if (location.state?.role === 'patient') {
      navigate('/patient/login', { replace: true });
    } else if (location.state?.role === 'staff') {
      navigate('/admin/login', { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sehat Medika</h1>
          <p className="text-gray-500">Select your login type</p>
        </div>

        {/* Login Options */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
          <Link
            to="/admin/login"
            className="block p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Staff Login</h3>
                <p className="text-sm text-gray-600">For doctors, nurses, and administrative staff</p>
              </div>
            </div>
          </Link>

          <Link
            to="/patient/login"
            className="block p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Login</h3>
                <p className="text-sm text-gray-600">Access your patient portal and appointments</p>
              </div>
            </div>
          </Link>
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

export default LoginChoice;
