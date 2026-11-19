# Sushant Kadam — Developer Portfolio

🌐 **[VISIT MY LIVE PORTFOLIO](https://developer-portfolio-ufc8.vercel.app)**

A modern, interactive personal portfolio website showcasing full-stack projects, computer engineering expertise, and financial technology explorations.

Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **Three.js**, **GSAP**, **Motion**, and **Resend**.

## ✨ Features

- **Dynamic Hero Section**: Smooth frame-by-frame canvas animation streamer (300 frames) with interactive ambient drift and 3D typography.
- **Interactive About Section**: Immersive narrative storytelling highlighting critical thinking, systems architecture, and rapid prototyping.
- **Experience & Education**: Timeline-driven view of engineering coursework, milestones, and hands-on technical contributions.
- **Tech Stack & Skills Showcase**: Categorized inventory covering Frontend, Backend, Systems, and FinTech tools with interactive category filters.
- **Interactive Project Cards**: 3D card shuffling stack powered by GSAP with toggleable deep-dive detail sheets, live deployment links, and transparent WebM character integration.
- **Functional Contact Form**: Direct server-side email dispatch powered by the **Resend API SDK** with honeypot spam protection, server-side validation, rate limiting, and dynamic `Reply-To` headers.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/) & [Motion](https://motion.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email Service**: [Resend](https://resend.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sush3006-dev/developer-portfolio.git
   cd developer-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Resend API credentials in `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_RECEIVER_EMAIL=kadamsushant5328@gmail.com
   CONTACT_FROM_EMAIL=onboarding@resend.dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment

To create an optimized production build:

```bash
npm run build
```

The compiled static assets will be output to the `dist/` directory.

### Deploying to Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the following environment variables in your Vercel project settings:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_RECEIVER_EMAIL`: `kadamsushant5328@gmail.com`
   - `CONTACT_FROM_EMAIL`: `onboarding@resend.dev` (or your verified domain)
4. Deploy!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
