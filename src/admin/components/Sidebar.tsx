import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Stethoscope, Users, Calendar, Briefcase, FileText, FileEdit, UserCog, ShieldCheck, ChevronLeft, LogOut, Database
} from 'lucide-react';
import { useAuthStore } from '../utils/authStore';
import { useState } from 'react';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { path: '/admin/profile', label: 'My Profile', icon: UserCog, permission: null },
  { path: '/admin/cms/services', label: 'Services', icon: Stethoscope, permission: 'services:*' },
  { path: '/admin/cms/doctors', label: 'Doctors', icon: Users, permission: 'doctors:*' },
  { path: '/admin/appointments', label: 'Appointments', icon: Calendar, permission: 'appointments:read' },
  { path: '/admin/medical-records', label: 'Medical Records', icon: FileText, permission: 'medical-records:read' },
  { path: '/admin/patient-database', label: 'Patient Database', icon: Database, permission: 'patients:read' },
  { path: '/admin/jobs', label: 'Job Listings', icon: Briefcase, permission: 'jobs:*' },
  { path: '/admin/applications', label: 'Applications', icon: FileText, permission: 'applications:read' },
  { path: '/admin/cms/pages', label: 'Pages', icon: FileEdit, permission: 'pages:*' },
  { path: '/admin/users', label: 'Users', icon: UserCog, permission: 'users:*' },
  { path: '/admin/roles', label: 'Roles', icon: ShieldCheck, permission: 'roles:*' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const hasPermission = (permission: string | null) => {
    if (!permission) return true;
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <div className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-800 rounded"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          if (!hasPermission(item.permission)) return null;

          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 text-gray-300 hover:text-white transition-colors ${
            collapsed ? 'justify-center w-full' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
