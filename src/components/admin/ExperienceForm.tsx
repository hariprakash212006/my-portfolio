"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";
import { createExperienceAction, updateExperienceAction } from "@/actions/experiences";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface ExperienceFormProps {
  initialData?: (ExperienceInput & { id: string }) | null;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: initialData?.jobTitle || "",
      company: initialData?.company || "",
      companyLogo: initialData?.companyLogo || "",
      companyUrl: initialData?.companyUrl || "",
      location: initialData?.location || "San Francisco, CA",
      employmentType: initialData?.employmentType || "Full-time",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      isCurrent: initialData?.isCurrent ?? false,
      description: initialData?.description || "",
      responsibilities: initialData?.responsibilities || [],
      technologies: initialData?.technologies || [],
      isPublished: initialData?.isPublished ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
    },
  });

  const companyLogo = watch("companyLogo");
  const isCurrent = watch("isCurrent");
  const isPublished = watch("isPublished");
  const responsibilities = watch("responsibilities") || [];
  const technologies = watch("technologies") || [];

  const [respInput, setRespInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const addResponsibility = () => {
    if (!respInput.trim()) return;
    setValue("responsibilities", [...responsibilities, respInput.trim()]);
    setRespInput("");
  };

  const removeResponsibility = (idx: number) => {
    setValue(
      "responsibilities",
      responsibilities.filter((_, i) => i !== idx)
    );
  };

  const addTechnology = () => {
    if (!techInput.trim()) return;
    setValue("technologies", [...technologies, techInput.trim()]);
    setTechInput("");
  };

  const removeTechnology = (idx: number) => {
    setValue(
      "technologies",
      technologies.filter((_, i) => i !== idx)
    );
  };

  const onSubmit = (data: ExperienceInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateExperienceAction(initialData.id, data)
        : await createExperienceAction(data);

      if (res.success) {
        toast.success(isEditing ? "Experience updated" : "Experience added");
        router.push("/admin/experience");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save experience");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/experience">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.jobTitle}` : "Add Work Experience"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Define your role, company, responsibilities, and key impact
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="h-9">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Experience"
          ) : (
            "Save Experience"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Position Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Job Title</Label>
                  <Input {...register("jobTitle")} placeholder="e.g. Lead Software Engineer" />
                  {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Company Name</Label>
                  <Input {...register("company")} placeholder="e.g. Stratos Cloud Systems" />
                  {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input {...register("location")} placeholder="San Francisco, CA / Remote" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Employment Type</Label>
                  <Input {...register("employmentType")} placeholder="Full-time / Contract / Founder" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Company URL</Label>
                  <Input {...register("companyUrl")} placeholder="https://company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Start Date</Label>
                  <Input type="date" {...register("startDate")} />
                  {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">End Date</Label>
                  <Input type="date" {...register("endDate")} disabled={isCurrent} />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Switch
                  checked={isCurrent}
                  onCheckedChange={(val) => setValue("isCurrent", val)}
                />
                <Label className="text-xs font-medium">I currently work in this role</Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Role Overview Summary</Label>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="High-level mission and impact of this role..."
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Key Responsibilities & Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  placeholder="e.g. Reduced Core Web Vitals LCP by 48% via streaming SSR..."
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addResponsibility();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addResponsibility}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-2 pt-1">
                {responsibilities.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-2.5 rounded-lg border border-border bg-muted/20 text-xs"
                  >
                    <span>• {r}</span>
                    <button
                      type="button"
                      onClick={() => removeResponsibility(i)}
                      className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={companyLogo}
                onChange={(url) => setValue("companyLogo", url)}
                onRemove={() => setValue("companyLogo", "")}
                folder="portfolio/companies"
                label="Upload Logo"
              />
            </CardContent>
          </Card>

          {/* Tech tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Technologies Utilized</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. Next.js, Go..."
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTechnology}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {technologies.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 text-xs bg-muted px-2 py-0.5 rounded-md"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Published</Label>
                  <p className="text-[11px] text-muted-foreground">Show in Career Timeline</p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={(val) => setValue("isPublished", val)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
