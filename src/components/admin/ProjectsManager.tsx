"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  ExternalLink,
  FileEdit,
  Trash2,
  CheckCircle2,
  Eye,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { toggleProjectPublishAction, deleteProjectAction } from "@/actions/projects";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  mainImage: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  updatedAt: Date;
  technologies: {
    technology: {
      name: string;
    };
  }[];
}

interface ProjectsManagerProps {
  initialProjects: ProjectItem[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.technology.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === "PUBLISHED") return p.isPublished;
    if (filterStatus === "DRAFT") return !p.isPublished;
    return true;
  });

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setProjects(projects.map((p) => (p.id === id ? { ...p, isPublished: next } : p)));
    const res = await toggleProjectPublishAction(id, next);
    if (res.success) {
      toast.success(`Project ${next ? "published" : "unpublished"}`);
    } else {
      toast.error(res.error || "Failed to update publish state");
      setProjects(projects.map((p) => (p.id === id ? { ...p, isPublished: current } : p)));
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const res = await deleteProjectAction(projectToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Project deleted successfully");
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Projects Showcase</h2>
          <p className="text-xs text-muted-foreground">
            Manage your case studies, reorder presentation, and publish updates
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((status) => (
            <Button
              key={status}
              type="button"
              variant={filterStatus === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="text-xs h-8"
            >
              {status === "ALL" ? "All" : status === "PUBLISHED" ? "Published" : "Drafts"}
            </Button>
          ))}
        </div>
      </div>

      {/* Reorderable List / Table */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery ? "Try clearing search filters." : "Create your first project case study."}
          </p>
        </div>
      ) : (
        <ReorderableList
          entity="project"
          items={filteredProjects}
          onOrderChanged={(updated) => setProjects(updated)}
          renderItem={(project) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold truncate text-foreground">
                      {project.title}
                    </h4>
                    {project.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0 shrink-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-muted-foreground">{project.category}</span>
                    <span className="text-muted-foreground text-[10px]">·</span>
                    <span className="text-[11px] text-muted-foreground">
                      Updated {formatDate(project.updatedAt)}
                    </span>
                    {project.technologies.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground"
                      >
                        {t.technology.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <div className="flex items-center space-x-2 mr-2">
                  <span className="text-[11px] text-muted-foreground">
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                  <Switch
                    checked={project.isPublished}
                    onCheckedChange={() => handleTogglePublish(project.id, project.isPublished)}
                  />
                </div>

                <Link href={`/projects/${project.slug}`} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Live Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Edit Project"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setProjectToDelete(project)}
                  title="Delete Project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        title="Delete Project?"
        description={`Are you sure you want to delete "${projectToDelete?.title}"? This action permanently removes the project and its case study from your database.`}
        confirmLabel="Delete Project"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
