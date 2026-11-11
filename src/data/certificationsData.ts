/**
 * Certifications and Credentials Data Architecture
 * Future-proof schema supporting unlimited certificates, dynamic filtering, and search.
 */

export type CertificateCategory =
  | 'All'
  | 'Programming'
  | 'AI & Machine Learning'
  | 'Full-Stack Development'
  | 'Finance'
  | 'Other';

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: Exclude<CertificateCategory, 'All'>;
  issueDate?: string;
  image?: string;
  credentialUrl?: string;
  status: 'completed' | 'in-progress';
  description?: string;
  skills?: string[];
  credentialId?: string;
}

export const CERTIFICATE_CATEGORIES: CertificateCategory[] = [
  'All',
  'Finance',
  'Programming',
  'Full-Stack Development',
  'AI & Machine Learning',
  'Other',
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-nism-equity-derivatives',
    title: 'NISM — Equity Derivatives',
    issuer: 'National Institute of Securities Markets (NISM)',
    category: 'Finance',
    status: 'in-progress',
    issueDate: 'In Preparation',
    description:
      'Rigorous preparation for the NISM-Series-VIII: Equity Derivatives Certification Examination, covering derivatives market architecture, options strategies, hedging, and regulatory risk compliance.',
    skills: ['Futures & Options', 'Equity Derivatives', 'Trading Strategies', 'Risk Management'],
    image: '',
    credentialUrl: '',
  },
  {
    id: 'cert-python-specialization',
    title: 'Python for Software Engineering',
    issuer: 'Advanced Software Academy',
    category: 'Programming',
    status: 'completed',
    issueDate: '2025-06',
    credentialId: 'PY-ENG-84920',
    description:
      'Comprehensive validation in Python programming, object-oriented design patterns, algorithmic data structures, and asynchronous runtime execution.',
    skills: ['Python 3', 'OOP Architecture', 'Algorithms', 'Clean Code'],
    image: '',
    credentialUrl: '',
  },
  {
    id: 'cert-fullstack-modern-web',
    title: 'Full-Stack Web Development',
    issuer: 'Modern Developer Institute',
    category: 'Full-Stack Development',
    status: 'completed',
    issueDate: '2025-03',
    credentialId: 'FS-WEB-39211',
    description:
      'Practical engineering of modern client-side React/Next.js architectures, RESTful API design, Node.js backend scalability, and database integration.',
    skills: ['React.js', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    image: '',
    credentialUrl: '',
  },
  {
    id: 'cert-machine-learning-foundations',
    title: 'Machine Learning Foundations',
    issuer: 'AI Research Institute',
    category: 'AI & Machine Learning',
    status: 'completed',
    issueDate: '2024-11',
    credentialId: 'ML-FND-10492',
    description:
      'Statistical learning theory, supervised/unsupervised algorithms, neural network design, and model performance evaluation.',
    skills: ['Machine Learning', 'Neural Networks', 'Statistical Modeling', 'Python'],
    image: '',
    credentialUrl: '',
  },
  {
    id: 'cert-technical-analysis-markets',
    title: 'Financial Technical Analysis',
    issuer: 'Capital Markets Institute',
    category: 'Finance',
    status: 'completed',
    issueDate: '2024-08',
    credentialId: 'TA-MKT-55102',
    description:
      'In-depth study of market candlestick dynamics, volume profiles, momentum oscillators, trend confirmation indicators, and capital preservation.',
    skills: ['Technical Analysis', 'Price Action', 'Chart Patterns', 'Risk-to-Reward'],
    image: '',
    credentialUrl: '',
  },
];

/**
 * Filter certificates by category
 */
export function filterCertificatesByCategory(
  items: CertificationItem[],
  category: CertificateCategory
): CertificationItem[] {
  if (category === 'All') return items;
  return items.filter((c) => c.category === category);
}

/**
 * Search certificates by title or issuer
 */
export function searchCertificates(
  items: CertificationItem[],
  query: string
): CertificationItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.skills?.some((s) => s.toLowerCase().includes(q))
  );
}

