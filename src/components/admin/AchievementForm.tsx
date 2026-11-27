"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { achievementSchema, type AchievementInput } from "@/lib/validations";
import { createAchievementAction, updateAchievementAction } from "@/actions/achievements";
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

interface AchievementFormProps {
  initialData?: (AchievementInput & { id: string }) | null;
}

export function AchievementForm({ initialData }: AchievementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AchievementInput>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      organization: initialData?.organization || "",
      image: initialData?.image || "",
      url: initialData?.url || "",
      isFeatured: initialData?.isFeatured ?? false,
      isPublished: initialData?.isPublished ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
    },
  });

  const image = watch("image");
  const isFeatured = watch("isFeatured");
  const isPublished = watch("isPublished");

  const onSubmit = (data: AchievementInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateAchievementAction(initialData.id, data)
        : await createAchievementAction(data);

      if (res.success) {
        toast.success(isEditing ? "Achievement updated" : "Achievement created");
        router.push("/admin/achievements");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save achievement");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/achievements">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.title}` : "Add Achievement / Award"}
            </h2>
            <p className="text-xs text-muted-foreground">Competitions, hackathons, publications, and honors</p>
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="h-9">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Achievement"
          ) : (
            "Publish Achievement"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Award / Milestone Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Achievement Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. 1st Place Winner - Global Cloud Architecture Hackathon"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Organization / Event</Label>
                  <Input {...register("organization")} placeholder="Cloud Native Global Summit" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Date Received</Label>
                  <Input type="date" {...register("date")} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">URL Link (Optional)</Label>
                <Input {...register("url")} placeholder="https://..." />
                {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Led a 4-person team to architect an autonomous self-healing autoscaler..."
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Achievement Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={image}
                onChange={(url) => setValue("image", url)}
                onRemove={() => setValue("image", "")}
                folder="portfolio/achievements"
                label="Upload Image"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Published</Label>
                  <p className="text-[11px] text-muted-foreground">Show in Achievements section</p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={(val) => setValue("isPublished", val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Featured</Label>
                  <p className="text-[11px] text-muted-foreground">Highlight on homepage</p>
                </div>
                <Switch
                  checked={isFeatured}
                  onCheckedChange={(val) => setValue("isFeatured", val)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
