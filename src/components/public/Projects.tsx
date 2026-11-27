"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  mainImage: string;
  category: string;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  isFeatured: boolean;
  technologies: {
    technology: {
      name: string;
      slug: string;
    };
  }[];
}

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered = projects.filter((p) =>
    selectedCategory === "ALL" ? true : p.category === selectedCategory
  );

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Engineering Showcase
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Featured Projects</h2>
          <p className="text-sm text-muted-foreground">
            Production applications, distributed systems, and open-source tools with deep case studies
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs rounded-xl h-8 px-3"
            >
              {cat === "ALL" ? "All Projects" : cat}
            </Button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Showcase */}
                <Link href={`/projects/${project.slug}`} className="block relative h-56 sm:h-64 w-full overflow-hidden bg-muted">
                  <Image
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
                    <span className="text-[10px] uppercase font-mono font-bold bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border text-foreground">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                        Featured
                      </Badge>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <Link href={`/projects/${project.slug}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal">
                    {project.shortDescription}
                  </p>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                      >
                        {t.technology.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between text-xs font-medium">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-primary hover:underline font-semibold flex items-center"
                >
                  Read Architecture Case Study
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>

                <div className="flex items-center space-x-1">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
