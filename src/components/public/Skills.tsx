"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  proficiency: number;
  yearsOfExperience?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface SkillsProps {
  skills: SkillItem[];
}

export function Skills({ skills }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    ...Array.from(new Set(skills.map((s) => s.category))),
  ];

  const filteredSkills = skills.filter((s) =>
    selectedCategory === "ALL" ? true : s.category === selectedCategory
  );

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Technical Stack
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Skills & Proficiencies</h2>
          <p className="text-sm text-muted-foreground">
            Core technologies, libraries, databases, and architectural frameworks I work with
          </p>
        </div>

        {/* Category Pills */}
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
              {cat === "ALL" ? "All Stack" : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-4 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {skill.isFeatured && (
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-medium">
                    Core
                  </span>
                )}
              </div>

              {/* Minimalist proficiency indicator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{skill.yearsOfExperience ? `${skill.yearsOfExperience} yrs` : "Competent"}</span>
                  <span>{skill.proficiency}%</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/80 group-hover:bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
