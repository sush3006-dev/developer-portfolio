
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { TechStack } from './components/sections/TechStack';
import { Education } from './components/sections/Education';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = ['home', 'about', 'experience', 'skills', 'education', 'projects', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 160;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full text-slate-800 selection:bg-slate-800 selection:text-white">
      {/* 
        Full-Screen Continuous Portfolio Shell with 20px Viewport Frame:
        Removes narrow max-width clamps and card gaps, creating one connected, seamless canvas.
      */}
      <main className="portfolio-shell w-full rounded-[24px] sm:rounded-[32px] md:rounded-[36px] bg-[#FFFEFA] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden relative flex flex-col">
        
        {/* SECTION 1: HERO (Full-Screen Initial Viewport with Navigation) */}
        <Hero activeSection={activeSection} />

        {/* SECTION 2: ABOUT (Full-Screen Editorial Flow) */}
        <About />

        {/* SECTION 3: EXPERIENCE (Full-Screen Interactive Roadmap) */}
        <Experience />

        {/* SECTION 4: SKILLS / TECH STACK (Full-Screen 3D Interactive Showcase) */}
        <TechStack />

        {/* SECTION 5: EDUCATION & LEARNING (Full-Screen Academic & Certification Growth) */}
        <Education />

        {/* SECTION 6: PROJECTS (Full-Screen Interactive 3D Showcase) */}
        <Projects />

        {/* SECTION 7: CONTACT & FOOTER (Full-Screen Unified Editorial Section) */}
        <Contact />

      </main>
    </div>
  );
}
