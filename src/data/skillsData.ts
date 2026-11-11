export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  tag?: string;
}

export interface SkillCategory {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  iconName: string;
  skills: SkillItem[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming-languages',
    number: '01',
    name: 'Programming Languages',
    subtitle: 'Core foundational languages for algorithmic problem solving, software engineering, and robust backend logic.',
    iconName: 'Code2',
    skills: [
      { id: 'python', name: 'Python', icon: 'python', tag: 'Core Language' },
      { id: 'java', name: 'Java', icon: 'java', tag: 'Enterprise & OOP' },
    ],
  },
  {
    id: 'frontend-development',
    number: '02',
    name: 'Frontend Development',
    subtitle: 'Modern client-side libraries, frameworks, and utility styling engines for responsive, accessible web interfaces.',
    iconName: 'Layout',
    skills: [
      { id: 'html5', name: 'HTML5', icon: 'html5', tag: 'Semantic Markup' },
      { id: 'css3', name: 'CSS3', icon: 'css3', tag: 'Modern Styling' },
      { id: 'javascript', name: 'JavaScript', icon: 'javascript', tag: 'ES6+ Scripting' },
      { id: 'react', name: 'React.js', icon: 'react', tag: 'UI Component Library' },
      { id: 'nextjs', name: 'Next.js', icon: 'nextjs', tag: 'React Framework' },
      { id: 'tailwindcss', name: 'Tailwind CSS', icon: 'tailwindcss', tag: 'Utility CSS Engine' },
    ],
  },
  {
    id: 'backend-development',
    number: '03',
    name: 'Backend Development',
    subtitle: 'Scalable server architectures, high-performance asynchronous runtimes, and resilient RESTful APIs.',
    iconName: 'Server',
    skills: [
      { id: 'fastapi', name: 'FastAPI', icon: 'fastapi', tag: 'Modern Python API' },
      { id: 'nodejs', name: 'Node.js', icon: 'nodejs', tag: 'Asynchronous Runtime' },
      { id: 'express', name: 'Express.js', icon: 'express', tag: 'Minimal Web Server' },
      { id: 'rest-api', name: 'REST APIs', icon: 'rest-api', tag: 'API Architecture' },
    ],
  },
  {
    id: 'ai-ml',
    number: '04',
    name: 'AI & Machine Learning',
    subtitle: 'Integrating cutting-edge generative AI models, document OCR intelligence, and machine learning pipelines.',
    iconName: 'Brain',
    skills: [
      { id: 'ai-api', name: 'AI API Integration', icon: 'ai-api', tag: 'LLM & Vision Models' },
      { id: 'ocr', name: 'OCR', icon: 'ocr', tag: 'Document Intelligence' },
      { id: 'ml-fundamentals', name: 'Machine Learning Fundamentals', icon: 'ml-fundamentals', tag: 'Statistical Algorithms' },
      { id: 'neural-networks', name: 'Neural Network Fundamentals', icon: 'neural-networks', tag: 'Deep Learning Models' },
    ],
  },
  {
    id: 'database-storage',
    number: '05',
    name: 'Database & Storage',
    subtitle: 'Relational database design, scalable document stores, and real-time backend persistence.',
    iconName: 'Database',
    skills: [
      { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', tag: 'Relational SQL' },
      { id: 'mongodb', name: 'MongoDB', icon: 'mongodb', tag: 'Document NoSQL' },
      { id: 'supabase', name: 'Supabase', icon: 'supabase', tag: 'Backend as a Service' },
    ],
  },
  {
    id: 'developer-tools',
    number: '06',
    name: 'Developer Tools',
    subtitle: 'Distributed version control workflows, collaborative hosting, and streamlined modern development environments.',
    iconName: 'Wrench',
    skills: [
      { id: 'git', name: 'Git', icon: 'git', tag: 'Distributed VCS' },
      { id: 'github', name: 'GitHub', icon: 'github', tag: 'Collaboration & CI/CD' },
      { id: 'vscode', name: 'VS Code', icon: 'vscode', tag: 'Code Editor' },
    ],
  },
  {
    id: 'financial-markets',
    number: '07',
    name: 'Financial Markets',
    subtitle: 'In-depth understanding of Indian stock market mechanics, equity derivatives, technical analysis, and risk management.',
    iconName: 'TrendingUp',
    skills: [
      { id: 'indian-stock-market', name: 'Indian Stock Market', icon: 'indian-stock-market', tag: 'NSE & BSE Architecture' },
      { id: 'equity-derivatives', name: 'Equity Derivatives', icon: 'equity-derivatives', tag: 'Futures & Options Spreads' },
      { id: 'futures-options', name: 'Futures & Options', icon: 'futures-options', tag: 'F&O Strategies & Hedging' },
      { id: 'technical-analysis', name: 'Technical Analysis', icon: 'technical-analysis', tag: 'Indicators & Trendlines' },
      { id: 'price-action', name: 'Price Action', icon: 'price-action', tag: 'Candlestick Dynamics' },
      { id: 'risk-management', name: 'Risk Management', icon: 'risk-management', tag: 'Capital Preservation' },
      { id: 'sector-rotation', name: 'Sector Rotation', icon: 'sector-rotation', tag: 'Macro Cycle Momentum' },
      { id: 'market-research', name: 'Market Research', icon: 'market-research', tag: 'Quantitative & Data Insights' },
    ],
  },
];

export const TICKER_ITEMS = [
  { name: 'Python', icon: 'python' },
  { name: 'Java', icon: 'java' },
  { name: 'React.js', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'GitHub', icon: 'github' },
];

