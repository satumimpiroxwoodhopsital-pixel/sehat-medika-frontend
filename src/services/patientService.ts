import type { Patient, MedicalRecord } from '../types';
import { usePatientStore } from '../stores/patientStore';

export const patientService = {
  // Patient CRUD
  getPatients: () => usePatientStore.getState().patients,

  getPatientById: (id: string) => usePatientStore.getState().getPatient(id),

  getPatientByMrn: (mrn: string) => usePatientStore.getState().getPatientByMrn(mrn),

  searchPatients: (query: string) => usePatientStore.getState().searchPatients(query),

  createPatient: (data: Omit<Patient, 'id' | 'mrn' | 'registration_date'>) => {
    const state = usePatientStore.getState();
    const newId = (Math.max(0, ...state.patients.map(p => parseInt(p.id))) + 1).toString();
    const mrn = `MRN-${new Date().getFullYear()}-${String(state.patients.length + 1).padStart(3, '0')}`;
    const newPatient: Patient = {
      ...data,
      id: newId,
      mrn,
      registration_date: new Date().toISOString().split('T')[0],
    };
    usePatientStore.getState().addPatient(newPatient);
    return newPatient;
  },

  updatePatient: (id: string, data: Partial<Patient>) => {
    usePatientStore.getState().updatePatient(id, data);
    return usePatientStore.getState().getPatient(id);
  },

  deletePatient: (id: string) => {
    usePatientStore.getState().deletePatient(id);
  },

  // Medical Record CRUD
  getMedicalRecords: () => usePatientStore.getState().medicalRecords,

  getMedicalRecordById: (id: string) => usePatientStore.getState().getMedicalRecord(id),

  getPatientMedicalRecords: (patientId: string) =>
    usePatientStore.getState().getPatientMedicalRecords(patientId),

  createMedicalRecord: (data: Omit<MedicalRecord, 'id'>) => {
    const state = usePatientStore.getState();
    const newId = (Math.max(0, ...state.medicalRecords.map(r => parseInt(r.id))) + 1).toString();
    const newRecord: MedicalRecord = { ...data, id: newId };
    usePatientStore.getState().addMedicalRecord(newRecord);
    return newRecord;
  },

  updateMedicalRecord: (id: string, data: Partial<MedicalRecord>) => {
    usePatientStore.getState().updateMedicalRecord(id, data);
    return usePatientStore.getState().getMedicalRecord(id);
  },

  deleteMedicalRecord: (id: string) => {
    usePatientStore.getState().deleteMedicalRecord(id);
  },

  // Stats
  getPatientStats: () => {
    const patients = usePatientStore.getState().patients;
    const records = usePatientStore.getState().medicalRecords;
    return {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'active').length,
      inactivePatients: patients.filter(p => p.status === 'inactive').length,
      totalRecords: records.length,
      draftRecords: records.filter(r => r.status === 'draft').length,
      finalizedRecords: records.filter(r => r.status === 'finalized').length,
    };
  },
};
