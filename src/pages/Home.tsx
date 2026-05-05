import { Link } from 'react-router-dom';
import { Heart, Users, Activity, Shield, ArrowRight, MapPin, Phone, Mail, MessageCircle, Stethoscope } from 'lucide-react';
import { services, doctors, hospitalInfo } from '../data/mockData';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Health, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Providing world-class healthcare with compassion and excellence since 2001.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment/book"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-bg-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {hospitalInfo.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services tailored to meet your needs with state-of-the-art facilities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                <Link to="/services" className="text-primary text-sm font-medium hover:text-primary-dark inline-flex items-center gap-1">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-bg-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Care</h3>
              <p className="text-gray-600">We treat every patient with empathy, respect, and personalized attention.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Our team consists of highly qualified specialists with years of experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Technology</h3>
              <p className="text-gray-600">Equipped with cutting-edge medical technology for accurate diagnosis and treatment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Doctors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our team of experienced and dedicated medical professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img src={doctor.photo} alt={doctor.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-sm text-primary mb-2">{doctor.specialization}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>★ {doctor.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{doctor.experience} years exp.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              View All Doctors <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Medical Assistance?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book an appointment with our specialists today and take the first step towards better health.
          </p>
          <Link
            to="/appointment/book"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Book Appointment Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Portal Login Section */}
      <section className="py-16 md:py-24 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Access Your Portal</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Login to your patient or staff portal to manage appointments, view records, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              to="/login"
              state={{ role: 'patient' }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Portal</h3>
              <p className="text-sm text-gray-600 mb-4">View appointments, applications, and medical records</p>
              <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
                Login as Patient <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/login"
              state={{ role: 'staff' }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Portal</h3>
              <p className="text-sm text-gray-600 mb-4">Access admin dashboard, manage patients and appointments</p>
              <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
                Login as Staff <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-12 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Visit Us</h4>
                <p className="text-sm text-gray-600">{hospitalInfo.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Phone className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Call Us</h4>
                <p className="text-sm text-gray-600">{hospitalInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Mail className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Email Us</h4>
                <p className="text-sm text-gray-600">{hospitalInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
