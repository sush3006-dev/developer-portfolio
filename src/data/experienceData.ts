export interface ExperienceCardItem {
  id: string;
  number: string;
  category: string;
  iconName: 'Users' | 'Compass' | 'Lightbulb' | 'TrendingUp';
  badge: {
    text: string;
    variant: 'amber' | 'slate' | 'blue' | 'emerald';
  };
  role: string;
  organization?: string;
  description: string;
}

export const EXPERIENCE_ITEMS: ExperienceCardItem[] = [
  {
    id: 'community',
    number: '01',
    category: 'COMMUNITY',
    iconName: 'Users',
    badge: {
      text: 'GenXCode',
      variant: 'amber',
    },
    organization: 'GenXCode',
    role: 'Community Member / Auditor',
    description:
      'Active community member and auditor at GenXCode, participating in developer discussions, code reviews, and peer knowledge-sharing to foster collaborative problem solving.',
  },
  {
    id: 'leadership',
    number: '02',
    category: 'LEADERSHIP',
    iconName: 'Compass',
    badge: {
      text: 'Initiative & Culture',
      variant: 'slate',
    },
    role: 'Team Coordination & Collaboration',
    description:
      'Coordinating engineering workflows, facilitating clear communication across project teams, and cultivating an environment grounded in accountability, focus, and mutual growth.',
  },
  {
    id: 'innovation',
    number: '03',
    category: 'INNOVATION',
    iconName: 'Lightbulb',
    badge: {
      text: 'Rapid Prototyping',
      variant: 'blue',
    },
    role: 'Hackathons & Problem Solving',
    description:
      'Tackling complex algorithmic challenges and building rapid functional prototypes under real-world constraints. Exploring modern tech stacks to turn ambitious ideas into working software.',
  },
  {
    id: 'professional-growth',
    number: '04',
    category: 'PROFESSIONAL GROWTH',
    iconName: 'TrendingUp',
    badge: {
      text: 'Continuous Evolution',
      variant: 'emerald',
    },
    role: 'Internships & Opportunities',
    description:
      'Steadily expanding technical depth in full-stack architecture, systems design, and financial technology. Actively preparing for impactful software engineering and FinTech opportunities.',
  },
];

