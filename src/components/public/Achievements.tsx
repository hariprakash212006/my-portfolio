import React from "react";
import { Trophy, Calendar, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  organization?: string | null;
  image?: string | null;
  url?: string | null;
  isFeatured: boolean;
}

interface AchievementsProps {
  achievements: AchievementItem[];
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <section id="achievements" className="py-20 md:py-28 border-t border-border/60 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Honors & Milestones
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Achievements & Recognition</h2>
          <p className="text-sm text-muted-foreground">
            Hackathon victories, published engineering articles, and open-source leadership awards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Trophy className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground tracking-tight">{ach.title}</h3>
                  {ach.organization && (
                    <p className="text-xs font-semibold text-primary mt-0.5">{ach.organization}</p>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground space-x-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(ach.date)}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
              </div>

              {ach.url && (
                <div className="pt-3 border-t border-border">
                  <a
                    href={ach.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center"
                  >
                    View Announcement / Publication
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
