/**
 * Centralized Portfolio Data
 * Easily customize your personal details, projects, tech stack, and content here.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedDescription?: string;
  thumbnail: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface TechItem {
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface PortfolioData {
  developer: {
    greeting: string;
    name: string;
    role: string;
    shortBio: string;
    brandTitle: string;
    resumeUrl?: string;
  };
  heroVideo: {
    mp4Url?: string;
    webmUrl?: string;
    posterUrl?: string;
    objectFit?: 'contain' | 'cover';
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
  };
  stats: {
    experience: string;
    projects: string;
    clients: string;
    availability: string;
  };
  navigation: Array<{
    name: string;
    href: string;
  }>;
  about: {
    title: string;
    description: string;
    characterImage: string;
    closingStatement?: string;
    extendedBio?: string[];
    highlights?: string[];
  };
  techStack: {
    title: string;
    subtitle: string;
    featured: TechItem[];
    all: TechItem[];
  };
  projects: {
    title: string;
    subtitle: string;
    items: Project[];
  };
  servicesBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    characterImage: string;
    services: ServiceItem[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
  contact: {
    title: string;
    subtitle: string;
    characterImage: string;
    email: string;
    phone: string;
    location: string;
    social: {
      github?: string;
      linkedin?: string;
      email?: string;
      dribbble?: string;
    };
  };
}

export const portfolioData: PortfolioData = {
  developer: {
    greeting: "Hello, I'm",
    name: "Sushant.",
    role: "Computer Engineering Student | Aspiring FinTech Engineer",
    shortBio: "Driven by curiosity and an ambition to build things that matter, I constantly push myself to learn, explore and step beyond my comfort zone. I believe in thinking bigger, embracing challenges and turning ambitious ideas into reality.",
    brandTitle: "Sushant",
    resumeUrl: "/resume.pdf",
  },
  heroVideo: {
    mp4Url: "/assets/aistudio/Young_man_walking_and_kicking_9c5402ff_1080p_855b02b3.mp4",
    webmUrl: "",
    posterUrl: "",
    objectFit: "cover",
    autoPlay: true,
    muted: true,
    loop: true,
  },
  stats: {
    experience: "2+ Years",
    projects: "50+",
    clients: "30+",
    availability: "Open to Opportunities",
  },
  navigation: [
    { name: "ABOUT", href: "#about" },
    { name: "EXPERIENCE", href: "#experience" },
    { name: "SKILLS", href: "#skills" },
    { name: "EDUCATION", href: "#education" },
    { name: "PROJECTS", href: "#projects" },
  ],
  about: {
    title: "Beyond Code, Into Ideas.",
    description: "I'm a Computer Engineering student driven by curiosity, creativity and the desire to build meaningful technology.",
    characterImage: "/assets/aistudio/about_character_clean.png",
    closingStatement: "Always curious. Always exploring. Always building.",
    extendedBio: [
      "I'm a Computer Engineering student driven by curiosity, creativity and the desire to build meaningful technology.",
      "I enjoy exploring ideas, understanding complex problems and discovering how technology can create real-world impact.",
      "For me, engineering is not just about writing code. It's about thinking critically, experimenting with ideas and continuously learning."
    ],
    highlights: [
      "Critical thinking & systems architecture",
      "Experimental technology & rapid prototyping",
      "Meaningful real-world impact"
    ]
  },
  techStack: {
    title: "The Stack Behind My Work.",
    subtitle: "The technologies, tools and financial knowledge I explore to build practical solutions.",
    featured: [
      {
        name: "React",
        category: "Frontend",
        description: "Library for building user interfaces",
        icon: "react",
      },
      {
        name: "JavaScript",
        category: "Language",
        description: "Programming language for the web",
        icon: "javascript",
      },
      {
        name: "Tailwind CSS",
        category: "Styling",
        description: "Utility-first CSS framework",
        icon: "tailwind",
      },
      {
        name: "MongoDB",
        category: "Database",
        description: "NoSQL database",
        icon: "mongodb",
      },
    ],
    all: [
      { name: "React", category: "Frontend", description: "UI Component Architecture", icon: "react" },
      { name: "TypeScript", category: "Language", description: "Strict Typed JavaScript", icon: "typescript" },
      { name: "Next.js", category: "Full-Stack", description: "Production App Framework", icon: "nextjs" },
      { name: "JavaScript", category: "Language", description: "Modern ES6+ Syntax", icon: "javascript" },
      { name: "Tailwind CSS", category: "Styling", description: "Utility-First Styling", icon: "tailwind" },
      { name: "MongoDB", category: "Database", description: "Scalable Document Store", icon: "mongodb" },
      { name: "Node.js", category: "Backend", description: "Server Runtime", icon: "nodejs" },
      { name: "Motion", category: "Animation", description: "Smooth Declarative Motion", icon: "motion" },
    ]
  },
  projects: {
    title: "My Work",
    subtitle: "Explore my latest projects and creations",
    items: [
      {
        id: "project-1",
        title: "Project One",
        category: "Web Development",
        description: "Modern web application with responsive design and smooth user experience.",
        detailedDescription: "An AI-powered SaaS invoice management platform featuring client portal billing, real-time export generators, customizable invoice templates, and automated payment tracking.",
        thumbnail: "/extracted/project-1-thumb.png",
        tags: ["React", "TypeScript", "Tailwind CSS", "AI SaaS"],
        demoUrl: "https://example.com/demo-1",
        githubUrl: "https://github.com/example/project-1",
      },
      {
        id: "project-2",
        title: "Project Two",
        category: "Mobile App",
        description: "Mobile-first application with focus on performance and accessibility.",
        detailedDescription: "High-performance mobile web application with fluid gesture navigation, touch-optimized layouts, dynamic dark mode, and offline capability.",
        thumbnail: "/extracted/project-2-thumb.png",
        tags: ["React", "Tailwind CSS", "Framer Motion"],
        demoUrl: "https://example.com/demo-2",
        githubUrl: "https://github.com/example/project-2",
      },
      {
        id: "project-3",
        title: "Project Three",
        category: "Dashboard",
        description: "Dashboard interface with data visualization and real-time updates.",
        detailedDescription: "Interactive enterprise data dashboard showcasing custom KPI tracking, telemetry feeds, customer journey analytics, and responsive table views.",
        thumbnail: "/extracted/project-3-thumb.png",
        tags: ["React", "Tailwind CSS", "Charts"],
        demoUrl: "https://example.com/demo-3",
        githubUrl: "https://github.com/example/project-3",
      },
    ],
  },
  servicesBanner: {
    title: "Let's grow your brand together!",
    subtitle: "We help businesses build strong digital presence through modern design, clean code, and smart solutions.",
    buttonText: "My Services",
    characterImage: "/assets/aistudio/service_desk_cropped.png",
    services: [
      {
        id: "s1",
        title: "Frontend Engineering",
        description: "Building responsive, blazing-fast web applications with modern frameworks, robust state management, and type safety.",
        deliverables: ["Single Page Applications", "Next.js / React Apps", "Design System Implementation", "Performance Optimization"]
      },
      {
        id: "s2",
        title: "UI/UX Design Translation",
        description: "Converting high-fidelity Figma and visual designs into pixel-accurate, accessible, and delightful interactive code.",
        deliverables: ["Pixel-Perfect Layouts", "Responsive Mobile Adaptation", "Smooth Micro-Interactions", "WCAG AA Accessibility"]
      },
      {
        id: "s3",
        title: "Full-Stack Web Solutions",
        description: "Architecting end-to-end web experiences with REST/GraphQL APIs, database persistence, and secure authentications.",
        deliverables: ["Backend API Integration", "Database Schemas", "Authentication & Roles", "Cloud Deployment"]
      }
    ]
  },
  testimonials: {
    title: "My Clients",
    subtitle: "Feedback from happy clients",
    items: [
      {
        id: "t1",
        name: "John Smith",
        role: "CEO, TechCorp",
        initials: "JS",
        quote: "Outstanding work quality and professionalism. Exceeded expectations.",
        rating: 5,
      },
      {
        id: "t2",
        name: "Sarah Johnson",
        role: "Director, InnovateCo",
        initials: "SJ",
        quote: "Highly skilled and reliable. Delivered on time and within budget.",
        rating: 5,
      },
      {
        id: "t3",
        name: "Michael Chen",
        role: "CTO, DigitalPlus",
        initials: "MC",
        quote: "Technical expertise is exceptional. Would definitely hire again.",
        rating: 5,
      },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle: "Send us a message and we'll get back to you.",
    characterImage: "/assets/aistudio/contact_character_clean.png",
    email: "kadamsushant5328@gmail.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra, India",
    social: {
      github: "https://github.com/sush3006-dev",
      linkedin: "https://www.linkedin.com/in/sushant-kadam-26b831313/",
      email: "mailto:kadamsushant5328@gmail.com",
    },
  },
};
