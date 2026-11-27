import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Profile
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Professional title is required"),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
  fullBio: z.string().min(20, "Full bio must be at least 20 characters"),
  avatarUrl: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  availability: z.string().default("Available for hire"),
  yearsOfExperience: z.coerce.number().min(0),
  completedProjects: z.coerce.number().min(0),
  certificationsCount: z.coerce.number().min(0).optional(),
  technologiesCount: z.coerce.number().min(0).optional(),
  resumeUrl: z.string().optional().nullable(),
  resumeName: z.string().optional().nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// Project
export const projectSchema = z.object({
  title: z.string().min(2, "Project title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters"),
  mainImage: z.string().min(1, "Main project image is required"),
  gallery: z.array(z.string()).default([]),
  category: z.string().default("Web Application"),
  clientName: z.string().optional().nullable(),
  githubUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  liveDemoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  challenges: z.string().optional().nullable(),
  solutions: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
  technologyIds: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Skill
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.enum([
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "DEVOPS",
    "CLOUD",
    "MOBILE",
    "TOOLS",
    "LANGUAGES",
    "OTHER",
  ]),
  icon: z.string().optional().nullable(),
  proficiency: z.coerce.number().min(1).max(100).default(80),
  yearsOfExperience: z.coerce.number().min(0).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;

// Experience
export const experienceSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  companyLogo: z.string().optional().nullable(),
  companyUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  location: z.string().optional().nullable(),
  employmentType: z.string().default("Full-time"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

// Education
export const educationSchema = z.object({
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().min(2, "Degree is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
  institutionUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  logo: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;

// Certificate
export const certificateSchema = z.object({
  title: z.string().min(2, "Certificate title is required"),
  issuingOrg: z.string().min(2, "Issuing organization is required"),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional().nullable(),
  doesNotExpire: z.boolean().default(true),
  certificateImage: z.string().optional().nullable(),
  certificatePdf: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  skills: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type CertificateInput = z.infer<typeof certificateSchema>;

// Achievement
export const achievementSchema = z.object({
  title: z.string().min(2, "Achievement title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  organization: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  url: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type AchievementInput = z.infer<typeof achievementSchema>;

// Blog Post
export const blogPostSchema = z.object({
  title: z.string().min(2, "Post title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  coverImage: z.string().optional().nullable(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  author: z.string().default("Portfolio Owner"),
  tags: z.array(z.string()).default([]),
  publishedDate: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// Contact Message
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// Social Link
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Please provide a valid URL"),
  icon: z.string().optional().nullable(),
  isEnabled: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

// Site Settings
export const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  siteDescription: z.string().min(5, "Site description is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Invalid email"),
  location: z.string().default("San Francisco, CA"),
  timezone: z.string().default("UTC"),
  heroGreeting: z.string().default("Hello, I'm"),
  heroTitle: z.string().min(2, "Hero title is required"),
  heroSubtitle: z.string().min(5, "Hero subtitle is required"),
  primaryCtaText: z.string().default("View My Work"),
  primaryCtaUrl: z.string().default("#projects"),
  secondaryCtaText: z.string().default("Download Resume"),
  secondaryCtaUrl: z.string().default("/resume"),
  primaryColor: z.string().default("emerald"),
  appearanceMode: z.string().default("system"),
  navSections: z.record(z.boolean()).default({
    about: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    achievements: true,
    blog: true,
    contact: true,
  }),
  enableBlog: z.boolean().default(true),
  enableContactForm: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
