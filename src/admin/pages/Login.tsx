import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle, Stethoscope, Loader2 } from 'lucide-react';
import { useAuthStore } from '../utils/authStore';
import { supabase } from '../../lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchProfile, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check for existing session
  useEffect(() => {
    fetchProfile();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    setError('');

    const success = await useAuthStore.getState().login(data.email, data.password);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?type=admin`,
      },
    });
    if (error) {
      setError('Discord login failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sehat Medika</h1>
          <p className="text-gray-500">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="admin@sehatmedika.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Discord OAuth Option */}
          <div className="mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleDiscordLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Login with Discord
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Super Admin:</strong> admin@sehatmedika.com / admin123</p>
              <p><strong>Admin:</strong> staff@sehatmedika.com / staff123</p>
              <p><strong>Doctor:</strong> doctor@sehatmedika.com / doctor123</p>
            </div>
          </div>
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

export default Login;
