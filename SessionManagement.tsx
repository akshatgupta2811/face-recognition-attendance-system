import React, { useState } from 'react';
import { Calendar, Plus, Clock, Users, Play, CheckCircle, Building, Trash2, X } from 'lucide-react';
import { Session } from '../types';

interface SessionManagementProps {
  sessions: Session[];
  onCreateSession: (session: Partial<Session>) => void;
  onUpdateSessionStatus: (sessionId: string, status: 'Active' | 'Scheduled' | 'Completed') => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionManagement: React.FC<SessionManagementProps> = ({
  sessions,
  onCreateSession,
  onUpdateSessionStatus,
  onDeleteSession
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [batchClass, setBatchClass] = useState('CS-4A');
  const [department, setDepartment] = useState('Computer Science');
  const [instructor, setInstructor] = useState('Dr. Robert Vance');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onCreateSession({
      title,
      subject,
      batchClass,
      department,
      instructor,
      startTime,
      endTime
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#00FF41]" />
            <span>ATTENDANCE SESSION MANAGEMENT</span>
          </h2>
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest mt-0.5">
            Configure active classes, lecture slots, and multi-department sessions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>CREATE NEW SESSION</span>
        </button>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map((ses) => {
          const totalLogged = ses.presentCount + ses.lateCount;
          const rate = ses.totalStudents > 0 ? Math.round((totalLogged / ses.totalStudents) * 100) : 0;

          return (
            <div
              key={ses.id}
              className={`bg-[#111] border p-5 space-y-4 relative overflow-hidden transition-all ${
                ses.status === 'Active'
                  ? 'border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.1)]'
                  : 'border-[#222]'
              }`}
            >
              {/* Active Indicator Top Bar */}
              {ses.status === 'Active' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00FF41]" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#00FF41] uppercase tracking-widest">{ses.subject}</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">{ses.title}</h3>
                  <p className="text-xs font-mono text-[#888] uppercase mt-0.5">{ses.instructor}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                    ses.status === 'Active'
                      ? 'bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40 animate-pulse'
                      : ses.status === 'Scheduled'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-[#222] text-[#888] border border-[#333]'
                  }`}
                >
                  {ses.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#888] bg-[#0a0a0a] p-3 border border-[#222]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#666] flex items-center space-x-1 uppercase">
                    <Building className="w-3.5 h-3.5 text-[#666]" />
                    <span>Dept & Class</span>
                  </span>
                  <span className="font-mono font-bold text-white uppercase">{ses.department} ({ses.batchClass})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#666] flex items-center space-x-1 uppercase">
                    <Clock className="w-3.5 h-3.5 text-[#666]" />
                    <span>Schedule</span>
                  </span>
                  <span className="font-mono text-[#00FF41] font-bold">{ses.startTime} - {ses.endTime}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase">
                  <span className="text-[#888]">LOGGED ATTENDANCE</span>
                  <span className="font-bold text-[#00FF41]">{totalLogged} / {ses.totalStudents} ({rate}%)</span>
                </div>
                <div className="w-full bg-[#222] h-2">
                  <div
                    className="bg-[#00FF41] h-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-2">
                {ses.status === 'Active' ? (
                  <button
                    onClick={() => onUpdateSessionStatus(ses.id, 'Completed')}
                    className="flex-1 py-2 bg-[#222] hover:bg-[#333] text-amber-400 border border-[#444] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>CLOSE SESSION</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateSessionStatus(ses.id, 'Active')}
                    className="flex-1 py-2 bg-[#1a2b1f] hover:bg-[#233a2a] text-[#00FF41] border border-[#00FF41]/40 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Play className="w-4 h-4 fill-[#00FF41]" />
                    <span>ACTIVATE SESSION</span>
                  </button>
                )}

                {onDeleteSession && (
                  <button
                    onClick={() => setSessionToDelete(ses)}
                    className="p-2 bg-[#1a1a1a] hover:bg-rose-500/20 text-[#888] hover:text-rose-400 border border-[#333] hover:border-rose-500/40 transition-all cursor-pointer"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] max-w-md w-full p-6 space-y-5 shadow-2xl animate-[fade-in_0.2s_ease-out]">
            <h3 className="text-sm font-black text-white border-b border-[#222] pb-3 uppercase tracking-wider">
              CREATE ATTENDANCE SESSION
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Session / Class Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced AI & Machine Learning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS401"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Batch / Class</label>
                  <input
                    type="text"
                    required
                    placeholder="CS-4A"
                    value={batchClass}
                    onChange={(e) => setBatchClass(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41] cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1">Instructor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Robert Vance"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#222] px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#888] uppercase mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
                  CREATE SESSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Session Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-rose-500/40 max-w-md w-full p-6 space-y-4 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <span>CONFIRM SESSION DELETION</span>
              </h3>
              <button
                onClick={() => setSessionToDelete(null)}
                className="text-[#888] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#ccc]">
              Are you sure you want to delete <strong className="text-white">{sessionToDelete.title}</strong> ({sessionToDelete.id})?
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 bg-[#222] text-[#888] hover:text-white text-xs font-mono font-bold uppercase cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (onDeleteSession) onDeleteSession(sessionToDelete.id);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              >
                DELETE SESSION
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
