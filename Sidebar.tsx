import React from 'react';
import { LayoutDashboard, Camera, Users, ClipboardCheck, Calendar, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export type TabType = 'dashboard' | 'scanner' | 'students' | 'attendance' | 'sessions' | 'reports';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeSessionCount: number;
}

interface MenuItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activeSessionCount }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Live Face Scanner', icon: Camera, badge: 'Live' },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'attendance', label: 'Attendance Records', icon: ClipboardCheck },
    { id: 'sessions', label: 'Sessions', icon: Calendar, badge: activeSessionCount > 0 ? `${activeSessionCount}` : undefined },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#222] text-[#f0f0f0] flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-4rem)] select-none">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#666] mb-4 flex items-center space-x-1">
            <span className="text-[#00FF41]">//</span>
            <span>01 Navigation</span>
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111] text-[#00FF41] border-l-4 border-[#00FF41] pl-3 border-y border-r border-[#222]'
                      : 'text-[#888] hover:text-white hover:bg-[#111]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00FF41]' : 'text-[#666]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest ${
                        item.badge === 'Live'
                          ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/40 animate-pulse'
                          : 'bg-[#222] text-white border border-[#333]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Capabilities Info Box */}
        <div className="p-4 bg-[#111] border border-[#222] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white">
            <ShieldAlert className="w-4 h-4 text-[#00FF41]" />
            <span>GEMINI VISION AI</span>
          </div>
          <p className="text-[10px] font-mono text-[#888] leading-relaxed uppercase">
            Multi-factor facial detection with anti-spoofing verification & real-time landmark tracking.
          </p>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#222] text-[10px] font-mono text-[#666] flex items-center justify-between uppercase tracking-wider">
        <span>STATUS: <span className="text-[#00FF41] font-bold">ONLINE</span></span>
        <span>NODE/EXPRESS</span>
      </div>
    </aside>
  );
};
