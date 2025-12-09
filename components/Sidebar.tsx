import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PenTool, Calendar, Settings, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: TrendingUp, label: 'Trend Spotter', path: '/trends' },
    { icon: PenTool, label: 'Content Factory', path: '/create' },
    { icon: Calendar, label: 'Campaigns', path: '/campaigns' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-medium'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex h-screen sticky top-0">
      <div className="p-6 flex items-center space-x-2">
        <div className="bg-brand-600 p-2 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">TrendFlow AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Platform</div>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={getLinkClass}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <NavLink to="/settings" className={getLinkClass({ isActive: false })}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
