import { Link } from 'react-router-dom';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useApplicationStore } from '../stores/applicationStore';
import { usePatientStore } from '../stores/patientStore';
import { useJobStore } from '../stores/jobStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, LogOut, MessageCircle, CheckCircle, Briefcase, ArrowLeft, FileText, Stethoscope, Droplet, Building, MapPin } from 'lucide-react';
import { services } from '../data/mockData';

const PatientDashboard = () => {
  const { patient, logout } = usePatientAuthStore();
  const { getPatientAppointments } = useAppointmentStore();
  const { getApplicationsByDiscordId, getJobTitle } = useApplicationStore();
  const { getPatientByDiscordId, getPatientMedicalRecords } = usePatientStore();
  const getOpenJobs = useJobStore((s) => s.getOpenJobs);
  const navigate = useNavigate();

  const openJobs = getOpenJobs();

  if (!patient) {
    navigate('/patient/login');
    return null;
  }

  if (!patient.profileCompleted) {
    navigate('/patient/profile');
    return null;
  }

  // Get full patient record from patient store
  const patientRecord = getPatientByDiscordId(patient.discord_id);

  const appointments = getPatientAppointments(patient.discord_id);
  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
  const applications = getApplicationsByDiscordId(patient.discord_id);
  const medicalRecords = patientRecord ? getPatientMedicalRecords(patientRecord.id) : [];

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'confirmed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
    }
  };

  const getAppStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>;
      case 'reviewed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Reviewed</span>;
      case 'interviewed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Interviewed</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'hired':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hired</span>;
      default:
        return null;
    }
  };

  const getVisitTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      outpatient: 'bg-green-100 text-green-800',
      inpatient: 'bg-red-100 text-red-800',
      emergency: 'bg-orange-100 text-orange-800',
      checkup: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>{type}</span>;
  };

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {patient.avatar ? (
              <img src={patient.avatar} alt={patient.username} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {patient.username}</h1>
              <p className="text-gray-600">Discord ID: {patient.discord_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Patient Profile Card */}
        {patientRecord && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Patient Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">MRN</p>
                <p className="font-medium text-gray-900">{patientRecord.mrn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{patientRecord.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p className="font-medium text-gray-900 capitalize">{patientRecord.gender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-red-500" /> Blood Type
                </p>
                <p className="font-medium text-gray-900">{patientRecord.blood_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{patientRecord.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID Number</p>
                <p className="font-medium text-gray-900">{patientRecord.cid || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">DOB</p>
                <p className="font-medium text-gray-900">{patientRecord.date_of_birth}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`font-medium ${patientRecord.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                  {patientRecord.status}
                </p>
              </div>
            </div>
            {patientRecord.allergies.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {patientRecord.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/appointment/book"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-gray-900">Book Appointment</p>
            <p className="text-sm text-gray-600">Schedule a new visit</p>
          </Link>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Upcoming</p>
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{past.filter(a => a.status === 'completed').length}</p>
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Medical Records
          </h2>
          {medicalRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No medical records yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
                        {getVisitTypeBadge(record.visit_type)}
                        {record.status === 'finalized' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Finalized</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(record.visit_date).toLocaleDateString()}
                        </span>
                        <span className="mx-2">|</span>
                        <span>Dr. {record.doctor_name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Symptoms:</strong> {record.symptoms.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Treatment:</strong> {record.treatment}
                  </div>
                  {record.prescription.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <strong>Prescriptions:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {record.prescription.map((p, i) => (
                          <li key={i}>{p.medicine} - {p.dosage}, {p.frequency} ({p.duration})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {record.notes && (
                    <div className="mt-2 text-sm text-gray-500 italic">
                      Note: {record.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming appointments.</p>
              <Link to="/appointment/book" className="text-primary hover:text-primary-dark mt-2 inline-block">
                Book an appointment now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map(app => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{getServiceName(app.service_id)}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(app.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {app.time_slot}
                        </span>
                      </div>
                      {app.doctor_name ? (
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-700">
                          <User className="w-4 h-4" />
                          <span>Doctor: {app.doctor_name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
                          <User className="w-4 h-4" />
                          <span>Doctor will be assigned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {past.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Past Appointments</h2>
            <div className="space-y-4">
              {past.map(app => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{getServiceName(app.service_id)}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(app.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {app.time_slot}
                        </span>
                      </div>
                      {app.doctor_name && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Doctor: {app.doctor_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No job applications yet.</p>
              <Link to="/careers/jobs" className="text-primary hover:text-primary-dark mt-2 inline-block">
                Browse job openings
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{getJobTitle(app.job_id)}</h3>
                        {getAppStatusBadge(app.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" /> Job Application
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Open Job Listings
          </h2>
          {openJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No open positions at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openJobs.map(job => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                          job.type === 'part-time' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" /> {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Posted {new Date(job.posted_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/careers/jobs/${job.id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <Link to="/careers/jobs" className="text-sm text-primary hover:text-primary-dark">
              View All Job Listings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
