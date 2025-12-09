export interface Trend {
  id: string;
  keyword: string;
  category: string;
  volume: number;
  growth: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  description: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  industry: string;
  voice: string;
  avatar: string;
}

export interface GeneratedContent {
  platform: 'LinkedIn' | 'Twitter' | 'Instagram' | 'TikTok';
  content: string;
  hashtags: string[];
  suggestedImagePrompt?: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface HeadlineTest {
  variants: string[];
  winner?: string;
  isTesting: boolean;
  engagementStats?: Record<string, number>; // variant -> engagement score
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Testing';
  date: string;
  platform: string;
  clientId: string;
  rolloutMode?: 'standard' | 'dynamic';
  testDetails?: HeadlineTest;
}
