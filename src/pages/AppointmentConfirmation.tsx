import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const { refNumber, patient_name, date, time_slot } = location.state || {};
  const { getAppointmentByRef } = useAppointmentStore();

  const appointment = refNumber ? getAppointmentByRef(refNumber) : null;

  if (!refNumber) {
    return (
      <div className="bg-bg-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking found.</p>
          <Link to="/appointment/book" className="text-primary hover:text-primary-dark">
            Book an appointment
          </Link>
        </div>
      </div>
    );
  }

  const displayName = appointment?.patient_name || patient_name;
  const displayDate = appointment?.date || date;
  const displayTime = appointment?.time_slot || time_slot;
  const doctorName = appointment?.doctor_name;

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your appointment has been successfully booked.</p>

          {/* Reference Number */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Reference Number</p>
            <p className="text-2xl font-bold text-primary">{refNumber}</p>
          </div>

          {/* Booking Details */}
          <div className="text-left space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-medium text-gray-900">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{displayDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{displayTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                {doctorName ? (
                  <p className="font-medium text-gray-900">{doctorName}</p>
                ) : (
                  <p className="font-medium text-yellow-600">To be assigned</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              {doctorName
                ? 'Please arrive 15 minutes before your scheduled time. Bring your ID and insurance card.'
                : 'A doctor will be assigned to your appointment. Please check your dashboard for updates.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
              >
                Back to Home <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/appointment"
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Book Another
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
