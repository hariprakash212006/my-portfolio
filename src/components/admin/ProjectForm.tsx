"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { createProjectAction, updateProjectAction } from "@/actions/projects";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface AvailableTech {
  id: string;
  name: string;
  slug: string;
}

interface ProjectFormProps {
  initialData?: (ProjectInput & { id: string }) | null;
  technologies: AvailableTech[];
}

export function ProjectForm({ initialData, technologies }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      fullDescription: initialData?.fullDescription || "",
      mainImage: initialData?.mainImage || "",
      gallery: initialData?.gallery || [],
      category: initialData?.category || "Full-Stack System",
      clientName: initialData?.clientName || "",
      githubUrl: initialData?.githubUrl || "",
      liveDemoUrl: initialData?.liveDemoUrl || "",
      challenges: initialData?.challenges || "",
      solutions: initialData?.solutions || "",
      results: initialData?.results || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      isFeatured: initialData?.isFeatured ?? false,
      isPublished: initialData?.isPublished ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
      technologyIds: initialData?.technologyIds || [],
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const mainImage = watch("mainImage");
  const gallery = watch("gallery") || [];
  const selectedTechIds = watch("technologyIds") || [];
  const isPublished = watch("isPublished");
  const isFeatured = watch("isFeatured");

  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!isEditing || !slug) {
      setValue("slug", slugify(newTitle));
    }
  };

  const toggleTechnology = (techId: string) => {
    if (selectedTechIds.includes(techId)) {
      setValue(
        "technologyIds",
        selectedTechIds.filter((id) => id !== techId)
      );
    } else {
      setValue("technologyIds", [...selectedTechIds, techId]);
    }
  };

  const addGalleryImage = (url: string) => {
    if (!url) return;
    setValue("gallery", [...gallery, url]);
    setGalleryUrlInput("");
  };

  const removeGalleryImage = (index: number) => {
    setValue(
      "gallery",
      gallery.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: ProjectInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateProjectAction(initialData.id, data)
        : await createProjectAction(data);

      if (res.success) {
        toast.success(isEditing ? "Project updated successfully" : "Project created successfully");
        router.push("/admin/projects");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save project");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/admin/projects">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.title}` : "Create New Project"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure project case study, tech stack, and showcase images
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing && (
            <Link href={`/projects/${slug}`} target="_blank">
              <Button type="button" variant="outline" size="sm" className="h-9">
                <Eye className="h-4 w-4 mr-1.5" />
                Live Preview
              </Button>
            </Link>
          )}
          <Button type="submit" disabled={isPending} className="h-9">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Project"
            ) : (
              "Publish Project"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Project Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Project Title</Label>
                <Input
                  {...register("title")}
                  onChange={handleTitleChange}
                  placeholder="e.g. PulseFlow Real-Time Telemetry Platform"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">URL Slug</Label>
                  <Input {...register("slug")} placeholder="pulseflow-telemetry-platform" />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Category</Label>
                  <Input {...register("category")} placeholder="Web App, Distributed System, Mobile App..." />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Short Description (Overview Cards)</Label>
                <Textarea
                  {...register("shortDescription")}
                  rows={2}
                  placeholder="A concise summary highlighting the problem and impact..."
                />
                {errors.shortDescription && (
                  <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Full Case Study & Architecture Breakdown</Label>
                <Textarea
                  {...register("fullDescription")}
                  rows={7}
                  placeholder="Detailed multi-paragraph breakdown of architecture, engineering decisions, and metrics..."
                />
                {errors.fullDescription && (
                  <p className="text-xs text-destructive">{errors.fullDescription.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Deep Dive Case Study Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Engineering Highlights (Challenges & Results)</CardTitle>
              <CardDescription className="text-xs">Provide concrete technical depth for hiring managers & engineers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Key Challenges Faced</Label>
                <Textarea
                  {...register("challenges")}
                  rows={2}
                  placeholder="What made this difficult? Concurrency, latency, scale, compliance..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Technical Solutions Engineered</Label>
                <Textarea
                  {...register("solutions")}
                  rows={2}
                  placeholder="What architecture or algorithms did you design to solve it?"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Measurable Results & Outcomes</Label>
                <Textarea
                  {...register("results")}
                  rows={2}
                  placeholder="Latency drops, cost reductions, throughput increases, active users..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Gallery Media */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Project Gallery Screenshots</CardTitle>
              <CardDescription className="text-xs">Additional screenshots and UI mockups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="Paste image URL or upload below..."
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addGalleryImage(galleryUrlInput)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add URL
                </Button>
              </div>

              <ImageUpload
                folder="portfolio/projects/gallery"
                label="Upload Gallery Screenshot"
                onChange={(url) => addGalleryImage(url)}
              />

              {gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg border border-border overflow-hidden group h-24 bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls (1 col) */}
        <div className="space-y-6">
          {/* Main Cover Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Cover Image</CardTitle>
              <CardDescription className="text-xs">Primary project showcase banner</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={mainImage}
                onChange={(url) => setValue("mainImage", url)}
                onRemove={() => setValue("mainImage", "")}
                folder="portfolio/projects"
                label="Upload Cover Image"
              />
              {errors.mainImage && (
                <p className="text-xs text-destructive mt-1.5">{errors.mainImage.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Visibility & Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Visibility & Placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Published</Label>
                  <p className="text-[11px] text-muted-foreground">Visible on public portfolio</p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={(val) => setValue("isPublished", val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Featured</Label>
                  <p className="text-[11px] text-muted-foreground">Highlighted in Hero / Top</p>
                </div>
                <Switch
                  checked={isFeatured}
                  onCheckedChange={(val) => setValue("isFeatured", val)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Client / Org (Optional)</Label>
                <Input {...register("clientName")} placeholder="e.g. CloudScale Systems" />
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">GitHub Repository</Label>
                <Input {...register("githubUrl")} placeholder="https://github.com/..." />
                {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Live Demo URL</Label>
                <Input {...register("liveDemoUrl")} placeholder="https://..." />
                {errors.liveDemoUrl && <p className="text-xs text-destructive">{errors.liveDemoUrl.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Relational Technologies Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Associated Technologies</CardTitle>
              <CardDescription className="text-xs">Select technologies used in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                {technologies.map((tech) => {
                  const isSelected = selectedTechIds.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTechnology(tech.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
