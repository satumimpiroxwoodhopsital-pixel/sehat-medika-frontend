import { Link } from 'react-router-dom';
import { Stethoscope, Users, Calendar, Briefcase, ArrowRight, Plus } from 'lucide-react';
import { doctors, services, jobs } from '../../data/mockData';

const Dashboard = () => {
  // Mock stats
  const stats = [
    { label: 'Total Doctors', value: doctors.length, icon: Users, color: 'blue' },
    { label: 'Services', value: services.length, icon: Stethoscope, color: 'green' },
    { label: 'Appointments Today', value: 12, icon: Calendar, color: 'purple' },
    { label: 'Open Positions', value: jobs.filter(j => !j.is_closed).length, icon: Briefcase, color: 'orange' },
  ];

  const recentAppointments = [
    { id: '1', patient: 'John Doe', service: 'General Medicine', doctor: 'Dr. Sarah Johnson', time: '09:00', status: 'confirmed' },
    { id: '2', patient: 'Jane Smith', service: 'Cardiology', doctor: 'Dr. Michael Chen', time: '10:30', status: 'pending' },
    { id: '3', patient: 'Bob Wilson', service: 'Pediatrics', doctor: 'Dr. Emily Rodriguez', time: '11:00', status: 'confirmed' },
    { id: '4', patient: 'Alice Brown', service: 'Dermatology', doctor: 'Dr. David Kim', time: '14:00', status: 'pending' },
  ];

  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const statusColor: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/cms/services/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service
          </Link>
          <Link
            to="/admin/cms/doctors/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </Link>
          <Link
            to="/admin/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Post Job
          </Link>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View All Appointments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-primary hover:text-primary-dark inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.patient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.doctor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{apt.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[apt.status]}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
