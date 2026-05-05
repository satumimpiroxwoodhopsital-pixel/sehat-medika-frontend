import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatientStore } from '../stores/patientStore';
import { patientService } from '../services/patientService';
import type { Patient } from '../types';
import { Search, Plus, Pencil, Trash2, FileText, X, Calendar, User, Stethoscope } from 'lucide-react';

const patientSchema = z.object({
  name: z.string(),
  cid: z.string(),
  date_of_birth: z.string(),
  gender: z.enum(['male', 'female']),
  blood_type: z.enum(['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
  phone: z.string(),
  allergies: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const patients = usePatientStore((s) => s.patients);
  const medicalRecords = usePatientStore((s) => s.medicalRecords);
  const searchPatients = usePatientStore((s) => s.searchPatients);
  const getPatientMedicalRecords = usePatientStore((s) => s.getPatientMedicalRecords);

  const filteredPatients = searchQuery ? searchPatients(searchQuery) : patients;

  useEffect(() => {
    const state = location.state as any;
    if (!state) return;

    if (state.selectedPatientId) {
      const patient = patients.find(p => p.id === state.selectedPatientId);
      if (patient) setSelectedPatient(patient);
      navigate('/admin/patient-database', { replace: true, state: null });
    }

    if (state.createPatient) {
      setEditingPatient(null);
      reset({
        name: state.patientName || '',
        cid: '',
        date_of_birth: '',
        gender: 'male',
        blood_type: 'O+',
        phone: '',
        allergies: '',
        status: 'active',
      });
      setShowForm(true);
      navigate('/admin/patient-database', { replace: true, state: null });
    }
  }, [location.state, patients]);

  const { register, handleSubmit, reset } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      cid: '',
      date_of_birth: '',
      gender: 'male',
      blood_type: 'O+',
      phone: '',
      allergies: '',
      status: 'active',
    },
  });

  const onSubmit = (data: PatientFormData) => {
    const patientData = {
      ...data,
      allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
    };
    if (editingPatient) {
      patientService.updatePatient(editingPatient.id, patientData);
    } else {
      patientService.createPatient(patientData as any);
    }
    setShowForm(false);
    setEditingPatient(null);
    reset();
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    reset({
      name: patient.name,
      cid: patient.cid,
      date_of_birth: patient.date_of_birth,
      gender: patient.gender,
      blood_type: patient.blood_type,
      phone: patient.phone,
      allergies: patient.allergies.join(', '),
      status: patient.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      patientService.deletePatient(id);
      if (selectedPatient?.id === id) setSelectedPatient(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Database</h1>
          <p className="mt-2 text-gray-600">Manage patients and medical records</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Patients', value: patients.length, icon: User },
            { label: 'Active', value: patients.filter(p => p.status === 'active').length, icon: User },
            { label: 'Medical Records', value: medicalRecords.length, icon: FileText },
            { label: 'Draft Records', value: medicalRecords.filter(r => r.status === 'draft').length, icon: Stethoscope },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <stat.icon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Patients</h2>
                  <button
                    onClick={() => { setEditingPatient(null); reset(); setShowForm(true); }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.mrn}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(patient); }} className="p-1 text-gray-400 hover:text-blue-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }} className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <span className={`inline-flex mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details & Medical Records */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-gray-600">{selectedPatient.mrn}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(selectedPatient)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">CID:</span> <span className="font-medium">{selectedPatient.cid}</span></div>
                    <div><span className="text-gray-500">Gender:</span> <span className="font-medium capitalize">{selectedPatient.gender}</span></div>
                    <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{selectedPatient.date_of_birth}</span></div>
                    <div><span className="text-gray-500">Blood Type:</span> <span className="font-medium">{selectedPatient.blood_type}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedPatient.phone}</span></div>
                    {selectedPatient.allergies.length > 0 && (
                      <div className="col-span-2"><span className="text-gray-500">Allergies:</span> <span className="font-medium text-red-600">{selectedPatient.allergies.join(', ')}</span></div>
                    )}
                  </div>
                </div>

                {/* Medical Records */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Medical Records</h3>
                  </div>
                  <div className="divide-y">
                    {getPatientMedicalRecords(selectedPatient.id).length === 0 ? (
                      <p className="p-4 text-gray-500 text-sm">No medical records found.</p>
                    ) : (
                      getPatientMedicalRecords(selectedPatient.id).map((record) => (
                        <div key={record.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{record.visit_date}</span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${record.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {record.status}
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                  {record.visit_type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1"><strong>Doctor:</strong> {record.doctor_name}</p>
                              <p className="text-sm text-gray-900 mt-1"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                              {record.symptoms.length > 0 && (
                                <p className="text-sm text-gray-600"><strong>Symptoms:</strong> {record.symptoms.join(', ')}</p>
                              )}
                              <p className="text-sm text-gray-600"><strong>Treatment:</strong> {record.treatment}</p>
                              {record.notes && <p className="text-sm text-gray-500"><strong>Notes:</strong> {record.notes}</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                <button onClick={() => { setShowForm(false); setEditingPatient(null); reset(); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input {...register('name')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CID</label>
                    <input {...register('cid')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" {...register('date_of_birth')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select {...register('gender')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <select {...register('blood_type')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500">
                      {['A', 'B', 'AB', 'O', 'A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input {...register('phone')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select {...register('status')} className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergies (comma-separated)</label>
                  <input {...register('allergies')} placeholder="e.g., Penicillin, Peanuts" className="mt-1 w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={() => { setShowForm(false); setEditingPatient(null); reset(); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    {editingPatient ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
