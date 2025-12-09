import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ClientProfile, GeneratedContent } from '../types';
import { generateSocialContent, generateMarketingImage, generateMarketingVideo } from '../services/geminiService';
import { PenTool, Loader2, Linkedin, Twitter, Instagram, Video, Copy, Check, Image as ImageIcon, Film, Upload, Download, Sparkles, Key, Lock, Globe } from 'lucide-react';

interface ContentFactoryProps {
    activeClient: ClientProfile;
}

type TabMode = 'text' | 'image' | 'video';

const ContentFactory: React.FC<ContentFactoryProps> = ({ activeClient }) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<TabMode>('text');

    // --- Text Gen State ---
    const [topic, setTopic] = useState(() => {
        const state = location.state as { trend?: { keyword: string; description: string }; analysis?: string } | null;
        if (state?.trend) {
            return `Create content about: ${state.trend.keyword}\n\nContext: ${state.trend.description}\n\nStrategic Insight: ${state.analysis || ''}`;
        }
        return '';
    });
    const [platforms, setPlatforms] = useState<string[]>(['LinkedIn']);
    const [language, setLanguage] = useState('English');
    const [postImage, setPostImage] = useState<string | null>(null);
    const [textResults, setTextResults] = useState<GeneratedContent[]>([]);
    const [isTextGenerating, setIsTextGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // --- Image Gen State ---
    const [imagePrompt, setImagePrompt] = useState('');
    const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isImageGenerating, setIsImageGenerating] = useState(false);

    // --- Video Gen State ---
    const [videoPrompt, setVideoPrompt] = useState('');
    const [videoFile, setVideoFile] = useState<string | null>(null); // Base64
    const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isVideoGenerating, setIsVideoGenerating] = useState(false);

    // --- Auth State ---
    const [needsApiKey, setNeedsApiKey] = useState(false);


    // --- Helper Functions ---

    const checkApiKey = async (): Promise<boolean> => {
        // Cast window to any to avoid type conflict with existing AIStudio declarations
        const aistudio = (window as any).aistudio;
        if (aistudio && aistudio.hasSelectedApiKey) {
            const hasKey = await aistudio.hasSelectedApiKey();
            if (!hasKey) {
                setNeedsApiKey(true);
                return false;
            }
        }
        setNeedsApiKey(false);
        return true;
    };

    const handleOpenKeySelection = async () => {
        // Cast window to any to avoid type conflict with existing AIStudio declarations
        const aistudio = (window as any).aistudio;
        if (aistudio && aistudio.openSelectKey) {
            await aistudio.openSelectKey();
            setNeedsApiKey(false);
        }
    };

    const availablePlatforms = [
        { name: 'LinkedIn', icon: Linkedin },
        { name: 'Twitter', icon: Twitter },
        { name: 'Instagram', icon: Instagram },
        { name: 'TikTok', icon: Video },
    ];

    const languages = [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Chinese (Simplified)', 'Japanese'
    ];

    const togglePlatform = (p: string) => {
        setPlatforms(prev =>
            prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
        );
    };

    const handleGenerateText = async () => {
        if (!topic || platforms.length === 0) return;
        setIsTextGenerating(true);
        setTextResults([]);

        const data = await generateSocialContent(topic, activeClient.voice, platforms, language, postImage || undefined);
        setTextResults(data);
        setIsTextGenerating(false);
    };

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        const hasKey = await checkApiKey();
        if (!hasKey) return;

        setIsImageGenerating(true);
        setGeneratedImage(null);
        try {
            const result = await generateMarketingImage(imagePrompt, imageSize);
            setGeneratedImage(result);
        } catch (e) {
            console.error(e);
            // If 404 or specific error, might prompt for key again.
            // For now, rely on initial check.
        }
        setIsImageGenerating(false);
    };

    const handleGenerateVideo = async () => {
        if (!videoFile || !videoPrompt) return;
        const hasKey = await checkApiKey();
        if (!hasKey) return;

        setIsVideoGenerating(true);
        setGeneratedVideo(null);
        try {
            const result = await generateMarketingVideo(videoFile, videoPrompt, videoAspectRatio);
            setGeneratedVideo(result);
        } catch (e) {
            console.error(e);
        }
        setIsVideoGenerating(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // --- Sub-Components ---

    const renderApiKeyPrompt = () => (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-sm animate-in fade-in">
            <div className="bg-amber-100 p-3 rounded-full">
                <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">Pro Feature Access Required</h3>
                <p className="text-slate-600 max-w-md mt-2">
                    High-definition image and video generation requires a connected Google Cloud Project with a paid API key.
                </p>
            </div>
            <button
                onClick={handleOpenKeySelection}
                className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
            >
                <Key className="w-4 h-4" />
                <span>Connect Pro Account</span>
            </button>
            <p className="text-xs text-slate-500">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-amber-800">Learn more about billing</a>
            </p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Content Factory</h1>
                <p className="text-slate-500 mt-2">Generate multi-modal assets tailored to {activeClient.name}'s brand.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 space-x-8">
                {[
                    { id: 'text', label: 'Social Posts', icon: PenTool },
                    { id: 'image', label: 'Image Studio', icon: ImageIcon },
                    { id: 'video', label: 'Motion (Veo)', icon: Film }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as TabMode);
                            setNeedsApiKey(false); // Reset prompt on tab switch
                        }}
                        className={`flex items-center space-x-2 pb-4 border-b-2 font-medium transition-all ${activeTab === tab.id
                            ? 'border-brand-600 text-brand-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* --- TEXT MODE --- */}
            {activeTab === 'text' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Topic or Seed Content</label>
                            <textarea
                                className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                                placeholder="Paste a URL, a messy brain dump, or a trend summary here..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Reference Image (Optional)</label>
                                <div className="flex items-center space-x-4">
                                    <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                        <Upload className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-600">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePostImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    {postImage && (
                                        <div className="relative w-16 h-16 group">
                                            <img src={postImage} alt="Reference" className="w-full h-full object-cover rounded-lg border border-slate-200" />
                                            <button
                                                onClick={() => setPostImage(null)}
                                                className="absolute -top-2 -right-2 bg-slate-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Target Platforms</label>
                            <div className="flex gap-4">
                                {availablePlatforms.map((p) => {
                                    const isSelected = platforms.includes(p.name);
                                    return (
                                        <button
                                            key={p.name}
                                            onClick={() => togglePlatform(p.name)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${isSelected
                                                ? 'bg-brand-50 border-brand-500 text-brand-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <p.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{p.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>Using Voice: <strong>{activeClient.voice}</strong></span>
                            </div>
                            <button
                                onClick={handleGenerateText}
                                disabled={isTextGenerating || !topic || platforms.length === 0}
                                className={`flex items-center px-8 py-3 rounded-lg font-medium text-white transition-all ${isTextGenerating || !topic
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {isTextGenerating ? (
                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</>
                                ) : (
                                    <><Sparkles className="w-5 h-5 mr-2" />Generate Content</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {textResults.map((result, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                    <span className="font-bold text-slate-700 flex items-center">
                                        {result.platform === 'LinkedIn' && <Linkedin className="w-4 h-4 mr-2 text-[#0077b5]" />}
                                        {result.platform === 'Twitter' && <Twitter className="w-4 h-4 mr-2 text-[#1da1f2]" />}
                                        {result.platform === 'Instagram' && <Instagram className="w-4 h-4 mr-2 text-[#e4405f]" />}
                                        {result.platform === 'TikTok' && <Video className="w-4 h-4 mr-2 text-black" />}
                                        {result.platform}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(result.content, idx)}
                                        className="text-slate-400 hover:text-brand-600"
                                    >
                                        {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="p-5 flex-1 space-y-4">
                                    <div className="prose prose-sm prose-slate max-w-none">
                                        <p className="whitespace-pre-wrap">{result.content}</p>
                                    </div>
                                    {result.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {result.hashtags.map((tag, i) => (
                                                <span key={i} className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded">
                                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Output Language</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full pl-10 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none bg-white"
                            >
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* --- IMAGE MODE --- */}
            {activeTab === 'image' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                        {needsApiKey ? renderApiKeyPrompt() : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Image Prompt</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-sm"
                                        placeholder="Describe the image you want to generate..."
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Quality / Size</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                        value={imageSize}
                                        onChange={(e) => setImageSize(e.target.value as any)}
                                    >
                                        <option value="1K">1K (Standard)</option>
                                        <option value="2K">2K (High Res)</option>
                                        <option value="4K">4K (Ultra HD)</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleGenerateImage}
                                    disabled={isImageGenerating || !imagePrompt}
                                    className={`w-full flex justify-center items-center px-4 py-3 rounded-lg font-medium text-white transition-all ${isImageGenerating || !imagePrompt
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : 'bg-brand-600 hover:bg-brand-700 shadow-md'
                                        }`}
                                >
                                    {isImageGenerating ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating...</>
                                    ) : (
                                        <><ImageIcon className="w-5 h-5 mr-2" />Generate Image</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[400px]">
                        {isImageGenerating ? (
                            <div className="text-center space-y-4">
                                <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
                                <p className="text-slate-500 font-medium">Generating your visual asset...</p>
                                <p className="text-xs text-slate-400">Powered by Gemini 3 Pro</p>
                            </div>
                        ) : generatedImage ? (
                            <div className="relative group w-full h-full flex items-center justify-center p-4">
                                <img src={generatedImage} alt="Generated" className="max-w-full max-h-[500px] rounded-lg shadow-lg" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                    <a href={generatedImage} download="generated-asset.png" className="bg-white text-slate-900 px-6 py-2 rounded-full font-medium hover:bg-slate-100 flex items-center">
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-center">
                                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Your generated image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- VIDEO MODE --- */}
            {activeTab === 'video' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                        {needsApiKey ? renderApiKeyPrompt() : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Source Image</label>
                                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {videoFile ? (
                                            <div className="relative h-24 w-auto mx-auto inline-block">
                                                <img src={videoFile} alt="Preview" className="h-full rounded object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs">Change</div>
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 py-4">
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                                <span className="text-sm">Upload Reference Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Prompt (Optional)</label>
                                    <textarea
                                        className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-sm"
                                        placeholder="Describe the motion (e.g., Camera pans right, The character smiles...)"
                                        value={videoPrompt}
                                        onChange={(e) => setVideoPrompt(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Aspect Ratio</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setVideoAspectRatio('16:9')}
                                            className={`px-3 py-2 border rounded-lg text-sm ${videoAspectRatio === '16:9' ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'bg-white border-slate-300 text-slate-600'}`}
                                        >
                                            Landscape (16:9)
                                        </button>
                                        <button
                                            onClick={() => setVideoAspectRatio('9:16')}
                                            className={`px-3 py-2 border rounded-lg text-sm ${videoAspectRatio === '9:16' ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'bg-white border-slate-300 text-slate-600'}`}
                                        >
                                            Portrait (9:16)
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateVideo}
                                    disabled={isVideoGenerating || !videoFile}
                                    className={`w-full flex justify-center items-center px-4 py-3 rounded-lg font-medium text-white transition-all ${isVideoGenerating || !videoFile
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : 'bg-brand-600 hover:bg-brand-700 shadow-md'
                                        }`}
                                >
                                    {isVideoGenerating ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
                                    ) : (
                                        <><Film className="w-5 h-5 mr-2" />Generate Video</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[400px]">
                        {isVideoGenerating ? (
                            <div className="text-center space-y-4 max-w-xs">
                                <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
                                <h3 className="font-bold text-slate-700">Generating with Veo</h3>
                                <p className="text-sm text-slate-500">This may take a minute. Veo is calculating pixel dynamics and rendering frames...</p>
                            </div>
                        ) : generatedVideo ? (
                            <div className="w-full h-full p-4 flex flex-col items-center">
                                <video controls autoPlay loop className="max-w-full max-h-[500px] rounded-lg shadow-lg bg-black">
                                    <source src={generatedVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <a href={generatedVideo} download="generated-video.mp4" className="mt-4 bg-white text-slate-900 px-6 py-2 rounded-full font-medium hover:bg-slate-100 flex items-center shadow-sm">
                                    <Download className="w-4 h-4 mr-2" /> Download Video
                                </a>
                            </div>
                        ) : (
                            <div className="text-slate-400 text-center">
                                <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Upload an image to animate it with Veo</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentFactory;