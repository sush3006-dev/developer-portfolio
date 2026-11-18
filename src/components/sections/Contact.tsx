import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [touched, setTouched] = useState<{ [K in keyof FormState]?: boolean }>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const contactEmail = portfolioData.contact.email || 'kadamsushant5328@gmail.com';
  const locationText = portfolioData.contact.location || 'Pune, Maharashtra, India';
  const githubUrl = portfolioData.contact.social.github || 'https://github.com/sush3006-dev';
  const linkedinUrl = portfolioData.contact.social.linkedin || 'https://www.linkedin.com/in/sushant-kadam-26b831313/';
  const characterImgSrc = portfolioData.contact.characterImage || '/contact.jpg';

  // GSAP entrance animation with accessibility checks
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (prefersReducedMotion || !el) return;

    let ctx: gsap.Context | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

            // 1. White contact card subtle fade-up entrance
            tl.fromTo(
              '.contact-card-anim',
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.65 }
            )
              // 2. Form fields gentle staggered entrance
              .fromTo(
                '.contact-field-anim',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
                '-=0.35'
              )
              // 3. Character subtle fade-in with a small upward movement
              .fromTo(
                '.contact-char-anim',
                { opacity: 0, scale: 0.94, y: 15 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6 },
                '-=0.45'
              )
              // 4. Speech bubble gentle entrance
              .fromTo(
                '.contact-bubble-anim',
                { opacity: 0, scale: 0.8, y: -6 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4 },
                '-=0.2'
              )
              // 5. Contact information subtle fade-up
              .fromTo(
                '.contact-info-anim',
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
                '-=0.2'
              )
              // 6. Footer simple reveal
              .fromTo(
                '.contact-footer-anim',
                { opacity: 0 },
                { opacity: 1, duration: 0.45 },
                '-=0.15'
              );
          }, el);

          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (ctx) ctx.revert();
    };
  }, []);

  // Form validation logic
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Your name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Your email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return undefined;
      case 'message':
        if (!value.trim()) return 'Your message is required.';
        if (value.trim().length < 5) return 'Message must be at least 5 characters.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const messageErr = validateField('message', formData.message);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      message: messageErr,
    };
    setErrors(newErrors);

    if (nameErr || emailErr || messageErr) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          _gotcha: honeypot,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setHoneypot('');
        setTouched({});
        setErrors({});
      } else {
        const errorMsg = data?.message || 'Failed to dispatch message. Please verify your connection or try again.';
        setServerError(errorMsg);
      }
    } catch {
      setServerError('A network error occurred while communicating with the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setHoneypot('');
    setTouched({});
    setErrors({});
    setServerError(null);
    setSubmitted(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ backgroundColor: '#303030' }}
      className="w-full min-h-[calc(100vh-40px)] bg-[#303030] py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative z-[70] overflow-hidden scroll-mt-6 text-white transition-all duration-300 flex flex-col justify-center"
    >
      {/* Subtle background noise texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">

      {/* =========================================================================
          AREA 1: TOP WHITE CONTACT CONTAINER (Approx 38-44px rounded corners)
          ========================================================================= */}
      <div className="contact-card-anim w-full rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-white p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-black/20 text-slate-900 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ---------------------------------------------------------------------
              LEFT COLUMN: CONTACT FORM (60% Desktop Split)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            <h2 className="contact-field-anim font-heading text-xl sm:text-[22px] font-bold text-[#1e2531] mb-4 sm:mb-5 tracking-tight">
              Send Message
            </h2>

            {submitted ? (
              /* Success / Functional Submission Status */
              <div className="py-4 space-y-4">
                <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base">
                      Message Sent Successfully!
                    </p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      Message sent successfully! Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#505050] hover:bg-[#5f5f5f] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Send Another Message</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
                {/* Honeypot field for spam protection */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Server Error Alert Banner */}
                {serverError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-rose-900">Unable to Send Message</p>
                      <p className="text-rose-700 mt-0.5 leading-relaxed">{serverError}</p>
                    </div>
                  </div>
                )}
                {/* Field 1: Your Name */}
                <div className="contact-field-anim">
                  <label htmlFor="name-input" className="sr-only">
                    Your Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-[#f8f9fa] focus:bg-white focus:outline-none transition-all duration-150 ${
                      errors.name && touched.name
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200/90 focus:border-slate-400 focus:ring-1 focus:ring-slate-700'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p id="name-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Your Email */}
                <div className="contact-field-anim">
                  <label htmlFor="email-input" className="sr-only">
                    Your Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-[#f8f9fa] focus:bg-white focus:outline-none transition-all duration-150 ${
                      errors.email && touched.email
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200/90 focus:border-slate-400 focus:ring-1 focus:ring-slate-700'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p id="email-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Field 3: Your Message */}
                <div className="contact-field-anim">
                  <label htmlFor="message-input" className="sr-only">
                    Your Message
                  </label>
                  <textarea
                    id="message-input"
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-[#f8f9fa] focus:bg-white focus:outline-none transition-all duration-150 resize-y min-h-[110px] sm:min-h-[120px] ${
                      errors.message && touched.message
                        ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200/90 focus:border-slate-400 focus:ring-1 focus:ring-slate-700'
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p id="message-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Send Message Button */}
                <div className="contact-field-anim pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-[10px] bg-[#505050] hover:bg-[#5f5f5f] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN: EXISTING 3D CHARACTER (40% Desktop Split)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full py-4 sm:py-6 lg:py-0">
            <div className="relative w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 flex items-center justify-center">
              
              {/* Large circular light-grey background blob (approx 250-280px) */}
              <div
                className="absolute w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full bg-[#eceff3] -z-0"
                aria-hidden="true"
              />

              {/* Small dark floating speech bubble containing "Hi!" */}
              <div className="contact-bubble-anim absolute top-2 sm:top-4 right-4 sm:right-6 z-20 px-3 py-1 rounded-full bg-[#2b3545] text-white text-xs font-bold shadow-md flex items-center gap-1 select-none">
                <span>Hi!</span>
              </div>

              {/* Existing 3D Character image */}
              <img
                src={characterImgSrc}
                alt="Contact Greetings Character"
                className="contact-char-anim relative z-10 h-full max-h-[240px] sm:max-h-[270px] md:max-h-[300px] w-auto object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-300 hover:scale-[1.03]"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/contact.jpg';
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          AREA 2: CONTACT INFORMATION AREA (On Dark Background #303030)
          ========================================================================= */}
      <div className="relative z-10 mt-10 sm:mt-14 mb-8 sm:mb-10 text-center flex flex-col items-center">
        {/* Main Heading: Contact Us (Bold white typography, approx 28-32px) */}
        <h3 className="contact-info-anim font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Contact Us
        </h3>

        {/* Subtitle: Send us a message and we'll get back to you. (approx 16px) */}
        <p className="contact-info-anim text-sm sm:text-base text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Send us a message and we&apos;ll get back to you.
        </p>

        {/* Contact Detail Pills (horizontal on desktop) */}
        <div className="contact-info-anim mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 text-xs sm:text-sm">
          {/* Email Pill: mail icon + kadamsushant5328@gmail.com */}
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm border border-white/20 transition-all duration-200 hover:border-white/30 group cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
            <span className="font-medium">{contactEmail}</span>
          </a>

          {/* Location Pill: map-pin icon + Pune, Maharashtra, India */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
            <MapPin className="w-4 h-4 text-slate-300" />
            <span className="font-medium">{locationText}</span>
          </div>
        </div>

        {/* Compact GitHub & LinkedIn links */}
        <div className="contact-info-anim mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* =========================================================================
          AREA 3: BOTTOM FOOTER (Horizontal layout, separated by thin divider)
          ========================================================================= */}
      <div className="contact-footer-anim relative z-10 w-full">
        {/* Thin horizontal divider */}
        <div className="w-full border-t border-white/15 my-6 sm:my-8" />

        {/* Two-sided horizontal footer */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Left Side: Copyright */}
          <p className="font-normal text-center sm:text-left">
            &copy; 2026 Sushant. All rights reserved.
          </p>

          {/* Right Side: Navigation links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 font-medium">
            <a
              href="#home"
              className="hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#skills"
              className="hover:text-white transition-colors"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="hover:text-white transition-colors"
            >
              Works
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Scroll back to top of the page"
            >
              <span>Top</span>
              <span aria-hidden="true">&uarr;</span>
            </button>
          </div>
        </footer>
      </div>
      </div>
    </section>
  );
};

export default Contact;
