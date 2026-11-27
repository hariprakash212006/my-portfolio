"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trophy, FileEdit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { deleteAchievementAction, toggleAchievementPublishAction } from "@/actions/achievements";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface AchievementItem {
  id: string;
  title: string;
  organization?: string | null;
  date: Date;
  url?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface AchievementsManagerProps {
  initialAchievements: AchievementItem[];
}

export function AchievementsManager({ initialAchievements }: AchievementsManagerProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [itemToDelete, setItemToDelete] = useState<AchievementItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setAchievements(achievements.map((a) => (a.id === id ? { ...a, isPublished: next } : a)));
    const res = await toggleAchievementPublishAction(id, next);
    if (!res.success) {
      toast.error("Failed to update status");
      setAchievements(achievements.map((a) => (a.id === id ? { ...a, isPublished: current } : a)));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteAchievementAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Achievement deleted");
      setAchievements(achievements.filter((a) => a.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Achievements & Recognition</h2>
          <p className="text-xs text-muted-foreground">Competitions, hackathons, awards, and milestones</p>
        </div>
        <Link href="/admin/achievements/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Achievement
          </Button>
        </Link>
      </div>

      {achievements.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No achievements added yet.</p>
        </div>
      ) : (
        <ReorderableList
          entity="achievement"
          items={achievements}
          onOrderChanged={(updated) => setAchievements(updated)}
          renderItem={(ach) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-foreground">{ach.title}</h4>
                    {ach.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-1 py-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    {ach.organization && <span className="font-medium text-foreground">{ach.organization}</span>}
                    {ach.organization && <span>·</span>}
                    <span>{formatDate(ach.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                {ach.url && (
                  <Link href={ach.url} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="View Source">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Switch
                  checked={ach.isPublished}
                  onCheckedChange={() => handleTogglePublish(ach.id, ach.isPublished)}
                />
                <Link href={`/admin/achievements/${ach.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setItemToDelete(ach)}
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
        title="Delete Achievement?"
        description={`Are you sure you want to delete "${itemToDelete?.title}"?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
