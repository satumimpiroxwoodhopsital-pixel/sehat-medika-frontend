import type { Service, Doctor, Job } from '../types';

export const services: Service[] = [
  { id: '1', name: 'General Medicine', description: 'Comprehensive healthcare for patients of all ages, focusing on prevention, diagnosis, and treatment of common illnesses.', icon: 'stethoscope', is_published: true },
  { id: '2', name: 'Cardiology', description: 'Specialized care for heart and cardiovascular system disorders, including preventive cardiology and advanced cardiac procedures.', icon: 'heart', is_published: true },
  { id: '3', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents, including routine checkups, immunizations, and treatment of childhood illnesses.', icon: 'baby', is_published: true },
  { id: '4', name: 'Orthopedics', description: 'Diagnosis and treatment of musculoskeletal disorders, including bones, joints, ligaments, tendons, and muscles.', icon: 'bone', is_published: true },
  { id: '5', name: 'Neurology', description: 'Specialized care for disorders of the nervous system, including brain, spinal cord, and peripheral nerves.', icon: 'brain', is_published: true },
  { id: '6', name: 'Dermatology', description: 'Medical care for skin, hair, and nail conditions, including cosmetic dermatology and skin cancer screening.', icon: 'skin', is_published: true },
  { id: '7', name: 'Ophthalmology', description: 'Eye and vision care, including medical and surgical treatment of eye diseases and vision correction.', icon: 'eye', is_published: true },
  { id: '8', name: 'Dental Care', description: 'Comprehensive dental services including preventive care, restorative dentistry, and cosmetic dental procedures.', icon: 'tooth', is_published: true },
];

export const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Johnson', photo: 'https://i.pravatar.cc/300?img=1', specialization: 'General Medicine', service_id: '1', experience: 15, rating: 4.8, schedule: { 'monday': ['08:00', '08:30', '09:00', '09:30', '10:00'], 'tuesday': ['08:00', '08:30', '09:00', '09:30'], 'wednesday': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'], 'thursday': ['08:00', '08:30', '09:00'], 'friday': ['08:00', '08:30', '09:00', '09:30', '10:00'] } },
  { id: '2', name: 'Dr. Michael Chen', photo: 'https://i.pravatar.cc/300?img=3', specialization: 'Cardiology', service_id: '2', experience: 20, rating: 4.9, schedule: { 'monday': ['09:00', '09:30', '10:00', '10:30'], 'tuesday': ['09:00', '09:30', '10:00'], 'wednesday': ['09:00', '09:30', '10:00', '10:30'], 'thursday': ['09:00', '09:30', '10:00'], 'friday': ['09:00', '09:30', '10:00', '10:30'] } },
  { id: '3', name: 'Dr. Emily Rodriguez', photo: 'https://i.pravatar.cc/300?img=5', specialization: 'Pediatrics', service_id: '3', experience: 12, rating: 4.7, schedule: { 'monday': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'], 'tuesday': ['08:00', '08:30', '09:00', '09:30', '10:00'], 'wednesday': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'], 'thursday': ['08:00', '08:30', '09:00', '09:30'], 'friday': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'] } },
  { id: '4', name: 'Dr. James Wilson', photo: 'https://i.pravatar.cc/300?img=7', specialization: 'Orthopedics', service_id: '4', experience: 18, rating: 4.8, schedule: { 'monday': ['10:00', '10:30', '11:00', '11:30'], 'tuesday': ['10:00', '10:30', '11:00'], 'wednesday': ['10:00', '10:30', '11:00', '11:30'], 'thursday': ['10:00', '10:30', '11:00'], 'friday': ['10:00', '10:30', '11:00', '11:30'] } },
  { id: '5', name: 'Dr. Lisa Park', photo: 'https://i.pravatar.cc/300?img=9', specialization: 'Neurology', service_id: '5', experience: 14, rating: 4.6, schedule: { 'monday': ['11:00', '11:30', '12:00', '12:30'], 'tuesday': ['11:00', '11:30', '12:00'], 'wednesday': ['11:00', '11:30', '12:00', '12:30'], 'thursday': ['11:00', '11:30', '12:00'], 'friday': ['11:00', '11:30', '12:00', '12:30'] } },
  { id: '6', name: 'Dr. David Kim', photo: 'https://i.pravatar.cc/300?img=11', specialization: 'Dermatology', service_id: '6', experience: 10, rating: 4.5, schedule: { 'monday': ['13:00', '13:30', '14:00', '14:30'], 'tuesday': ['13:00', '13:30', '14:00'], 'wednesday': ['13:00', '13:30', '14:00', '14:30'], 'thursday': ['13:00', '13:30', '14:00'], 'friday': ['13:00', '13:30', '14:00', '14:30'] } },
  { id: '7', name: 'Dr. Maria Santos', photo: 'https://i.pravatar.cc/300?img=13', specialization: 'Ophthalmology', service_id: '7', experience: 16, rating: 4.7, schedule: { 'monday': ['14:00', '14:30', '15:00', '15:30'], 'tuesday': ['14:00', '14:30', '15:00'], 'wednesday': ['14:00', '14:30', '15:00', '15:30'], 'thursday': ['14:00', '14:30', '15:00'], 'friday': ['14:00', '14:30', '15:00', '15:30'] } },
  { id: '8', name: 'Dr. Robert Taylor', photo: 'https://i.pravatar.cc/300?img=15', specialization: 'General Medicine', service_id: '1', experience: 22, rating: 4.9, schedule: { 'monday': ['07:00', '07:30', '08:00', '08:30'], 'tuesday': ['07:00', '07:30', '08:00'], 'wednesday': ['07:00', '07:30', '08:00', '08:30'], 'thursday': ['07:00', '07:30', '08:00'], 'friday': ['07:00', '07:30', '08:00', '08:30'] } },
];

export const jobs: Job[] = [
  { id: '1', title: 'Registered Nurse - ICU', department: 'Nursing', type: 'full-time', location: 'Main Hospital', description: 'We are seeking an experienced ICU Nurse to join our critical care team. The ideal candidate will have strong critical thinking skills and experience in intensive care settings.', requirements: ['Bachelor of Science in Nursing (BSN)', 'Valid RN license', 'Minimum 2 years ICU experience', 'BLS and ACLS certification', 'Excellent communication skills'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-04-15' },
  { id: '2', title: 'Pediatrician', department: 'Pediatrics', type: 'full-time', location: 'Main Hospital', description: 'Join our growing Pediatrics department. We provide comprehensive medical care for children from birth through adolescence.', requirements: ['Doctor of Medicine (MD) or equivalent', 'Board Certified in Pediatrics', 'Valid medical license', 'Minimum 3 years clinical experience', 'Strong bedside manner with children'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-04-20' },
  { id: '3', title: 'Medical Laboratory Technician', department: 'Laboratory', type: 'full-time', location: 'Main Hospital', description: 'Perform routine and specialized tests in our state-of-the-art laboratory facility.', requirements: ['Associate degree in Medical Technology', 'MLT certification (ASCP)', '1-2 years lab experience preferred', 'Knowledge of lab safety protocols', 'Attention to detail'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-04-25' },
  { id: '4', title: 'Radiologist', department: 'Radiology', type: 'part-time', location: 'Main Hospital', description: 'Seeking a part-time Radiologist to interpret medical images and provide diagnostic reports.', requirements: ['MD or DO degree', 'Board Certified in Radiology', 'Valid medical license', '5+ years experience', 'Excellent diagnostic skills'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-04-28' },
  { id: '5', title: 'Pharmacist', department: 'Pharmacy', type: 'full-time', location: 'Main Hospital', description: 'Manage medication therapy and provide pharmaceutical care to our patients in the hospital pharmacy.', requirements: ['Doctor of Pharmacy (PharmD)', 'Valid pharmacist license', '2+ years hospital pharmacy experience', 'Knowledge of drug interactions', 'Strong attention to detail'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-05-01' },
  { id: '6', title: 'Physical Therapist', department: 'Rehabilitation', type: 'contract', location: 'Rehabilitation Center', description: 'Provide physical therapy services to patients recovering from injuries, surgeries, or managing chronic conditions.', requirements: ['Doctor of Physical Therapy (DPT)', 'State PT license', '2+ years experience', 'CPR certification', 'Strong interpersonal skills'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-05-03' },
  { id: '7', title: 'Medical Receptionist', department: 'Administration', type: 'full-time', location: 'Main Hospital', description: 'Front desk receptionist for our busy medical clinic. Handle patient check-ins, scheduling, and phone inquiries.', requirements: ['High school diploma or equivalent', '1+ years medical office experience', 'Knowledge of medical terminology', 'Proficiency with EMR systems', 'Excellent customer service skills'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-05-04' },
  { id: '8', title: 'Cardiologist', department: 'Cardiology', type: 'full-time', location: 'Heart Center', description: 'Seeking a board-certified Cardiologist to join our expanding heart care team.', requirements: ['MD or DO degree', 'Board Certified in Cardiology', 'Valid medical license', 'Fellowship in Cardiology completed', '7+ years experience preferred'], form_questions: [], is_published: true, is_closed: false, posted_date: '2026-05-05' },
];

export const timeSlots = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

export const hospitalInfo = {
  name: 'Sehat Medika Hospital',
  tagline: 'Your Health, Our Priority',
  description: 'A leading healthcare institution dedicated to providing world-class medical care with compassion and excellence.',
  address: '123 Health Street, Medika City, MC 12345',
  phone: '+62 21 5555 0123',
  email: 'info@sehatmedika.com',
  emergency: '+62 21 5555 0911',
  stats: [
    { label: 'Years of Service', value: '25+' },
    { label: 'Doctors', value: '150+' },
    { label: 'Patients Served', value: '500K+' },
    { label: 'Departments', value: '20+' },
  ],
  socialMedia: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
};
