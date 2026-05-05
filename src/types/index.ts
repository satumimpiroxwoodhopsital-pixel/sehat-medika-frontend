export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_published: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  specialization: string;
  service_id: string;
  service_name?: string;
  experience: number;
  rating: number;
  schedule: { [key: string]: string[] };
}

export interface Appointment {
  id: string;
  ref_number: string;
  patient_name: string;
  phone: string;
  discord_id?: string;
  patient_discord_id?: string;
  service_id: string;
  doctor_id: string;
  doctor_name?: string;
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract';
  location: string;
  description: string;
  requirements: string[];
  form_questions: FormQuestion[];
  is_published: boolean;
  is_closed: boolean;
  posted_date: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  discord_id: string;
  phone: string;
  cv_path: string;
  cover_letter?: string;
  form_answers: { [key: string]: string | string[] };
  status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  applied_at: string;
}

export interface PageContent {
  id: string;
  page_slug: string;
  section: string;
  title: string;
  content: string;
  media?: any;
}

export type JobType = 'full-time' | 'part-time' | 'contract';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type ApplicationStatus = 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  cid: string;
  discord_id?: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  blood_type: 'A' | 'B' | 'AB' | 'O' | 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
  phone: string;
  allergies: string[];
  status: 'active' | 'inactive';
  registration_date: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name?: string;
  patient_mrn?: string;
  doctor_id: string;
  doctor_name?: string;
  visit_date: string;
  visit_type: 'outpatient' | 'inpatient' | 'emergency' | 'checkup';
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescription: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes?: string;
  follow_up_date?: string;
  status: 'draft' | 'finalized';
}

export type PatientStatus = 'active' | 'inactive';
export type MedicalRecordStatus = 'draft' | 'finalized';
export type VisitType = 'outpatient' | 'inpatient' | 'emergency' | 'checkup';
