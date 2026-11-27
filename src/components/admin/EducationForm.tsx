"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, type EducationInput } from "@/lib/validations";
import { createEducationAction, updateEducationAction } from "@/actions/educations";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EducationFormProps {
  initialData?: (EducationInput & { id: string }) | null;
}

export function EducationForm({ initialData }: EducationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: initialData?.institution || "",
      degree: initialData?.degree || "",
      fieldOfStudy: initialData?.fieldOfStudy || "",
      location: initialData?.location || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      isCurrent: initialData?.isCurrent ?? false,
      description: initialData?.description || "",
      institutionUrl: initialData?.institutionUrl || "",
      logo: initialData?.logo || "",
      isPublished: initialData?.isPublished ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
    },
  });

  const logo = watch("logo");
  const isCurrent = watch("isCurrent");
  const isPublished = watch("isPublished");

  const onSubmit = (data: EducationInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateEducationAction(initialData.id, data)
        : await createEducationAction(data);

      if (res.success) {
        toast.success(isEditing ? "Education updated" : "Education created");
        router.push("/admin/education");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save education");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/education">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.degree}` : "Add Education Record"}
            </h2>
            <p className="text-xs text-muted-foreground">Degree, university, field of study, and honors</p>
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="h-9">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Education"
          ) : (
            "Save Education"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Institution / University</Label>
                <Input {...register("institution")} placeholder="e.g. University of California, Berkeley" />
                {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Degree</Label>
                  <Input {...register("degree")} placeholder="Bachelor of Science / Master's / Certificate" />
                  {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Field of Study</Label>
                  <Input {...register("fieldOfStudy")} placeholder="Computer Science & Engineering" />
                  {errors.fieldOfStudy && <p className="text-xs text-destructive">{errors.fieldOfStudy.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input {...register("location")} placeholder="Berkeley, CA" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Institution Website URL</Label>
                  <Input {...register("institutionUrl")} placeholder="https://..." />
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
                <Label className="text-xs font-medium">Currently studying here</Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Description & Academic Honors</Label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Graduated Magna Cum Laude, research focus, student leadership..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Institution Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={logo}
                onChange={(url) => setValue("logo", url)}
                onRemove={() => setValue("logo", "")}
                folder="portfolio/education"
                label="Upload University Logo"
              />
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
                  <p className="text-[11px] text-muted-foreground">Visible on public portfolio</p>
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
