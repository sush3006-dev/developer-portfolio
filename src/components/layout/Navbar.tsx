import React, { useState, useEffect } from 'react';
import { Code2, Linkedin, Mail, Menu, X, Github, Globe } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection = 'home' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = portfolioData.navigation;

  const isLinkActive = (link: { name: string; href: string }) => {
    const targetId = link.href.replace('#', '').toLowerCase();
    const current = (activeSection || '').toLowerCase();
    return current === targetId || current === link.name.toLowerCase();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <header className="w-full pt-2 sm:pt-4 pb-2">
      <nav
        aria-label="Primary Navigation"
        className="flex items-center justify-between px-4 sm:px-8 py-3.5"
      >
        {/* Brand Lockup: Zone 1 */}
        <a
          href="#home"
          className="flex items-center gap-2 text-slate-800 hover:text-slate-950 font-bold text-base sm:text-lg tracking-tight transition-colors shrink-0 group"
        >
          <div className="flex items-center justify-center text-slate-700 group-hover:text-slate-900 transition-transform group-hover:scale-105">
            <span className="font-mono text-sm tracking-tighter text-slate-600 font-extrabold mr-1">
              &lt; / &gt;
            </span>
          </div>
          <span className="font-heading">{portfolioData.developer.brandTitle}</span>
        </a>

        {/* Desktop Links: Zone 2 */}
        <ul className="hidden md:flex items-center gap-5 lg:gap-8 text-xs lg:text-[13px] font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 transition-colors hover:text-slate-950 whitespace-nowrap ${
                    isActive ? 'text-slate-950 font-semibold' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800 rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Social Icons: Zone 3 */}
        <div className="hidden sm:flex items-center gap-3.5 text-slate-600 shrink-0">
          <a
            href={portfolioData.contact.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile (opens in new tab)"
            className="p-1.5 rounded-md hover:text-slate-950 hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
          >
            <Github className="w-4 h-4 pointer-events-none" />
          </a>
          <a
            href={portfolioData.contact.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile (opens in new tab)"
            className="p-1.5 rounded-md hover:text-slate-950 hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
          >
            <Linkedin className="w-4 h-4 pointer-events-none" />
          </a>
          <a
            href={`mailto:${portfolioData.contact.email}`}
            aria-label="Send Email to kadamsushant5328@gmail.com"
            className="p-1.5 rounded-md hover:text-slate-950 hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
          >
            <Mail className="w-4 h-4 pointer-events-none" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-black/5 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-5 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-around text-slate-600">
            <a
              href={portfolioData.contact.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile (opens in new tab)"
              className="p-2 rounded-lg hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
            >
              <Github className="w-5 h-5 pointer-events-none" />
            </a>
            <a
              href={portfolioData.contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile (opens in new tab)"
              className="p-2 rounded-lg hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
            >
              <Linkedin className="w-5 h-5 pointer-events-none" />
            </a>
            <a
              href={`mailto:${portfolioData.contact.email}`}
              aria-label="Send Email to kadamsushant5328@gmail.com"
              className="p-2 rounded-lg hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors inline-flex items-center justify-center"
            >
              <Mail className="w-5 h-5 pointer-events-none" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
