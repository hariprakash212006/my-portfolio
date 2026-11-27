import React from "react";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Skills } from "@/components/public/Skills";
import { Experience } from "@/components/public/Experience";
import { Education } from "@/components/public/Education";
import { Projects } from "@/components/public/Projects";
import { Certifications } from "@/components/public/Certifications";
import { Achievements } from "@/components/public/Achievements";
import { BlogPreview } from "@/components/public/BlogPreview";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";

export const revalidate = 60;

export default async function HomePage() {
  // Parallel retrieval of all published database content
  const [
    profile,
    settings,
    socialLinks,
    skills,
    experiences,
    educations,
    projects,
    certificates,
    achievements,
    blogPosts,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      where: { isEnabled: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.skill.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.experience.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.education.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
      include: {
        technologies: {
          include: {
            technology: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    }),
    prisma.certificate.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.achievement.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedDate: "desc" },
      take: 4,
      include: {
        tags: {
          include: {
            tag: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const navSections: Record<string, boolean> = settings?.navSections
    ? JSON.parse(settings.navSections)
    : {};

  const siteName = settings?.siteName || profile?.name || "Hariharan Portfolio";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Sticky Navigation */}
      <Navbar
        siteName={siteName}
        navSections={navSections}
        resumeUrl={profile?.resumeUrl}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          greeting={settings?.heroGreeting || "Hello, I'm"}
          name={profile?.name || settings?.ownerName || "Hariharan"}
          title={settings?.heroTitle || profile?.title || "Senior Full-Stack Engineer"}
          subtitle={
            settings?.heroSubtitle ||
            profile?.shortBio ||
            "Building scalable, elegant, and user-focused digital experiences."
          }
          primaryCtaText={settings?.primaryCtaText || "View My Work"}
          primaryCtaUrl={settings?.primaryCtaUrl || "#projects"}
          secondaryCtaText={settings?.secondaryCtaText || "Download Resume"}
          secondaryCtaUrl={settings?.secondaryCtaUrl || "/resume"}
          avatarUrl={profile?.avatarUrl}
          socialLinks={socialLinks}
          availability={profile?.availability}
        />

        {/* 2. About Section */}
        {(navSections.about ?? true) && profile && (
          <About
            name={profile.name}
            title={profile.title}
            shortBio={profile.shortBio}
            fullBio={profile.fullBio}
            location={profile.location}
            yearsOfExperience={profile.yearsOfExperience}
            completedProjects={profile.completedProjects}
            certificationsCount={profile.certificationsCount}
            technologiesCount={profile.technologiesCount}
          />
        )}

        {/* 3. Skills Section */}
        {(navSections.skills ?? true) && skills.length > 0 && (
          <Skills skills={skills} />
        )}

        {/* 4. Experience Section */}
        {(navSections.experience ?? true) && experiences.length > 0 && (
          <Experience experiences={experiences} />
        )}

        {/* 5. Projects Showcase */}
        {(navSections.projects ?? true) && projects.length > 0 && (
          <Projects projects={projects} />
        )}

        {/* 6. Certifications Section */}
        {(navSections.certifications ?? true) && certificates.length > 0 && (
          <Certifications certificates={certificates} />
        )}

        {/* 7. Education Section */}
        {(navSections.education ?? true) && educations.length > 0 && (
          <Education educations={educations} />
        )}

        {/* 8. Achievements Section */}
        {(navSections.achievements ?? true) && achievements.length > 0 && (
          <Achievements achievements={achievements} />
        )}

        {/* 9. Blog Articles Preview */}
        {(navSections.blog ?? true) && (settings?.enableBlog ?? true) && blogPosts.length > 0 && (
          <BlogPreview posts={blogPosts} />
        )}

        {/* 10. Contact Section */}
        {(navSections.contact ?? true) && (settings?.enableContactForm ?? true) && (
          <Contact
            ownerEmail={settings?.ownerEmail || profile?.email}
            location={settings?.location || profile?.location}
            availability={profile?.availability}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        name={profile?.name || settings?.ownerName || "Hariharan"}
        tagline={
          settings?.siteDescription ||
          "Architecting scalable systems & user-focused digital experiences"
        }
        location={settings?.location || profile?.location}
        socialLinks={socialLinks}
      />
    </div>
  );
}
