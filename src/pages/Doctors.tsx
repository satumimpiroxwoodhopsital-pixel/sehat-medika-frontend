import { useState } from 'react';
import { Search, Star, Clock } from 'lucide-react';
import { doctors, services } from '../data/mockData';

const Doctors = () => {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesService = selectedService === 'all' || doctor.service_id === selectedService;
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesService && matchesSearch;
  });

  return (
    <div className="bg-bg-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Doctors</h1>
          <p className="text-xl text-blue-100">Meet our team of experienced medical professionals</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Service Filter */}
              <div className="md:w-64">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Specializations</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-600 mt-4">
              Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img src={doctor.photo} alt={doctor.name} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{doctor.specialization}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{doctor.experience} years</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Available:</p>
                    <p className="mt-1">
                      {Object.keys(doctor.schedule).map((day) => (
                        <span key={day} className="inline-block bg-blue-50 text-primary px-2 py-0.5 rounded mr-1 mb-1 capitalize">
                          {day}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
