import React, { useState, useEffect } from 'react';
import { ScanFace, Clock, Camera, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Session } from '../types';

interface NavbarProps {
  activeSession: Session | null;
  cameraActive: boolean;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSession, cameraActive, onOpenScanner }) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0a0a0a] border-b border-[#222] text-[#f0f0f0] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#00FF41] text-[#0a0a0a] flex items-center justify-center font-black rounded-none shadow-none">
            <ScanFace className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tighter uppercase text-white">
                FACE<span className="text-[#00FF41]">VERIFY</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#111] text-[#00FF41] border border-[#00FF41]/40">
                V2.4 PRO
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#888] hidden sm:block">Automated Biometric Attendance System</p>
          </div>
        </div>

        {/* Center: Active Session Status */}
        <div className="hidden md:flex items-center space-x-3 bg-[#111] px-3.5 py-1.5 border border-[#222]">
          <div className="relative flex h-2.5 w-2.5">
            {activeSession ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#00FF41] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 bg-[#00FF41]"></span>
              </>
            ) : (
              <span className="relative inline-flex h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </div>
          <div className="text-xs font-mono uppercase tracking-wider">
            <span className="text-[#666]">SESSION: </span>
            <span className="font-bold text-white">
              {activeSession ? `${activeSession.title} (${activeSession.batchClass})` : 'NO SESSION ACTIVE'}
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Live Camera Scanner Quick Toggle */}
          <button
            onClick={onOpenScanner}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              cameraActive
                ? 'bg-[#00FF41] text-[#0a0a0a] border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                : 'bg-[#111] hover:bg-[#222] text-white border-[#333]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">{cameraActive ? 'CAMERA ACTIVE' : 'LIVE SCANNER'}</span>
          </button>

          {/* Clock & Date Display */}
          <div className="hidden lg:flex flex-col text-right border-l border-[#222] pl-4">
            <div className="text-xs font-mono font-bold text-[#00FF41] flex items-center justify-end space-x-1 tracking-wider">
              <Clock className="w-3 h-3 text-[#666]" />
              <span>{time}</span>
            </div>
            <div className="text-[10px] font-mono text-[#777] uppercase tracking-widest">{dateStr}</div>
          </div>

        </div>

      </div>
    </header>
  );
};
