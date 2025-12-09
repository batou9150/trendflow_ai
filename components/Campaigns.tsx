import React, { useState } from 'react';
import { MOCK_CAMPAIGNS } from '../constants';
import { ClientProfile, Campaign } from '../types';
import { Calendar as CalendarIcon, MoreVertical, Clock, CheckCircle, CircleDashed, Plus, X } from 'lucide-react';

interface CampaignsProps {
  activeClient: ClientProfile;
}

const Campaigns: React.FC<CampaignsProps> = ({ activeClient }) => {
  // Initialize with mock data, but allow adding new ones
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    platform: 'LinkedIn',
    status: 'Draft' as Campaign['status'],
    date: new Date().toISOString().split('T')[0]
  });

  const activeCampaigns = allCampaigns.filter(c => c.clientId === activeClient.id);

  const handleSave = () => {
    if (!formData.name) return;

    const newCampaign: Campaign = {
      id: `new-${Date.now()}`,
      clientId: activeClient.id,
      name: formData.name,
      platform: formData.platform,
      status: formData.status,
      date: formData.date
    };

    setAllCampaigns([newCampaign, ...allCampaigns]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      platform: 'LinkedIn',
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
        case 'Published': return 'text-green-600 bg-green-50';
        case 'Scheduled': return 'text-blue-600 bg-blue-50';
        default: return 'text-slate-500 bg-slate-100';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
      switch (status) {
          case 'Published': return <CheckCircle className="w-4 h-4 mr-1" />;
          case 'Scheduled': return <Clock className="w-4 h-4 mr-1" />;
          default: return <CircleDashed className="w-4 h-4 mr-1" />;
      }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Campaigns & Schedule</h1>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center transition-colors shadow-sm"
        >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Campaign Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Platform</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {activeCampaigns.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No campaigns found for {activeClient.name}. Start by creating one!
                        </td>
                    </tr>
                ) : (
                    activeCampaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{camp.name}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(camp.status)}`}>
                                    {getStatusIcon(camp.status)}
                                    {camp.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{camp.platform}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                                {camp.date}
                            </td>
                            <td className="px-6 py-4">
                                <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-900">Create New Campaign</h3>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
                        <input 
                            type="text"
                            autoFocus
                            placeholder="e.g. Summer Product Launch"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                                value={formData.platform}
                                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                            >
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value as Campaign['status']})}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                        <input 
                            type="date"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!formData.name}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Create Campaign
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;