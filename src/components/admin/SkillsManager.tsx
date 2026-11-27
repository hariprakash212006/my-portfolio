"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  FileEdit,
  Trash2,
  Cpu,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  toggleSkillPublishAction,
} from "@/actions/skills";
import { type SkillInput } from "@/lib/validations";
import { toast } from "sonner";

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

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

const CATEGORIES = [
  "ALL",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "CLOUD",
  "TOOLS",
  "LANGUAGES",
  "OTHER",
] as const;

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for modal
  const [formData, setFormData] = useState<SkillInput>({
    name: "",
    category: "FRONTEND",
    icon: "Code2",
    proficiency: 85,
    yearsOfExperience: 3,
    isFeatured: false,
    isPublished: true,
    displayOrder: 0,
  });

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: selectedCategory === "ALL" ? "FRONTEND" : (selectedCategory as SkillInput["category"]),
      icon: "Code2",
      proficiency: 85,
      yearsOfExperience: 3,
      isFeatured: false,
      isPublished: true,
      displayOrder: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category as SkillInput["category"],
      icon: skill.icon || "Code2",
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience || 0,
      isFeatured: skill.isFeatured,
      isPublished: skill.isPublished,
      displayOrder: skill.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    setIsSubmitting(true);
    const res = editingSkill
      ? await updateSkillAction(editingSkill.id, formData)
      : await createSkillAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(editingSkill ? "Skill updated" : "Skill created");
      if (editingSkill) {
        setSkills(skills.map((s) => (s.id === editingSkill.id ? (res.skill as SkillItem) : s)));
      } else {
        setSkills([...skills, res.skill as SkillItem]);
      }
      setModalOpen(false);
    } else {
      toast.error(res.error || "Failed to save skill");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setSkills(skills.map((s) => (s.id === id ? { ...s, isPublished: next } : s)));
    const res = await toggleSkillPublishAction(id, next);
    if (!res.success) {
      toast.error("Failed to update status");
      setSkills(skills.map((s) => (s.id === id ? { ...s, isPublished: current } : s)));
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setIsDeleting(true);
    const res = await deleteSkillAction(skillToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Skill deleted");
      setSkills(skills.filter((s) => s.id !== skillToDelete.id));
      setSkillToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === "ALL" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Technical Skills</h2>
          <p className="text-xs text-muted-foreground">
            Group technologies by category, configure proficiency, and reorder badges
          </p>
        </div>
        <Button size="sm" onClick={openAddModal} className="h-9">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Skill
        </Button>
      </div>

      {/* Filter and Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={selectedCategory === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-xs h-8 shrink-0"
              >
                {cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reorderable List */}
      {filteredSkills.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No skills found in this category</p>
          <Button size="sm" variant="outline" onClick={openAddModal} className="mt-3 text-xs">
            Add First Skill
          </Button>
        </div>
      ) : (
        <ReorderableList
          entity="skill"
          items={filteredSkills}
          onOrderChanged={(updated) => setSkills(updated)}
          renderItem={(skill) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-foreground">{skill.name}</h4>
                    {skill.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-1 py-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span className="text-[11px] font-mono">{skill.category}</span>
                    <span>·</span>
                    <span>{skill.proficiency}% Proficiency</span>
                    {skill.yearsOfExperience ? (
                      <>
                        <span>·</span>
                        <span>{skill.yearsOfExperience} yrs exp</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Progress visual bar & Actions */}
              <div className="flex items-center space-x-4 self-end sm:self-center">
                <div className="hidden md:flex items-center space-x-2 w-28">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {skill.proficiency}%
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <Switch
                    checked={skill.isPublished}
                    onCheckedChange={() => handleTogglePublish(skill.id, skill.isPublished)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openEditModal(skill)}
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setSkillToDelete(skill)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add Technical Skill"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Skill Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Next.js, Go, PostgreSQL, Kubernetes"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as SkillInput["category"] })
                  }
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm"
                >
                  {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Years Experience</Label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.yearsOfExperience ?? 3}
                  onChange={(e) =>
                    setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-medium">Proficiency ({formData.proficiency}%)</Label>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.proficiency}
                onChange={(e) =>
                  setFormData({ ...formData, proficiency: parseInt(e.target.value) })
                }
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })}
                />
                <Label className="text-xs font-medium">Featured (Highlighted)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(val) => setFormData({ ...formData, isPublished: val })}
                />
                <Label className="text-xs font-medium">Published</Label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingSkill ? (
                  "Update Skill"
                ) : (
                  "Create Skill"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!skillToDelete}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
        title="Delete Skill?"
        description={`Are you sure you want to delete "${skillToDelete?.name}"?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
