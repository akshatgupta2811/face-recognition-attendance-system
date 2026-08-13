import React, { useState, useRef } from 'react';
import { Search, UserPlus, Filter, Trash2, Edit3, Camera, Check, X, Mail, Phone, Building, User } from 'lucide-react';
import { Student } from '../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Partial<Student>) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onSelectStudent
}) => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [batchClass, setBatchClass] = useState('CS-4A');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Webcam Modal Capture inside Add Student
  const [useWebcamCapture, setUseWebcamCapture] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startFormWebcam = async () => {
    setUseWebcamCapture(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name !== 'AbortError' && !err.message?.includes('interrupted')) {
              console.warn('Form webcam play error:', err);
            }
          });
        }
      }
    } catch {
      alert('Camera access unavailable');
    }
  };

  const captureFormPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL('image/jpeg'));
      }
      // Stop webcam
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) stream.getTracks().forEach(t => t.stop());
      setUseWebcamCapture(false);
    }
  };

  const departmentsList = ['All', 'Computer Science', 'Electrical Engineering', 'Data Science', 'Information Technology'];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setDepartment('Computer Science');
    setBatchClass('CS-4A');
    setEmail('');
    setPhone('');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setName(s.name);
    setDepartment(s.department);
    setBatchClass(s.batchClass);
    setEmail(s.email);
    setPhone(s.phone);
    setPhotoUrl(s.photoUrl);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStudent) {
      onEditStudent({
        ...editingStudent,
        name,
        department,
        batchClass,
        email,
        phone,
        photoUrl
      });
    } else {
      onAddStudent({
        name,
        department,
        batchClass,
        email,
        phone,
        photoUrl
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center space-x-2">
            <User className="w-5 h-5 text-[#00FF41]" />
            <span>STUDENT DIRECTORY MANAGEMENT</span>
          </h2>
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest mt-0.5">
            Biometric records • Profile enrollment & face descriptors
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>REGISTER NEW STUDENT</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111] p-3 border border-[#222]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] text-xs text-white placeholder-[#666] pl-9 pr-4 py-2 font-mono focus:outline-none focus:border-[#00FF41]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#666]" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] text-xs text-white px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            {departmentsList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="bg-[#111] border border-[#222] hover:border-[#00FF41] p-5 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-start space-x-4">
              <img
                src={s.photoUrl}
                alt={s.name}
                className="w-16 h-16 object-cover border-2 border-[#00FF41] shrink-0 cursor-pointer"
                onClick={() => onSelectStudent(s)}
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40 uppercase">
                    {s.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#00FF41] font-bold uppercase">{s.status}</span>
                </div>
                <h3
                  onClick={() => onSelectStudent(s)}
                  className="text-sm font-black text-white uppercase tracking-wider hover:text-[#00FF41] transition-colors cursor-pointer truncate"
                >
                  {s.name}
                </h3>
                <p className="text-xs font-mono text-[#888] flex items-center space-x-1 uppercase">
                  <Building className="w-3 h-3 text-[#666]" />
                  <span className="truncate">{s.department} • {s.batchClass}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#222] text-[11px] font-mono text-[#888] space-y-1">
              <div className="flex items-center space-x-2 truncate">
                <Mail className="w-3 h-3 text-[#666]" />
                <span className="truncate">{s.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-[#666]" />
                <span>{s.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onSelectStudent(s)}
                className="text-xs font-mono text-[#00FF41] hover:underline font-bold uppercase tracking-wider cursor-pointer"
              >
                PROFILE & HISTORY →
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] transition-colors cursor-pointer"
                  title="Edit Student"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStudentToDelete(s)}
                  className="p-1.5 text-[#888] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Student"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ADD / EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] max-w-lg w-full p-6 space-y-5 shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingStudent ? 'EDIT STUDENT RECORD' : 'REGISTER NEW STUDENT'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Preview & Capture */}
              <div className="flex items-center space-x-4">
                <img
                  src={photoUrl}
                  alt="Student Preview"
                  className="w-20 h-20 object-cover border-2 border-[#00FF41]"
                />
                <div className="space-y-2">
                  <p className="text-xs font-mono text-[#888] uppercase">Biometric Photo Reference</p>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={startFormWebcam}
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-xs font-mono font-bold text-white uppercase border border-[#444] flex items-center space-x-1 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#00FF41]" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Webcam Capture Overlay */}
              {useWebcamCapture && (
                <div className="bg-[#0a0a0a] p-3 border border-[#222] space-y-3">
                  <video ref={videoRef} className="w-full aspect-video bg-black object-cover" />
                  <button
                    type="button"
                    onClick={captureFormPhoto}
                    className="w-full py-2 bg-[#00FF41] text-[#0a0a0a] font-black uppercase text-xs cursor-pointer"
                  >
                    CAPTURE FRAME
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Batch / Class</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-4A"
                    value={batchClass}
                    onChange={(e) => setBatchClass(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#222] text-[#888] text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer"
                >
                  {editingStudent ? 'SAVE CHANGES' : 'REGISTER STUDENT'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-rose-500/40 max-w-md w-full p-6 space-y-4 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <span>CONFIRM STUDENT DELETION</span>
              </h3>
              <button
                onClick={() => setStudentToDelete(null)}
                className="text-[#888] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#ccc]">
              Are you sure you want to remove <strong className="text-white">{studentToDelete.name}</strong> ({studentToDelete.id})? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-[#222] text-[#888] hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              >
                DELETE STUDENT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
