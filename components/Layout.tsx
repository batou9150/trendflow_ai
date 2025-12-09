import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, User } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { ClientProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeClient: ClientProfile;
  onClientChange: (client: ClientProfile) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeClient, onClientChange }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center flex-1">
             <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search trends, campaigns, or assets..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
             </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium">Active Workspace:</span>
                <select 
                    className="text-sm font-semibold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                    value={activeClient.id}
                    onChange={(e) => {
                        const client = MOCK_CLIENTS.find(c => c.id === e.target.value);
                        if (client) onClientChange(client);
                    }}
                >
                    {MOCK_CLIENTS.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
                <User className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
