import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, FileText, CheckCircle, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { services, timeSlots } from '../data/mockData';
import { useAppointmentStore } from '../stores/appointmentStore';
import { usePatientAuthStore } from '../stores/patientAuthStore';

const step1Schema = z.object({
  service_id: z.string().min(1, 'Please select a service'),
});

const step2Schema = z.object({
  date: z.string().min(1, 'Please select a date'),
  time_slot: z.string().min(1, 'Please select a time slot'),
});

const step3Schema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(2, 'Phone number is required'),
  notes: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    service_id?: string;
    date?: string;
    time_slot?: string;
    patient_name?: string;
    phone?: string;
    notes?: string;
  }>({});

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const { addAppointment } = useAppointmentStore();
  const { patient } = usePatientAuthStore();

  const handleSubmitFinal = () => {
    const refNumber = 'APT-' + Date.now().toString().slice(-8);
    const newAppointment = {
      id: Date.now().toString(),
      ref_number: refNumber,
      patient_name: formData.patient_name || '',
      phone: formData.phone || '',
      discord_id: patient?.discord_id || '',
      patient_discord_id: patient?.discord_id || '',
      service_id: formData.service_id || '',
      doctor_id: '',
      doctor_name: '',
      date: formData.date || '',
      time_slot: formData.time_slot || '',
      status: 'pending' as const,
      notes: formData.notes || '',
    };
    addAppointment(newAppointment);
    navigate('/appointment/confirmation', {
      state: { refNumber, ...formData, doctor_name: 'To be assigned' },
    });
  };

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                  s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>Service</span>
            <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>Schedule</span>
            <span className={step >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>Details</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <ServiceStep
              onNext={handleNext}
              defaultValues={{ service_id: formData.service_id }}
            />
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <ScheduleStep
              onNext={handleNext}
              onBack={handleBack}
              minDate={getMinDate()}
              timeSlots={timeSlots}
              defaultValues={{ date: formData.date, time_slot: formData.time_slot }}
            />
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <DetailsStep
              onNext={handleSubmitFinal}
              onBack={handleBack}
              defaultValues={{
                patient_name: formData.patient_name,
                phone: formData.phone,
                notes: formData.notes,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Step 1 Component
const ServiceStep = ({ onNext, defaultValues }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Service</h2>
          <p className="text-gray-600">Choose the department you need</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <label
              key={service.id}
              className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-blue-50"
            >
              <input
                {...register('service_id')}
                type="radio"
                value={service.id}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.service_id && <p className="text-red-500 text-sm">{errors.service_id.message}</p>}

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
        >
          Next Step <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

// Step 2 Component
const ScheduleStep = ({ onNext, onBack, minDate, timeSlots, defaultValues }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
          <p className="text-gray-600">Pick date and time slot (Open 24 Hours)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            {...register('date')}
            type="date"
            min={minDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Available Time Slots (24 Hours)</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot: string) => (
              <label
                key={slot}
                className="flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-blue-50 has-[:checked]:text-primary"
              >
                <input
                  {...register('time_slot')}
                  type="radio"
                  value={slot}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{slot}</span>
              </label>
            ))}
          </div>
          {errors.time_slot && <p className="text-red-500 text-sm mt-1">{errors.time_slot.message}</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Step 3 Component
const DetailsStep = ({ onNext, onBack, defaultValues }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
          <p className="text-gray-600">Enter your information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register('patient_name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="John Doe"
          />
          {errors.patient_name && <p className="text-red-500 text-sm mt-1">{errors.patient_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder="Any additional information..."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> A doctor will be assigned to your appointment and will be shown on your dashboard after confirmation.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Confirm Booking <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
