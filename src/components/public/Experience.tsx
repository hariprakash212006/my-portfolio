import React from "react";
import Image from "next/image";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string | null;
  companyUrl?: string | null;
  location?: string | null;
  employmentType: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string; // JSON string
  technologies: string; // JSON string
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 md:py-28 border-t border-border/60 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Career Journey
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Work Experience</h2>
          <p className="text-sm text-muted-foreground">
            A chronological timeline of roles, architectural leadership, and shipped systems
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-border/80 ml-4 sm:ml-32 space-y-12">
          {experiences.map((exp) => {
            const responsibilities: string[] = JSON.parse(exp.responsibilities || "[]");
            const technologies: string[] = JSON.parse(exp.technologies || "[]");

            return (
              <div key={exp.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform" />

                {/* Date on the left (on desktop) */}
                <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? (
                      <span className="text-emerald-500 font-semibold">Present</span>
                    ) : (
                      formatDate(exp.endDate)
                    )}
                  </span>
                </div>

                {/* Experience Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all space-y-4">
                  {/* Mobile Date Header */}
                  <div className="sm:hidden text-xs font-mono text-muted-foreground">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? (
                      <span className="text-emerald-500 font-semibold">Present</span>
                    ) : (
                      formatDate(exp.endDate)
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight">
                        {exp.jobTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline inline-flex items-center"
                          >
                            {exp.company}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="font-semibold text-foreground">{exp.company}</span>
                        )}
                        <span>·</span>
                        <span>{exp.employmentType}</span>
                        {exp.location && (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center">
                              <MapPin className="h-3 w-3 mr-0.5" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                    {exp.description}
                  </p>

                  {/* Bullet Responsibilities */}
                  {responsibilities.length > 0 && (
                    <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90 list-disc list-outside ml-4">
                      {responsibilities.map((r, i) => (
                        <li key={i} className="leading-relaxed">
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies Badges */}
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                      {technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
