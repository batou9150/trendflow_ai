import React, { useState } from 'react';
import { MOCK_TRENDS } from '../constants';
import { Trend, ClientProfile } from '../types';
import { analyzeTrendRelevance, findTrends } from '../services/geminiService';
import { TrendingUp, Sparkles, ArrowRight, Loader2, Search } from 'lucide-react';

interface TrendSpotterProps {
  activeClient: ClientProfile;
}

const TrendSpotter: React.FC<TrendSpotterProps> = ({ activeClient }) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [displayTrends, setDisplayTrends] = useState<Trend[]>(MOCK_TRENDS);

  const handleAnalyze = async (trend: Trend) => {
    setSelectedTrend(trend);
    setLoading(true);
    setAnalysis('');
    
    const result = await analyzeTrendRelevance(trend, activeClient.voice, activeClient.industry);
    setAnalysis(result);
    setLoading(false);
  };

  const handleDeepSearch = async () => {
    setSearching(true);
    // Reset selection during new search
    setSelectedTrend(null);
    setAnalysis('');

    const newTrends = await findTrends(activeClient.industry, activeClient.voice);
    if (newTrends && newTrends.length > 0) {
        setDisplayTrends(newTrends);
    }
    setSearching(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* List of Trends */}
      <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-600" />
                Trends
            </h2>
            <button 
                onClick={handleDeepSearch}
                disabled={searching}
                className="text-xs flex items-center bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
                {searching ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                ) : (
                    <Search className="w-3 h-3 mr-1" />
                )}
                Deep Search
            </button>
        </div>
        <div className="overflow-y-auto p-2 space-y-2 flex-1">
          {searching ? (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                <p className="text-sm text-center px-6">Scanning {activeClient.industry} trends for <br/>"{activeClient.voice}" voice...</p>
             </div>
          ) : (
              displayTrends.map((trend) => (
                <div 
                    key={trend.id} 
                    onClick={() => handleAnalyze(trend)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                        selectedTrend?.id === trend.id 
                        ? 'border-brand-500 bg-brand-50 shadow-sm' 
                        : 'border-transparent hover:bg-slate-50 border-slate-100'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-900">{trend.keyword}</h3>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            +{trend.growth}%
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{trend.category}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{trend.description}</p>
                </div>
              ))
          )}
          {!searching && displayTrends.length === 0 && (
             <div className="p-8 text-center text-slate-400">
                <p>No trends found.</p>
             </div>
          )}
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                AI Strategic Analysis
            </h2>
            {selectedTrend && (
                <span className="text-xs text-slate-500">Analyzing for: <strong>{activeClient.name}</strong></span>
            )}
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {!selectedTrend ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a trend to generate a strategic relevance report.</p>
            </div>
          ) : (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{selectedTrend.keyword}</h1>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                        <span>Vol: {selectedTrend.volume.toLocaleString()}</span>
                        <span>•</span>
                        <span>Sentiment: <span className="capitalize text-green-600">{selectedTrend.sentiment}</span></span>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                        AI Insight
                    </h3>
                    {loading ? (
                        <div className="flex items-center space-x-3 text-slate-500 py-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Analyzing brand fit and generating strategy...</span>
                        </div>
                    ) : (
                        <div className="prose prose-sm prose-slate max-w-none">
                            <p className="whitespace-pre-line leading-relaxed">{analysis}</p>
                        </div>
                    )}
                </div>

                {!loading && (
                    <div className="flex justify-end">
                        <a href="#/create" className="flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors">
                            <span>Create Content for this Trend</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendSpotter;

