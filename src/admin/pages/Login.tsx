import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, MessageCircle, Stethoscope, Loader2 } from 'lucide-react';
import { useAuthStore } from '../utils/authStore';

const loginSchema = z.object({
  discord_id: z.string().min(2, 'Discord ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Handle OAuth callback via /auth/callback - handled by AuthCallback.tsx
  // This page only handles direct Discord ID + password login

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    const success = await login(data.discord_id, data.password);

    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid Discord ID or password');
    }
    setLoading(false);
  };

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/discord/oauth`;
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify&state=admin`;
    window.location.href = discordUrl;
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
            {/* Discord ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discord ID</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('discord_id')}
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="admin#0001"
                />
              </div>
              {errors.discord_id && <p className="text-red-500 text-sm mt-1">{errors.discord_id.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter your password"
                />
              </div>
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
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Login with Discord
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Super Admin:</strong> admin#0001 / admin123</p>
              <p><strong>Admin:</strong> staff#0002 / staff123</p>
              <p><strong>Doctor:</strong> doctor#0003 / doctor123</p>
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
