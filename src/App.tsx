import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Appointment from './pages/Appointment';
import BookAppointment from './pages/BookAppointment';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import Careers from './pages/Careers';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply';
import JobApplicationConfirmation from './pages/JobApplicationConfirmation';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './admin/pages/Login';
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ServicesManage from './admin/pages/ServicesManage';
import DoctorsManage from './admin/pages/DoctorsManage';
import AppointmentsManage from './admin/pages/AppointmentsManage';
import JobsManage from './admin/pages/JobsManage';
import ApplicationsManage from './admin/pages/ApplicationsManage';
import PagesManage from './admin/pages/PagesManage';
import UsersManage from './admin/pages/UsersManage';
import RolesManage from './admin/pages/RolesManage';
import Profile from './admin/pages/Profile';
import MedicalRecords from './admin/pages/MedicalRecords';
import PatientDatabase from './pages/PatientDatabase';
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';
import LoginChoice from './pages/LoginChoice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointment/book" element={<BookAppointment />} />
          <Route path="/appointment/confirmation" element={<AppointmentConfirmation />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/jobs" element={<JobListings />} />
          <Route path="/careers/jobs/:id" element={<JobDetail />} />
          <Route path="/careers/jobs/:id/apply" element={<JobApply />} />
          <Route path="/careers/jobs/confirmation" element={<JobApplicationConfirmation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Unified Login Choice */}
        <Route path="/login" element={<LoginChoice />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Patient Login */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/profile" element={<PatientProfile />} />

        {/* Patient Routes (Protected) */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cms/services" element={<ServicesManage />} />
          <Route path="cms/doctors" element={<DoctorsManage />} />
          <Route path="appointments" element={<AppointmentsManage />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="patient-database" element={<PatientDatabase />} />
          <Route path="jobs" element={<JobsManage />} />
          <Route path="applications" element={<ApplicationsManage />} />
          <Route path="cms/pages" element={<PagesManage />} />
          <Route path="users" element={<UsersManage />} />
          <Route path="roles" element={<RolesManage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
