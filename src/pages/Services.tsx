import { Activity, Stethoscope, Heart, Baby, Bone, Brain, Sun, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../data/mockData';

const iconMap: { [key: string]: any } = {
  stethoscope: Stethoscope,
  heart: Heart,
  baby: Baby,
  bone: Bone,
  brain: Brain,
  skin: Sun,
  eye: Eye,
};

const Services = () => {
  return (
    <div className="bg-bg-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">Comprehensive healthcare services for you and your family</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Activity;
              return (
                <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to="/appointment/book"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
                  >
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need a Consultation?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our specialists are ready to provide you with the best medical care.
          </p>
          <Link
            to="/appointment/book"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Book an Appointment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
