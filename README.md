# Premium Professional Portfolio & Admin CMS

A modern, high-performance personal developer portfolio website paired with an enterprise-grade private SaaS Admin Content Management System (CMS). Built with Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, Auth.js, Tiptap, and Cloudinary.

---

## 🌟 Highlights & Key Features

### 1. Public Portfolio
- **Minimal, Elegant Design**: Engineered for a senior personal brand—clean typography, restrained modern styling, and subtle micro-interactions without cluttered effects.
- **Dynamic Content**: Zero hard-coded portfolio content. All profile data, projects, skills, career history, certifications, and blogs are retrieved dynamically from the database.
- **Section Visibility Engine**: Enable or disable sections (About, Skills, Experience, Education, Projects, Certifications, Achievements, Blog, Contact) on-the-fly from the Admin Settings.
- **Dedicated Project Case Studies (`/projects/[slug]`)**: In-depth architecture breakdown featuring challenges faced, technical solutions engineered, measurable results, technology stack badges, and image galleries.
- **Interactive Certifications**: Grid of verified credentials featuring verification links, image modal previews, and official PDF documents.
- **Career Timeline**: Clean responsive chronological timeline of positions, responsibilities, and technologies used.
- **Technical Blog (`/blog` & `/blog/[slug]`)**: Full publishing suite powered by Tiptap rich-text editing with code blocks, headings, tags, and reading time estimation.
- **Contact Inquiries**: Validated contact form with database storage, spam protection, and automated email notifications via Resend.
- **Dark / Light Theme System**: Polished dual-theme support using `next-themes` with automatic system preference detection.
- **SEO & Metadata**: Dynamic `sitemap.xml`, `robots.txt`, and OpenGraph metadata tags.

### 2. Private Admin CMS (`/admin`)
- **Secure Server-Enforced Authentication**: Protected by Auth.js with bcryptjs password hashing and server-side route guards.
- **Overview Dashboard**: High-level metrics, quick actions, draft vs. published summaries, recent inquiries, and recent activity logs.
- **Projects Manager**: Create, edit, preview, delete, publish/unpublish, and reorder projects with relational technology tagging.
- **Drag-and-Drop Reordering**: Clean reordering persisted directly to the database for projects, skills, experience, education, certificates, achievements, and social links.
- **Draft / Publish System**: Work on projects, articles, or credentials in private draft mode before publishing to the public site.
- **Media Library**: Upload and manage project screenshots, certificate badges, and resume PDFs with Cloudinary integration (and zero-config local fallback for development).
- **Inbound Message Center**: Filter inbox messages, read full inquiries, mark as read/unread, archive, or delete.
- **Resume Management**: Upload, replace, and configure your public PDF resume.
- **Site & SEO Settings**: Customize hero headlines, CTA buttons, social handles, navbar sections, and global Open Graph meta tags.
- **Audit Activity Trail**: Real-time log of administrative events and content mutations.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, Server Components) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS, CSS Variables / Design Tokens |
| **UI Components** | Radix UI primitives, Lucide React icons, Sonner (Toasts) |
| **Rich Text** | Tiptap (Headings, Code, Lists, Links, Blockquotes) |
| **Database** | PostgreSQL & SQLite supported via Prisma ORM |
| **Authentication** | Auth.js (NextAuth v5) with bcryptjs credentials provider |
| **Validation** | Zod, React Hook Form |
| **Media Storage** | Cloudinary (with local development fallback) |
| **Email** | Resend (with development console fallback) |

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default local `.env` configuration (ready out-of-the-box):
```env
# Database (SQLite by default for zero-friction local run)
DATABASE_URL="file:./dev.db"

# Auth.js / NextAuth
AUTH_SECRET="portfolio-super-secret-key-change-me-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Media Storage (Optional: Local fallback active if empty)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Resend Email (Optional: Logs to console if empty)
RESEND_API_KEY=""
CONTACT_NOTIFICATION_EMAIL="owner@example.com"

# Public Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Initialize & Seed Database
Sync the database schema and populate realistic professional developer data:
```bash
npm run db:push
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` for the public website, and `http://localhost:3000/admin` for the admin portal.

---

## 🔐 Admin Dashboard Credentials

Immediately after running `npm run db:seed`, log in with:

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@portfolio.com`
- **Password**: `adminpassword123`

*(You can edit your email, name, and password anytime from the Admin CMS).*

---

## ☁️ Deployment Guide

### Deploying to Vercel & Neon PostgreSQL

1. **Create Neon Database**:
   - Provision a PostgreSQL database at [neon.tech](https://neon.tech).
   - Copy your Neon connection string (`postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).

2. **Configure PostgreSQL Schema**:
   - In `prisma/schema.prisma`, update the datasource provider to `postgresql`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
     *(Or copy `prisma/schema.postgresql.prisma` over `prisma/schema.prisma`).*

3. **Deploy to Vercel**:
   - Push your code to GitHub / GitLab.
   - Import the project into [Vercel](https://vercel.com).
   - Set environment variables in Vercel Project Settings:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string.
     - `AUTH_SECRET`: A secure 32+ character string (`openssl rand -base64 32`).
     - `NEXTAUTH_URL`: Your production domain (e.g., `https://yourdomain.com`).
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
     - `RESEND_API_KEY`.
     - `NEXT_PUBLIC_SITE_URL`: Your production domain.
   - In Build & Development settings, ensure the build command is:
     ```bash
     prisma generate && prisma db push && next build
     ```
   - Run the seed script once if starting fresh:
     ```bash
     node scripts/seed.mjs
     ```

---

## 📁 Clean Architecture Directory Structure

```
├── prisma/
│   ├── schema.prisma           # Prisma Schema (SQLite & Postgres compatible)
│   ├── schema.postgresql.prisma# Dedicated PostgreSQL schema for Neon / Vercel
│   └── dev.db                  # Local development SQLite database
├── scripts/
│   └── seed.mjs                # Comprehensive realistic seed dataset
├── src/
│   ├── actions/                # Next.js Server Actions with Auth & Zod validation
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── experiences.ts
│   │   ├── educations.ts
│   │   ├── certificates.ts
│   │   ├── achievements.ts
│   │   ├── blogs.ts
│   │   ├── media.ts
│   │   ├── messages.ts
│   │   ├── settings.ts
│   │   ├── social.ts
│   │   └── reorder.ts          # Generic drag-and-drop ordering persistence
│   ├── app/
│   │   ├── (public)/           # Public portfolio routes
│   │   │   ├── page.tsx        # Homepage (Hero, About, Skills, Experience, Projects...)
│   │   │   ├── projects/[slug] # Detailed architecture case study page
│   │   │   └── blog/           # Technical blog listing & [slug] reader
│   │   ├── admin/              # Private Admin CMS routes
│   │   │   ├── (auth)/login    # Secure admin authentication portal
│   │   │   └── (dashboard)/    # Management modules (Projects, Skills, Certs, etc.)
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth route handlers
│   │   │   └── upload/         # Secure Cloudinary file upload endpoint
│   │   ├── resume/route.ts     # Resume download / redirect handler
│   │   ├── sitemap.ts          # Dynamic XML Sitemap generator
│   │   └── robots.ts           # Dynamic Robots.txt generator
│   ├── components/
│   │   ├── admin/              # CMS interfaces (Sidebar, Header, RichText, ReorderableList)
│   │   ├── public/             # Public UI sections (Hero, About, Projects, Skills, Timeline)
│   │   ├── providers/          # ThemeProvider
│   │   └── ui/                 # Reusable Radix & Tailwind components
│   ├── lib/
│   │   ├── auth.ts             # Auth.js configuration & credentials handler
│   │   ├── db.ts               # Prisma singleton client
│   │   ├── cloudinary.ts       # File upload & deletion utility
│   │   ├── email.ts            # Resend email notifications
│   │   ├── utils.ts            # Utility functions (cn, slugify, formatDate)
│   │   └── validations/        # Zod schemas for all models
│   └── styles/
│       └── globals.css         # Design system tokens & typography
```
