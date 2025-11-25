export interface NewsSource {
  title: string;
  outlet: string;
  url: string;
}
export interface NewsStory {
  id: string;
  category: string;
  headline: string;
  snippet: string;
  timestamp: string;
  sources: NewsSource[];
  liked: boolean;
  saved: boolean;
}
export const mockNews: NewsStory[] = [{
  id: '1',
  category: 'TECH',
  headline: 'AI MODELS NOW CONSUME MORE POWER THAN SMALL COUNTRIES',
  snippet: 'Latest data centers running large language models are drawing unprecedented amounts of electricity. Energy consumption rivals that of nations like Ireland.',
  timestamp: '2H AGO',
  sources: [{
    title: 'Data Center Energy Crisis Deepens',
    outlet: 'TECH REVIEW',
    url: '#'
  }, {
    title: 'AI Power Consumption Report 2024',
    outlet: 'ENERGY WEEKLY',
    url: '#'
  }, {
    title: 'The Environmental Cost of AI',
    outlet: 'SCIENCE DAILY',
    url: '#'
  }],
  liked: false,
  saved: false
}, {
  id: '2',
  category: 'POLITICS',
  headline: 'MAJOR POLICY SHIFT ANNOUNCED IN CLIMATE LEGISLATION',
  snippet: 'New framework introduces carbon pricing mechanism affecting major industries. Implementation timeline set for Q2 2025 with phased rollout.',
  timestamp: '4H AGO',
  sources: [{
    title: 'Climate Bill Passes Final Vote',
    outlet: 'POLITICAL WIRE',
    url: '#'
  }, {
    title: 'Industry Response to New Regulations',
    outlet: 'BUSINESS TIMES',
    url: '#'
  }, {
    title: 'Environmental Groups Respond',
    outlet: 'GREEN NEWS',
    url: '#'
  }],
  liked: false,
  saved: false
}, {
  id: '3',
  category: 'BUSINESS',
  headline: 'STARTUP VALUATIONS DROP 40% IN TECH SECTOR',
  snippet: 'Market correction hits venture-backed companies hardest. Late-stage funding rounds seeing significant down-rounds as investors reassess risk.',
  timestamp: '6H AGO',
  sources: [{
    title: 'VC Funding Trends Q4 2024',
    outlet: 'VENTURE BEAT',
    url: '#'
  }, {
    title: 'Tech Bubble or Correction?',
    outlet: 'FINANCIAL POST',
    url: '#'
  }, {
    title: 'Startup Survival Strategies',
    outlet: 'FOUNDER WEEKLY',
    url: '#'
  }],
  liked: false,
  saved: false
}, {
  id: '4',
  category: 'SCIENCE',
  headline: 'BREAKTHROUGH IN QUANTUM COMPUTING STABILITY',
  snippet: 'Research team achieves 10x improvement in qubit coherence time. Development could accelerate practical quantum computer deployment.',
  timestamp: '8H AGO',
  sources: [{
    title: 'Quantum Leap in Computing',
    outlet: 'NATURE',
    url: '#'
  }, {
    title: 'Technical Analysis of Breakthrough',
    outlet: 'PHYSICS TODAY',
    url: '#'
  }, {
    title: 'Commercial Implications',
    outlet: 'TECH INSIDER',
    url: '#'
  }],
  liked: false,
  saved: false
}, {
  id: '5',
  category: 'CULTURE',
  headline: 'STREAMING WARS ENTER NEW PHASE WITH BUNDLING',
  snippet: 'Major platforms announce cross-service packages. Move signals shift from growth-at-all-costs to profitability focus.',
  timestamp: '12H AGO',
  sources: [{
    title: 'The Bundle Returns',
    outlet: 'MEDIA WATCH',
    url: '#'
  }, {
    title: 'Consumer Impact Analysis',
    outlet: 'ENTERTAINMENT WEEKLY',
    url: '#'
  }, {
    title: 'Industry Consolidation Trends',
    outlet: 'HOLLYWOOD REPORTER',
    url: '#'
  }],
  liked: false,
  saved: false
}];