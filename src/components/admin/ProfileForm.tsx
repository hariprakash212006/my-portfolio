"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { updateProfileAction } from "@/actions/profile";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface ProfileFormProps {
  initialData?: ProfileInput & { id?: string } | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      title: initialData?.title || "",
      shortBio: initialData?.shortBio || "",
      fullBio: initialData?.fullBio || "",
      avatarUrl: initialData?.avatarUrl || "",
      location: initialData?.location || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      availability: initialData?.availability || "Available for hire",
      yearsOfExperience: initialData?.yearsOfExperience ?? 5,
      completedProjects: initialData?.completedProjects ?? 20,
      certificationsCount: initialData?.certificationsCount ?? 10,
      technologiesCount: initialData?.technologiesCount ?? 30,
      resumeUrl: initialData?.resumeUrl || "",
      resumeName: initialData?.resumeName || "",
    },
  });

  const avatarUrl = watch("avatarUrl");
  const resumeUrl = watch("resumeUrl");

  const onSubmit = (data: ProfileInput) => {
    startTransition(async () => {
      const res = await updateProfileAction(data);
      if (res.success) {
        toast.success("Profile saved successfully");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Profile & Biography</h2>
          <p className="text-xs text-muted-foreground">Manage your identity, professional intro, and experience metrics</p>
        </div>
        <Button type="submit" disabled={isPending} className="h-9">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Profile Photo</CardTitle>
              <CardDescription className="text-xs">Your personal brand headshot</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={avatarUrl}
                onChange={(url) => setValue("avatarUrl", url)}
                onRemove={() => setValue("avatarUrl", "")}
                folder="portfolio/profile"
                label="Upload Headshot"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Career Metrics</CardTitle>
              <CardDescription className="text-xs">Highlight numbers shown in the About section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Years of Experience</Label>
                <Input
                  type="number"
                  {...register("yearsOfExperience", { valueAsNumber: true })}
                />
                {errors.yearsOfExperience && (
                  <p className="text-xs text-destructive">{errors.yearsOfExperience.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Completed Projects</Label>
                <Input
                  type="number"
                  {...register("completedProjects", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Certifications Count</Label>
                <Input
                  type="number"
                  {...register("certificationsCount", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Technologies Count</Label>
                <Input
                  type="number"
                  {...register("technologiesCount", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bio & Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">General Information</CardTitle>
              <CardDescription className="text-xs">Basic developer bio & credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Full Name</Label>
                  <Input {...register("name")} placeholder="John Doe" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Professional Title</Label>
                  <Input {...register("title")} placeholder="Senior Full-Stack Engineer" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input {...register("location")} placeholder="San Francisco, CA" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Availability Status</Label>
                  <Input {...register("availability")} placeholder="Available for hire / Open to roles" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Public Email</Label>
                  <Input type="email" {...register("email")} placeholder="contact@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Phone Number (Optional)</Label>
                  <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Short Bio (Hero & Meta)</Label>
                <Textarea
                  {...register("shortBio")}
                  rows={2}
                  placeholder="A concise 2-sentence summary of your technical focus..."
                />
                {errors.shortBio && <p className="text-xs text-destructive">{errors.shortBio.message}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Full Biography (About Section)</Label>
                <Textarea
                  {...register("fullBio")}
                  rows={6}
                  placeholder="Detailed multi-paragraph breakdown of your engineering journey, architectural principles, and accomplishments..."
                />
                {errors.fullBio && <p className="text-xs text-destructive">{errors.fullBio.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
