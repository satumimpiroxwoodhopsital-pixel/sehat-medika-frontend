import { useState, useEffect } from 'react';
import { User, MessageCircle, Phone, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../utils/authStore';

const Profile = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [discord_id, setDiscordId] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDiscordId(user.discord_id || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call - in real app, this would call an API
    const updatedUser = { ...user, name, discord_id };
    localStorage.setItem('admin-user', JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">Please log in to view your profile.</div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Update your personal information</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
              <p className="text-sm text-gray-500">{user.discord_id}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Information</h3>

          {saved && (
            <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discord ID</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={discord_id}
                  onChange={(e) => setDiscordId(e.target.value)}
                  placeholder="e.g., admin#0001"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            {user.role === 'Doctor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g., Cardiology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Permissions (Read Only) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {user.permissions.includes('*') ? (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Full Access (*)</span>
            ) : (
              user.permissions.map((perm: string) => (
                <span key={perm} className="px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-medium">
                  {perm}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
