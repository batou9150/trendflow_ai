import { ClientProfile, Trend, Campaign } from './types';

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'c0',
    name: 'SFEIR',
    industry: 'Service',
    voice: 'Professional, Visionary, Disruptive, DeepImpact',
    avatar: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: 'c1',
    name: 'TechNova Solutions',
    industry: 'SaaS',
    voice: 'Professional, Visionary, Authoritative',
    avatar: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: 'c2',
    name: 'GreenLeaf Organics',
    industry: 'Wellness',
    voice: 'Warm, Eco-conscious, Educational',
    avatar: 'https://picsum.photos/id/2/200/200'
  },
  {
    id: 'c3',
    name: 'UrbanStyle Gear',
    industry: 'Fashion',
    voice: 'Edgy, Hype, Gen-Z Friendly',
    avatar: 'https://picsum.photos/id/3/200/200'
  }
];

export const MOCK_TRENDS: Trend[] = [
  {
    id: 't1',
    keyword: 'Sustainable AI',
    category: 'Technology',
    volume: 85000,
    growth: 120,
    sentiment: 'positive',
    description: 'Discussions around the energy consumption of large language models and green computing solutions.'
  },
  {
    id: 't2',
    keyword: 'Micro-Learning',
    category: 'Education',
    volume: 45000,
    growth: 85,
    sentiment: 'neutral',
    description: 'Shift towards bite-sized educational content on social platforms like TikTok and Reels.'
  },
  {
    id: 't3',
    keyword: 'Retro Tech Aesthetics',
    category: 'Design',
    volume: 62000,
    growth: 45,
    sentiment: 'positive',
    description: 'Visual trends embracing Y2K and 90s technology visuals in modern branding.'
  },
  {
    id: 't4',
    keyword: 'Silent Walking',
    category: 'Wellness',
    volume: 30000,
    growth: 200,
    sentiment: 'positive',
    description: 'A mindfulness practice involving walking without music or podcasts.'
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'cam1', name: 'Q4 Product Launch', status: 'Scheduled', date: '2023-11-15', platform: 'LinkedIn', clientId: 'c1' },
  { id: 'cam2', name: 'Eco-Tips Series', status: 'Published', date: '2023-10-20', platform: 'Instagram', clientId: 'c2' },
  { id: 'cam3', name: 'Black Friday Teaser', status: 'Draft', date: '2023-11-20', platform: 'TikTok', clientId: 'c3' },
];
