import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { hospitalInfo } from '../data/mockData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">{hospitalInfo.name}</span>
            </div>
            <p className="text-sm mb-4">{hospitalInfo.tagline}</p>
            <div className="flex gap-3">
              <a href={hospitalInfo.socialMedia.facebook} className="hover:text-white transition-colors text-sm">FB</a>
              <a href={hospitalInfo.socialMedia.twitter} className="hover:text-white transition-colors text-sm">TW</a>
              <a href={hospitalInfo.socialMedia.instagram} className="hover:text-white transition-colors text-sm">IG</a>
              <a href={hospitalInfo.socialMedia.linkedin} className="hover:text-white transition-colors text-sm">LI</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">Doctors</Link></li>
              <li><Link to="/appointment" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">General Medicine</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Cardiology</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Pediatrics</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Orthopedics</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Neurology</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{hospitalInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{hospitalInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{hospitalInfo.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>Emergency: {hospitalInfo.emergency}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {hospitalInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
