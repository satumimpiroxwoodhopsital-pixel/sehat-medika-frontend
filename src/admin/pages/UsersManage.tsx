import { useState } from 'react';
import { Plus, Pencil, Trash2, UserCog, MessageCircle } from 'lucide-react';

interface StaffUser {
  id: string; name: string; discord_id: string; role: string; is_active: boolean;
}

const roles = ['Super Admin', 'Admin', 'Doctor', 'Receptionist', 'HR', 'Content Manager'];

const UsersManage = () => {
  const [users, setUsers] = useState<StaffUser[]>([
    { id: '1', name: 'Dr. Admin', discord_id: 'admin#0001', role: 'Super Admin', is_active: true },
    { id: '2', name: 'Dr. Staff', discord_id: 'staff#0002', role: 'Admin', is_active: true },
    { id: '3', name: 'Dr. Johnson', discord_id: 'doctor#0003', role: 'Doctor', is_active: true },
    { id: '4', name: 'Jane Reception', discord_id: 'reception#0004', role: 'Receptionist', is_active: true },
    { id: '5', name: 'HR Manager', discord_id: 'hr#0005', role: 'HR', is_active: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [formData, setFormData] = useState({ name: '', discord_id: '', password: '', role: 'Admin' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData, id: u.id, is_active: u.is_active } : u));
    } else {
      setUsers(prev => [...prev, { id: Date.now().toString(), ...formData, is_active: true }]);
    }
    setShowForm(false); setEditingUser(null);
    setFormData({ name: '', discord_id: '', password: '', role: 'Admin' });
  };

  const handleEdit = (user: StaffUser) => { setEditingUser(user); setFormData({ name: user.name, discord_id: user.discord_id, password: '', role: user.role }); setShowForm(true); };
  const handleDelete = (id: string) => { setUsers(prev => prev.filter(u => u.id !== id)); setShowDeleteConfirm(null); };
  const toggleActive = (id: string) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u)); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Users</h1><p className="text-gray-600 mt-1">{users.length} total users</p></div>
        <button onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', discord_id: '', password: '', role: 'Admin' }); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discord ID</label>
                <input type="text" value={formData.discord_id} onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                  placeholder="e.g., admin#0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && <span className="text-gray-400">(leave blank to keep)</span>}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Enter new password' : ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  {...(!editingUser ? { required: true } : {})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark">{editingUser ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Discord ID</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><p className="font-medium text-gray-900">{user.name}</p></td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1"><MessageCircle className="w-3 h-3 text-gray-400" /> {user.discord_id}</td>
                <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-sm"><UserCog className="w-3 h-3" /> {user.role}</span></td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleActive(user.id)} className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(user)} className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setShowDeleteConfirm(user.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManage;
