/**
 * Academic Background and Continuous Learning Data
 */

export interface AcademicItem {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  status: 'Currently Pursuing' | 'Completed';
  performance?: string;
  description: string;
  highlights?: string[];
  isCurrent?: boolean;
}

export interface LearningItem {
  id: string;
  title: string;
  iconName: 'Brain' | 'Binary' | 'Layers' | 'TrendingUp';
  status: 'Currently Learning';
  description: string;
  topics: string[];
}

export const ACADEMIC_QUALIFICATIONS: AcademicItem[] = [
  {
    id: 'btech-ce',
    degree: 'B.Tech in Computer Engineering',
    institution: 'JSPM Wagholi',
    duration: '2025–2028',
    status: 'Currently Pursuing',
    description:
      'Currently developing a strong foundation in computer science, software engineering, programming and emerging technologies.',
    highlights: [
      'Core Software Engineering & Systems',
      'Data Structures & Advanced Algorithms',
      'Emerging Technologies & FinTech Architecture',
    ],
    isCurrent: true,
  },
  {
    id: 'diploma-ce',
    degree: 'Diploma in Computer Engineering',
    institution: 'Government Polytechnic / Institute of Technology',
    duration: 'Completed',
    status: 'Completed',
    performance: '85.71%',
    description:
      'Completed comprehensive diploma curriculum with distinction, building practical expertise in programming, databases, computer architecture, and hardware.',
    highlights: [
      'Academic Distinction: 85.71%',
      'Foundational OOP & Database Management',
      'Computer Systems & Networking',
    ],
    isCurrent: false,
  },
];

export const CONTINUOUS_LEARNING_AREAS: LearningItem[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    iconName: 'Brain',
    status: 'Currently Learning',
    description:
      'Exploring generative intelligence, neural network fundamentals, and practical machine learning pipelines.',
    topics: ['Python', 'Deep Learning', 'Neural Networks'],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    iconName: 'Binary',
    status: 'Currently Learning',
    description:
      'Strengthening analytical problem solving, data structure optimization, and algorithm efficiency.',
    topics: ['Data Structures', 'Algorithms', 'Problem Solving'],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    iconName: 'Layers',
    status: 'Currently Learning',
    description:
      'Designing modern, responsive client interfaces and high-performance server architectures.',
    topics: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Next.js',
      'Node.js',
      'Express.js',
      'FastAPI',
    ],
  },
  {
    id: 'financial-markets',
    title: 'Financial Markets',
    iconName: 'TrendingUp',
    status: 'Currently Learning',
    description:
      'Deepening understanding of Indian market mechanics, equity derivatives, technical price action, and risk preservation.',
    topics: [
      'Equity Derivatives',
      'Market Research',
      'Technical Analysis',
      'Futures & Options',
    ],
  },
];

