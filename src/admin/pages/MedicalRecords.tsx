import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Calendar, Stethoscope, Eye, Download, Camera, X, Image as ImageIcon, UserPlus, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import { usePatientStore } from '../../stores/patientStore';

interface MedicalRecord {
  id: string;
  patient_name: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  diagnosis: string;
  treatment: string;
  date: string;
  notes: string;
  status: 'active' | 'completed' | 'archived';
  images?: string[];
}

type RecordStatus = MedicalRecord['status'];

const MedicalRecords = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((s) => s.patients);

  const [records, setRecords] = useState<MedicalRecord[]>([
    { id: '1', patient_name: 'John Doe', patient_id: 'P001', doctor_id: '1', doctor_name: 'Dr. Sarah Johnson', diagnosis: 'Hypertension', treatment: 'Prescribed medication, lifestyle changes', date: '2026-05-01', notes: 'Follow-up in 3 months', status: 'active' },
    { id: '2', patient_name: 'Jane Smith', patient_id: 'P002', doctor_id: '2', doctor_name: 'Dr. Michael Chen', diagnosis: 'Arrhythmia', treatment: 'ECG monitoring, medication adjustment', date: '2026-05-02', notes: 'Regular monitoring required', status: 'active' },
    { id: '3', patient_name: 'Bob Wilson', patient_id: 'P003', doctor_id: '3', doctor_name: 'Dr. Emily Rodriguez', diagnosis: 'Pediatric Asthma', treatment: 'Inhaler prescription, allergy testing', date: '2026-05-03', notes: 'Parent education provided', status: 'completed' },
    { id: '4', patient_name: 'Alice Brown', patient_id: 'P004', doctor_id: '6', doctor_name: 'Dr. David Kim', diagnosis: 'Contact Dermatitis', treatment: 'Topical corticosteroids, avoidance therapy', date: '2026-05-04', notes: 'Skin patch test scheduled', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patient_name: '', patient_id: '', doctor_name: '', diagnosis: '', treatment: '', date: '', notes: '', status: 'active' as RecordStatus, images: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusColors: { [key: string]: string } = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const handlePatientClick = (patientName: string, patientId: string) => {
    const found = patients.find(p => p.name === patientName || p.mrn === patientId);
    if (found) {
      navigate('/admin/patient-database', { state: { selectedPatientId: found.id } });
    } else {
      navigate('/admin/patient-database', { state: { createPatient: true, patientName, patientId } });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...formData } : r));
    } else {
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        ...formData,
        doctor_id: '1',
      };
      setRecords(prev => [...prev, newRecord]);
    }
    setShowForm(false);
    setEditingRecord(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ patient_name: '', patient_id: '', doctor_name: '', diagnosis: '', treatment: '', date: '', notes: '', status: 'active', images: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setFormData({
      patient_name: record.patient_name,
      patient_id: record.patient_id,
      doctor_name: record.doctor_name,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      date: record.date,
      notes: record.notes,
      status: record.status,
      images: record.images || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setShowDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? {
      ...r,
      status: r.status === 'active' ? 'completed' as RecordStatus :
               r.status === 'completed' ? 'archived' as RecordStatus : 'active' as RecordStatus,
    } : r));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    let processed = 0;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push(ev.target?.result as string);
        processed++;
        if (processed === files.length) {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleView = (record: MedicalRecord) => {
    setViewingRecord(record);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null || !viewingRecord?.images) return;
    const len = viewingRecord.images.length;
    if (direction === 'prev') {
      setLightboxIndex(lightboxIndex <= 0 ? len - 1 : lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxIndex >= len - 1 ? 0 : lightboxIndex + 1);
    }
  };

  const exportToPDF = (record: MedicalRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Hospital Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Sehat Medika Hospital', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Your Health, Our Priority', pageWidth / 2, 27, { align: 'center' });
    yPos = 45;

    // Title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.text('MEDICAL RECORD', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Divider
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Record Info Bar
    doc.setFillColor(245, 248, 255);
    doc.rect(margin, yPos, pageWidth - margin * 2, 22, 'F');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Record ID: ${record.id}`, margin + 4, yPos + 7);
    doc.text(`Date: ${new Date(record.date).toLocaleDateString()}`, margin + 4, yPos + 15);
    doc.text(`Status: ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}`, pageWidth / 2 + 10, yPos + 7);
    doc.text(`Patient ID: ${record.patient_id}`, pageWidth / 2 + 10, yPos + 15);
    yPos += 30;

    // Patient & Doctor Info
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('PATIENT & DOCTOR INFORMATION', margin, yPos);
    yPos += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(`Patient Name: ${record.patient_name}`, margin + 4, yPos);
    yPos += 6;
    doc.text(`Patient ID: ${record.patient_id}`, margin + 4, yPos);
    yPos += 6;
    doc.text(`Attending Doctor: ${record.doctor_name}`, margin + 4, yPos);
    yPos += 12;

    // Diagnosis
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('DIAGNOSIS', margin, yPos);
    yPos += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const diagLines = doc.splitTextToSize(record.diagnosis, pageWidth - margin * 2);
    doc.text(diagLines, margin + 4, yPos);
    yPos += diagLines.length * 5 + 8;

    // Treatment
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('TREATMENT PLAN', margin, yPos);
    yPos += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const treatLines = doc.splitTextToSize(record.treatment, pageWidth - margin * 2);
    doc.text(treatLines, margin + 4, yPos);
    yPos += treatLines.length * 5 + 8;

    // Notes
    if (record.notes) {
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text('NOTES', margin, yPos);
      yPos += 6;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      const noteLines = doc.splitTextToSize(record.notes, pageWidth - margin * 2);
      doc.text(noteLines, margin + 4, yPos);
      yPos += noteLines.length * 5 + 8;
    }

    // Images
    if (record.images && record.images.length > 0) {
      // Check if we need a new page
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text('ATTACHED IMAGES', margin, yPos);
      yPos += 6;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      record.images.forEach((img) => {
        try {
          const imgProps = doc.getImageProperties(img);
          let imgWidth = pageWidth - margin * 2;
          let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          if (imgHeight > 120) {
            imgHeight = 120;
            imgWidth = (imgProps.width * imgHeight) / imgProps.height;
          }
          if (yPos + imgHeight > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
          }
          doc.addImage(img, 'JPEG', margin, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        } catch (e) {
          // Skip broken images
        }
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Generated by Sehat Medika Hospital - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`medical-record-${record.patient_id}-${record.id}.pdf`);
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">{records.length} total records</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingRecord(null); resetForm(); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingRecord ? 'Edit Medical Record' : 'Add New Medical Record'}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="mr-photo-upload"
                />
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="mr-photo-upload"
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500">Add</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500">JPG, PNG. Upload lab results, X-rays, etc. Multiple files supported.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    value={formData.patient_id}
                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attending Doctor</label>
                <input
                  type="text"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark"
                >
                  {editingRecord ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, diagnosis, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Images</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      {patients.find(p => p.name === record.patient_name || p.mrn === record.patient_id) ? (
                        <button
                          onClick={() => handlePatientClick(record.patient_name, record.patient_id)}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          {record.patient_name}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">{record.patient_name}</p>
                          <button
                            onClick={() => handlePatientClick(record.patient_name, record.patient_id)}
                            className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800"
                          >
                            <UserPlus className="w-3 h-3" /> Create Patient
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">{record.patient_id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{record.doctor_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{record.diagnosis}</p>
                    <p className="text-xs text-gray-600 truncate max-w-xs">{record.treatment}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(record.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${statusColors[record.status]}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {record.images && record.images.length > 0 ? (
                        <>
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-gray-600">{record.images.length}</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(record)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportToPDF(record)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save as PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(record.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">No medical records found.</div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Medical Record?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Medical Record Details</h2>
              <button
                onClick={() => setViewingRecord(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{viewingRecord.patient_name}</h3>
                    <p className="text-sm text-gray-500">{viewingRecord.patient_id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[viewingRecord.status]}`}>
                    {viewingRecord.status.charAt(0).toUpperCase() + viewingRecord.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Doctor</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{viewingRecord.doctor_name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{new Date(viewingRecord.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Diagnosis</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{viewingRecord.diagnosis}</p>
              </div>

              {/* Treatment */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Treatment</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{viewingRecord.treatment}</p>
              </div>

              {/* Notes */}
              {viewingRecord.notes && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{viewingRecord.notes}</p>
                </div>
              )}

              {/* Attached Images */}
              {viewingRecord.images && viewingRecord.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Attached Images ({viewingRecord.images.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {viewingRecord.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(idx)}
                      >
                        <img src={img} alt={`Attachment ${idx + 1}`} className="w-full h-40 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setViewingRecord(null); handleEdit(viewingRecord); }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => exportToPDF(viewingRecord)}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox */}
      {lightboxIndex !== null && viewingRecord?.images && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="fixed top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white z-[70] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Previous */}
          {viewingRecord.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white z-[70] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {viewingRecord.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="fixed right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white z-[70] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewingRecord.images[lightboxIndex]}
              alt={`Attachment ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          {viewingRecord.images.length > 1 && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {lightboxIndex + 1} / {viewingRecord.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
