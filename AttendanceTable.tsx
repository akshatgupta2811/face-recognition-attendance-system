import React, { useState } from 'react';
import { Search, Filter, Clock, CheckCircle2, UserCheck, Plus, Edit2, ShieldCheck, Download, Trash2, X } from 'lucide-react';
import { AttendanceRecord, Student, Session, AttendanceStatus } from '../types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  students: Student[];
  sessions: Session[];
  onLogManualAttendance: (record: Partial<AttendanceRecord>) => void;
  onUpdateRecordStatus: (id: string, status: AttendanceStatus, checkOutTime?: string) => void;
  onDeleteRecord?: (id: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  students,
  sessions,
  onLogManualAttendance,
  onUpdateRecordStatus,
  onDeleteRecord
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<AttendanceRecord | null>(null);

  // Manual check-in form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>('Present');

  const filtered = records.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          r.studentId.toLowerCase().includes(search.toLowerCase()) ||
                          r.sessionTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || r.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleOpenManualModal = () => {
    if (students.length > 0) setSelectedStudentId(students[0].id);
    if (sessions.length > 0) setSelectedSessionId(sessions[0].id);
    setManualStatus('Present');
    setIsManualModalOpen(true);
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    onLogManualAttendance({
      studentId: selectedStudentId,
      sessionId: selectedSessionId,
      status: manualStatus,
      method: 'Manual Check-in',
      confidenceScore: 100.0
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#00FF41]" />
            <span>ATTENDANCE LOG RECORDS</span>
          </h2>
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest mt-0.5">
            Biometric verification audit trail & manual overrides
          </p>
        </div>

        <button
          onClick={handleOpenManualModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>MANUAL CHECK-IN</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111] p-3 border border-[#222]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or session..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] text-xs text-white placeholder-[#666] pl-9 pr-4 py-2 font-mono focus:outline-none focus:border-[#00FF41]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] text-xs text-white px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] text-xs text-white px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Information Technology">Information Technology</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-[#111] border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#222] text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">
                <th className="py-3.5 px-4">STUDENT</th>
                <th className="py-3.5 px-4">SESSION & COURSE</th>
                <th className="py-3.5 px-4">DATE & TIME</th>
                <th className="py-3.5 px-4">METHOD & CONFIDENCE</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 font-mono text-[#666] uppercase">
                    No matching attendance records found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#161616] transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rec.photoUrl}
                          alt={rec.studentName}
                          className="w-9 h-9 object-cover border border-[#00FF41]/40"
                        />
                        <div>
                          <p className="font-bold text-white uppercase">{rec.studentName}</p>
                          <p className="text-[10px] font-mono text-[#888]">{rec.studentId} • {rec.department}</p>
                        </div>
                      </div>
                    </td>

                    {/* Session */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-white uppercase">{rec.sessionTitle}</p>
                      <p className="text-[10px] font-mono text-[#888] uppercase">{rec.batchClass}</p>
                    </td>

                    {/* Check In / Out Time */}
                    <td className="py-3 px-4">
                      <p className="font-mono text-[#00FF41] font-bold">{rec.checkInTime}</p>
                      <p className="text-[10px] font-mono text-[#888] uppercase">
                        Out: {rec.checkOutTime ? rec.checkOutTime : <span className="text-amber-400 font-bold">ACTIVE</span>}
                      </p>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />
                        <span className="text-white uppercase font-mono text-[11px]">{rec.method}</span>
                      </div>
                      <p className="text-[10px] text-[#00FF41] font-mono mt-0.5">{rec.confidenceScore}% MATCH</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider ${
                          rec.status === 'Present'
                            ? 'bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40'
                            : rec.status === 'Late'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!rec.checkOutTime ? (
                          <button
                            onClick={() => {
                              const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                              onUpdateRecordStatus(rec.id, rec.status, nowTime);
                            }}
                            className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] text-[#00FF41] border border-[#333] font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            CHECK OUT
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-[#666] uppercase">COMPLETED</span>
                        )}

                        {onDeleteRecord && (
                          <button
                            onClick={() => setRecordToDelete(rec)}
                            className="p-1 text-[#888] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Attendance Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL CHECK-IN MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] max-w-md w-full p-6 space-y-5 shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <h3 className="text-sm font-black text-white border-b border-[#222] pb-3 uppercase tracking-wider">
              MANUAL ATTENDANCE ENTRY
            </h3>

            <form onSubmit={handleSubmitManual} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41] cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id}) - {s.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Select Session</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41] cursor-pointer"
                >
                  {sessions.map(ses => (
                    <option key={ses.id} value={ses.id}>
                      {ses.title} ({ses.batchClass})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Attendance Status</label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value as AttendanceStatus)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41] cursor-pointer"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-[#222] text-[#888] text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer"
                >
                  CONFIRM LOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Record Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-rose-500/40 max-w-md w-full p-6 space-y-4 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <span>CONFIRM LOG DELETION</span>
              </h3>
              <button
                onClick={() => setRecordToDelete(null)}
                className="text-[#888] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#ccc]">
              Are you sure you want to delete attendance record for <strong className="text-white">{recordToDelete.studentName}</strong> ({recordToDelete.id})?
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 bg-[#222] text-[#888] hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (onDeleteRecord) onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              >
                DELETE RECORD
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
