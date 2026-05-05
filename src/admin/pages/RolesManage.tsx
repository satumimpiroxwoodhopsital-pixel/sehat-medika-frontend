import { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';

interface Role {
  id: string; name: string; description: string; permissions: string[];
}

const allPermissions = [
  { group: 'Services', perms: ['services:create', 'services:read', 'services:update', 'services:delete'] },
  { group: 'Doctors', perms: ['doctors:create', 'doctors:read', 'doctors:update', 'doctors:delete'] },
  { group: 'Appointments', perms: ['appointments:read', 'appointments:update'] },
  { group: 'Jobs', perms: ['jobs:create', 'jobs:read', 'jobs:update', 'jobs:delete'] },
  { group: 'Applications', perms: ['applications:read', 'applications:update'] },
  { group: 'Pages', perms: ['pages:read', 'pages:update'] },
  { group: 'Users', perms: ['users:create', 'users:read', 'users:update', 'users:delete'] },
  { group: 'Roles', perms: ['roles:create', 'roles:read', 'roles:update', 'roles:delete'] },
];

const RolesManage = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'Super Admin', description: 'Full access to all features', permissions: ['*'] },
    { id: '2', name: 'Admin', description: 'Access to most features except user/role management', permissions: ['services:*', 'doctors:*', 'appointments:*', 'jobs:*', 'applications:*', 'pages:*'] },
    { id: '3', name: 'Doctor', description: 'Limited access to own appointments and profile', permissions: ['appointments:read', 'appointments:update', 'profile:update'] },
    { id: '4', name: 'Receptionist', description: 'Manage appointments and view doctors', permissions: ['appointments:*', 'doctors:read'] },
    { id: '5', name: 'HR', description: 'Manage jobs and applications', permissions: ['jobs:*', 'applications:*'] },
    { id: '6', name: 'Content Manager', description: 'Manage pages and services content', permissions: ['pages:*', 'services:read', 'services:update'] },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] as string[] });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
    } else {
      setRoles(prev => [...prev, { id: Date.now().toString(), ...formData }]);
    }
    setShowForm(false); setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleEdit = (role: Role) => { setEditingRole(role); setFormData({ name: role.name, description: role.description, permissions: [...role.permissions] }); setShowForm(true); };
  const handleDelete = (id: string) => { setRoles(prev => prev.filter(r => r.id !== id)); setShowDeleteConfirm(null); };
  const togglePerm = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Manage Roles</h1><p className="text-gray-600 mt-1">{roles.length} total roles</p></div>
        <button onClick={() => { setShowForm(true); setEditingRole(null); setFormData({ name: '', description: '', permissions: [] }); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingRole ? 'Edit Role' : 'Add New Role'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" required />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-3">
                  {allPermissions.map(group => (
                    <div key={group.group}>
                      <p className="text-sm font-semibold text-gray-700 mb-1">{group.group}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.perms.map(perm => (
                          <button type="button" key={perm} onClick={() => togglePerm(perm)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                              formData.permissions.includes(perm)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                            }`}>
                            {perm}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Tip: Use * for full access (e.g., services:*)</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark">{editingRole ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.includes('*') ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Full Access (*)</span>
                  ) : (
                    role.permissions.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-blue-50 text-primary rounded-full text-xs">{p}</span>
                    ))
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(role)} className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                {role.name !== 'Super Admin' && (
                  <button onClick={() => setShowDeleteConfirm(role.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManage;
