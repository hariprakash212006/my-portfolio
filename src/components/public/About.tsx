import React from "react";
import { MapPin, Briefcase, Calendar, Code2, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutProps {
  name: string;
  title: string;
  shortBio: string;
  fullBio: string;
  location?: string | null;
  yearsOfExperience: number;
  completedProjects: number;
  certificationsCount: number;
  technologiesCount: number;
}

export function About({
  name,
  title,
  shortBio,
  fullBio,
  location,
  yearsOfExperience,
  completedProjects,
  certificationsCount,
  technologiesCount,
}: AboutProps) {
  const stats = [
    { label: "Years Experience", value: `${yearsOfExperience}+`, icon: Calendar },
    { label: "Completed Projects", value: `${completedProjects}+`, icon: Code2 },
    { label: "Certifications", value: `${certificationsCount}+`, icon: Award },
    { label: "Technologies", value: `${technologiesCount}+`, icon: CheckCircle2 },
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-t border-border/60 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Background & Principles
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">About Me</h2>
          <p className="text-sm text-muted-foreground">{shortBio}</p>
        </div>

        {/* 2-Column: Bio & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Biography Text (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            {fullBio.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-foreground">
              {location && (
                <div className="flex items-center space-x-1.5 bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>{title}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-border bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-5 space-y-2 text-center sm:text-left">
                    <Icon className="h-5 w-5 text-primary mb-2 mx-auto sm:mx-0" />
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
