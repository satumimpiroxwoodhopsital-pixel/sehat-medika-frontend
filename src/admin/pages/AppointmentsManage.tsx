import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, AlertCircle, UserPlus } from 'lucide-react';
import { useAppointmentStore } from '../../stores/appointmentStore';
import { doctors, services } from '../../data/mockData';

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

const statusIcons: { [key: string]: any } = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
  completed: Clock,
};

const AppointmentsManage = () => {
  const { appointments, updateAppointment, confirmAppointment } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.ref_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Unknown';

  const handleAssignDoctor = (appointmentId: string) => {
    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (doctor) {
      confirmAppointment(appointmentId, doctor.id, doctor.name);
    }
    setShowAssignModal(null);
    setSelectedDoctor('');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">{appointments.length} total appointments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or ref #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ref #</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((apt) => {
                const StatusIcon = statusIcons[apt.status];
                return (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{apt.ref_number}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{apt.patient_name}</p>
                      <p className="text-xs text-gray-500">{apt.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getServiceName(apt.service_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {apt.doctor_name ? (
                        <span>{apt.doctor_name}</span>
                      ) : (
                        <span className="text-yellow-600 text-xs">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{apt.date} at {apt.time_slot}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === 'pending' && !apt.doctor_id && (
                          <button
                            onClick={() => setShowAssignModal(apt.id)}
                            className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                          >
                            <UserPlus className="w-3 h-3" /> Assign Doctor
                          </button>
                        )}
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointment(apt.id, { status: e.target.value as any })}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">No appointments found.</div>
        )}
      </div>

      {/* Assign Doctor Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Doctor</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign a doctor to appointment {appointments.find(a => a.id === showAssignModal)?.ref_number}
            </p>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white mb-4"
            >
              <option value="">Select a doctor...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAssignModal(null); setSelectedDoctor(''); }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignDoctor(showAssignModal)}
                disabled={!selectedDoctor}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsManage;
