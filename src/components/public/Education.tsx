import React from "react";
import { GraduationCap, Calendar, MapPin, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  institutionUrl?: string | null;
  logo?: string | null;
}

interface EducationProps {
  educations: EducationItem[];
}

export function Education({ educations }: EducationProps) {
  return (
    <section id="education" className="py-20 md:py-28 border-t border-border/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Academic Background
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Education</h2>
          <p className="text-sm text-muted-foreground">
            Degrees, computer science foundations, and specialized advanced certifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mt-0.5">
                      {edu.institutionUrl ? (
                        <a
                          href={edu.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:underline inline-flex items-center"
                        >
                          {edu.institution}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="font-semibold text-foreground">{edu.institution}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                  </span>
                  {edu.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {edu.location}
                      </span>
                    </>
                  )}
                </div>

                {edu.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
