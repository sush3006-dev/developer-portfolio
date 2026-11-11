export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  color: string;          // Coordinated flat card background colour
  accentColor: string;    // Gold / highlight accent on card
  textColor: string;      // Warm-white or deep-navy text contrast
  role: string;           // My role on this project
  description: string;
  detailedDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  thumbnail?: string;
  status?: 'Completed' | 'In Progress' | 'In Development';
  highlights?: string[];
}

export const projectsData: Project[] = [
  {
    id: 'janaraksha',
    number: '01',
    title: 'Janaraksha',
    category: 'Digital Complaint Response & Legal Aid Platform',
    color: '#14264B', // Midnight Navy
    accentColor: '#D4A500',
    textColor: '#FFFEFA',
    role: 'Full-Stack Developer',
    description:
      'Full-stack digital complaint response and legal-aid platform supporting complaint submission, assignment, tracking, and resolution workflows with AI-assisted classification.',
    detailedDescription:
      'Developed with Next.js, React, TypeScript, Supabase, and PostgreSQL. Features role-based citizen and authority dashboards, multi-file evidence management with metadata, SLA monitoring, and AI-assisted complaint classification.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'AI'],
    githubUrl: 'https://github.com/Sushantkadam',
    liveDemoUrl: 'https://janaraksha-psi.vercel.app/',
    thumbnail: '/extracted/project-janaraksha.png',
    status: 'Completed',
    highlights: [
      'Role-based citizen & authority portals with SLA tracking',
      'Multi-file evidence upload management with structured metadata',
      'AI-assisted complaint classification and pre-complaint guidance',
    ],
  },
  {
    id: 'rakshakyc-ai',
    number: '02',
    title: 'RakshaKYC AI',
    category: 'AI-Powered KYC & OCR Verification',
    color: '#526B8A', // Muted Steel Blue
    accentColor: '#D4A500',
    textColor: '#FFFEFA',
    role: 'AI / Backend Engineer',
    description:
      'Intelligent identity verification and document OCR system automating real-time customer onboarding, KYC document parsing, and fraud prevention.',
    detailedDescription:
      'An automated OCR extraction pipeline built with Python, FastAPI, and OpenCV. Combines optical character recognition with facial matching and anti-spoofing checks for instant, fraud-resistant KYC processing.',
    technologies: ['Python', 'FastAPI', 'OpenCV', 'PyTorch', 'OCR', 'React'],
    githubUrl: 'https://github.com/Sushantkadam',
    liveDemoUrl: '',
    thumbnail: '/extracted/project-rakshakyc.png',
    status: 'In Progress',
    highlights: [
      'Automated identity document extraction & field parsing',
      'Facial biometrics matching & liveness verification',
      'Secure, high-throughput REST API architecture',
    ],
  },
  {
    id: 'smartpark',
    number: '03',
    title: 'SmartPark',
    category: 'IoT + AI Smart Parking Solution',
    color: '#789184', // Soft Sage
    accentColor: '#D4A500',
    textColor: '#FFFEFA',
    role: 'IoT & Full-Stack Developer',
    description:
      'Automated real-time parking management system integrating IoT sensors, computer vision space occupancy detection, and dynamic reservation navigation.',
    detailedDescription:
      'Edge IoT sensor networks paired with computer vision video analytics to monitor bay occupancy, guide drivers via dynamic routing, and optimize urban parking throughput with minimal latency.',
    technologies: ['IoT', 'Computer Vision', 'Python', 'MQTT', 'React', 'Node.js'],
    githubUrl: 'https://github.com/Sushantkadam',
    liveDemoUrl: '',
    thumbnail: '/extracted/project-smartpark.png',
    status: 'In Progress',
    highlights: [
      'Real-time parking bay occupancy tracking with computer vision',
      'MQTT sensor pub-sub for ultra-low latency updates',
      'Interactive visual slot reservation dashboard',
    ],
  },
  {
    id: 'tradefinder',
    number: '04',
    title: 'TradeFinder',
    category: 'Intraday F&O Stock Market Analysis Dashboard',
    color: '#B6A58A', // Warm Champagne
    accentColor: '#07163F',
    textColor: '#07163F',
    role: 'Frontend & Data Engineer',
    description:
      'High-performance intraday derivatives analytics dashboard delivering real-time options chain visualization, PCR analysis, OI tracking, and multi-indicator technical signals.',
    detailedDescription:
      'Engineered for active derivative traders, integrating real-time options Greeks, open interest build-up heatmaps, volume profile analysis, and automated algorithmic trade setup identification.',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Python', 'FastAPI', 'Financial Analytics'],
    githubUrl: 'https://github.com/Sushantkadam',
    liveDemoUrl: '',
    thumbnail: '/extracted/project-tradefinder.png',
    status: 'In Development',
    highlights: [
      'Live options chain calculation with real-time Greeks & PCR',
      'Open Interest (OI) buildup visualization & heatmaps',
      'Custom breakout & momentum technical signal scanners',
    ],
  },
];

