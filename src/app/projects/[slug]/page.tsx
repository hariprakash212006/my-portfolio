import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

interface ProjectDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { slug } = await params;

  const [project, profile, settings, socialLinks] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: {
          include: { technology: true },
        },
      },
    }),
    prisma.profile.findFirst(),
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      where: { isEnabled: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  if (!project || !project.isPublished) {
    notFound();
  }

  // Parse gallery images JSON
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(project.gallery || "[]");
  } catch {
    gallery = [];
  }

  // Fetch related projects in the same category
  const relatedProjects = await prisma.project.findMany({
    where: {
      category: project.category,
      isPublished: true,
      NOT: { id: project.id },
    },
    take: 2,
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        siteName={settings?.siteName || profile?.name || "Portfolio"}
        resumeUrl={profile?.resumeUrl || null}
      />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Back Button */}
          <Link
            href="/#projects"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to All Projects
          </Link>

          {/* Project Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-xs uppercase font-mono">
                {project.category}
              </Badge>
              {project.clientName && (
                <Badge variant="outline" className="text-xs">
                  Client: {project.clientName}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-xl">
                    <ExternalLink className="h-4 w-4 mr-2" /> Live Application
                  </Button>
                </a>
              )}

              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Github className="h-4 w-4 mr-2" /> GitHub Repository
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Main Hero Image */}
          <div className="relative h-72 sm:h-96 md:h-[460px] w-full rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted">
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
          </div>

          {/* Tech Stack Badges */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary font-semibold flex items-center">
              <Layers className="h-3.5 w-3.5 mr-1.5" /> Core Technologies & Architecture
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t.technology.id}
                  className="text-xs font-mono bg-muted/80 text-foreground border border-border px-3 py-1 rounded-lg"
                >
                  {t.technology.name}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Content / Case Study Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Narrative (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Full Description / Overview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Project Overview</h3>
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                />
              </div>

              {/* Challenges / Problem statement */}
              {project.challenges && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <h3 className="text-base font-bold text-foreground flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-destructive" /> Technical Challenges
                  </h3>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.challenges }}
                  />
                </div>
              )}

              {/* Solutions / Engineering decisions */}
              {project.solutions && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <h3 className="text-base font-bold text-foreground flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-amber-500" /> Engineering Decisions & Solutions
                  </h3>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.solutions }}
                  />
                </div>
              )}

              {/* Results / Business Impact */}
              {project.results && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <h3 className="text-base font-bold text-foreground flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-primary" /> Results & Measurable Impact
                  </h3>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.results }}
                  />
                </div>
              )}

              {/* Gallery Images */}
              {gallery.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold tracking-tight">Screenshots & Architecture Diagrams</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-border bg-muted"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${project.title} screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Metadata (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Metadata
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Timeline:</span>
                    <span className="font-medium text-foreground">
                      {formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : "Present"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Category:</span>
                    <span className="font-medium text-foreground">{project.category}</span>
                  </div>

                  {project.clientName && (
                    <div>
                      <span className="text-muted-foreground block">Client:</span>
                      <span className="font-medium text-foreground">{project.clientName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    Related Projects
                  </h4>

                  <div className="space-y-3">
                    {relatedProjects.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/projects/${rel.slug}`}
                        className="block p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-muted/30 hover:bg-muted/60 transition-all text-xs"
                      >
                        <div className="font-semibold text-foreground">{rel.title}</div>
                        <div className="text-muted-foreground text-[11px] line-clamp-1 mt-0.5">
                          {rel.shortDescription}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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