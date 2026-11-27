"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, GraduationCap, FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { deleteEducationAction, toggleEducationPublishAction } from "@/actions/educations";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface EducationManagerProps {
  initialEducations: EducationItem[];
}

export function EducationManager({ initialEducations }: EducationManagerProps) {
  const [educations, setEducations] = useState<EducationItem[]>(initialEducations);
  const [itemToDelete, setItemToDelete] = useState<EducationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setEducations(educations.map((e) => (e.id === id ? { ...e, isPublished: next } : e)));
    const res = await toggleEducationPublishAction(id, next);
    if (!res.success) {
      toast.error("Failed to update status");
      setEducations(educations.map((e) => (e.id === id ? { ...e, isPublished: current } : e)));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteEducationAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Education deleted");
      setEducations(educations.filter((e) => e.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Education Background</h2>
          <p className="text-xs text-muted-foreground">Manage universities, degrees, and academic milestones</p>
        </div>
        <Link href="/admin/education/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Education
          </Button>
        </Link>
      </div>

      {educations.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No education records added yet.</p>
        </div>
      ) : (
        <ReorderableList
          entity="education"
          items={educations}
          onOrderChanged={(updated) => setEducations(updated)}
          renderItem={(edu) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">{edu.institution}</span>
                    <span>·</span>
                    <span>{edu.location}</span>
                    <span>·</span>
                    <span>
                      {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <Switch
                  checked={edu.isPublished}
                  onCheckedChange={() => handleTogglePublish(edu.id, edu.isPublished)}
                />
                <Link href={`/admin/education/${edu.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setItemToDelete(edu)}
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
        title="Delete Education Record?"
        description={`Are you sure you want to delete ${itemToDelete?.degree} from ${itemToDelete?.institution}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
