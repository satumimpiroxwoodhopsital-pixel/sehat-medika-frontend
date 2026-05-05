import { useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../utils/authStore';

const pageTitles: { [key: string]: string } = {
  '/admin': 'Dashboard',
  '/admin/cms/services': 'Manage Services',
  '/admin/cms/doctors': 'Manage Doctors',
  '/admin/appointments': 'Appointments',
  '/admin/jobs': 'Job Listings',
  '/admin/applications': 'Job Applications',
  '/admin/cms/pages': 'Manage Pages',
  '/admin/users': 'Manage Users',
  '/admin/roles': 'Manage Roles',
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const getTitle = () => {
    const exact = pageTitles[location.pathname];
    if (exact) return exact;

    // Check for partial matches (e.g., /admin/cms/services/edit/123)
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path)) return title;
    }
    return 'Dashboard';
  };

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
