import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatientAuthStore } from '../stores/patientAuthStore';
import { usePatientStore } from '../stores/patientStore';
import { User, Phone, Heart, ArrowLeft, Plus, X } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  cid: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female']),
  blood_type: z.enum(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
  phone: z.string().optional(),
  allergies: z.array(z.object({ value: z.string() })).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const PatientProfile = () => {
  const { patient, setProfileCompleted } = usePatientAuthStore();
  const { addPatient } = usePatientStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      allergies: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'allergies',
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!patient) return;
    setSubmitting(true);

    const mrn = `MRN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    const patientId = `patient-${Date.now()}`;

    const newPatient = {
      id: patientId,
      mrn,
      name: data.name,
      cid: data.cid || '',
      discord_id: patient.discord_id,
      date_of_birth: data.date_of_birth,
      gender: data.gender as 'male' | 'female',
      blood_type: data.blood_type as any,
      phone: data.phone || '',
      allergies: data.allergies?.map(a => a.value).filter(Boolean) || [],
      status: 'active' as const,
      registration_date: new Date().toISOString().split('T')[0],
    };

    addPatient(newPatient);
    setProfileCompleted(patientId);
    navigate('/patient/dashboard');
    setSubmitting(false);
  };

  if (!patient) {
    navigate('/patient/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {patient.avatar ? (
                  <img src={patient.avatar} alt={patient.username} className="w-16 h-16 rounded-full" />
                ) : (
                  <User className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="text-gray-500">Welcome, {patient.username}! Please complete your profile to continue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* CID & DOB Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Number</label>
                  <input
                    {...register('cid')}
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="16-digit number"
                  />
                  {errors.cid && <p className="text-red-500 text-sm mt-1">{errors.cid.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    {...register('date_of_birth')}
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>}
                </div>
              </div>

              {/* Gender & Blood Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    {...register('gender')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    {...register('blood_type')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.blood_type && <p className="text-red-500 text-sm mt-1">{errors.blood_type.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="081234567890"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Heart className="w-4 h-4 inline mr-1" /> Allergies (Optional)
                </label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        {...register(`allergies.${index}.value`)}
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="e.g., Penicillin"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ value: '' })}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                  >
                    <Plus className="w-4 h-4" /> Add Allergy
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Complete Profile & Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
