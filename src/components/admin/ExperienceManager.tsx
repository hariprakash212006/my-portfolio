"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { deleteExperienceAction, toggleExperiencePublishAction } from "@/actions/experiences";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface ExperienceManagerProps {
  initialExperiences: ExperienceItem[];
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [itemToDelete, setItemToDelete] = useState<ExperienceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, isPublished: next } : e)));
    const res = await toggleExperiencePublishAction(id, next);
    if (!res.success) {
      toast.error("Failed to update status");
      setExperiences(experiences.map((e) => (e.id === id ? { ...e, isPublished: current } : e)));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteExperienceAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Experience deleted");
      setExperiences(experiences.filter((e) => e.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-xs text-muted-foreground">
            Manage your career progression, timeline order, and leadership roles
          </p>
        </div>
        <Link href="/admin/experience/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Experience
          </Button>
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No experience entries recorded yet.</p>
        </div>
      ) : (
        <ReorderableList
          entity="experience"
          items={experiences}
          onOrderChanged={(updated) => setExperiences(updated)}
          renderItem={(exp) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{exp.jobTitle}</h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">{exp.company}</span>
                    <span>·</span>
                    <span>{exp.location}</span>
                    <span>·</span>
                    <span>
                      {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <Switch
                  checked={exp.isPublished}
                  onCheckedChange={() => handleTogglePublish(exp.id, exp.isPublished)}
                />
                <Link href={`/admin/experience/${exp.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setItemToDelete(exp)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Experience Entry?"
        description={`Are you sure you want to delete ${itemToDelete?.jobTitle} at ${itemToDelete?.company}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
