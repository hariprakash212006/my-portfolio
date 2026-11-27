"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, type CertificateInput } from "@/lib/validations";
import { createCertificateAction, updateCertificateAction } from "@/actions/certificates";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface CertificateFormProps {
  initialData?: (CertificateInput & { id: string }) | null;
}

export function CertificateForm({ initialData }: CertificateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: initialData?.title || "",
      issuingOrg: initialData?.issuingOrg || "",
      credentialId: initialData?.credentialId || "",
      credentialUrl: initialData?.credentialUrl || "",
      issueDate: initialData?.issueDate || "",
      expiryDate: initialData?.expiryDate || "",
      doesNotExpire: initialData?.doesNotExpire ?? true,
      certificateImage: initialData?.certificateImage || "",
      certificatePdf: initialData?.certificatePdf || "",
      description: initialData?.description || "",
      skills: initialData?.skills || [],
      isFeatured: initialData?.isFeatured ?? false,
      isPublished: initialData?.isPublished ?? true,
      displayOrder: initialData?.displayOrder ?? 0,
    },
  });

  const certificateImage = watch("certificateImage");
  const certificatePdf = watch("certificatePdf");
  const doesNotExpire = watch("doesNotExpire");
  const isFeatured = watch("isFeatured");
  const isPublished = watch("isPublished");
  const skills = watch("skills") || [];

  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setValue("skills", [...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (idx: number) => {
    setValue(
      "skills",
      skills.filter((_, i) => i !== idx)
    );
  };

  const onSubmit = (data: CertificateInput) => {
    startTransition(async () => {
      const res = isEditing
        ? await updateCertificateAction(initialData.id, data)
        : await createCertificateAction(data);

      if (res.success) {
        toast.success(isEditing ? "Certificate updated" : "Certificate added");
        router.push("/admin/certificates");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save certificate");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/certificates">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData.title}` : "Add Certification"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Official credential ID, verification URL, certificate badge & PDF
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
            "Update Certificate"
          ) : (
            "Publish Certificate"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Credential Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Certificate Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. AWS Certified Solutions Architect - Professional"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Issuing Organization</Label>
                  <Input {...register("issuingOrg")} placeholder="Amazon Web Services / CNCF / Meta" />
                  {errors.issuingOrg && <p className="text-xs text-destructive">{errors.issuingOrg.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Credential ID</Label>
                  <Input {...register("credentialId")} placeholder="AWS-PSA-99381204" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Verification URL</Label>
                <Input {...register("credentialUrl")} placeholder="https://aws.amazon.com/verification" />
                {errors.credentialUrl && (
                  <p className="text-xs text-destructive">{errors.credentialUrl.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Issue Date</Label>
                  <Input type="date" {...register("issueDate")} />
                  {errors.issueDate && <p className="text-xs text-destructive">{errors.issueDate.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Expiration Date</Label>
                  <Input type="date" {...register("expiryDate")} disabled={doesNotExpire} />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Switch
                  checked={doesNotExpire}
                  onCheckedChange={(val) => setValue("doesNotExpire", val)}
                />
                <Label className="text-xs font-medium">This credential does not expire</Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Demonstrated technical competencies and architectural mastery..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Related Skills Covered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. AWS, High Availability, Kubernetes..."
                  className="text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1 text-xs bg-muted px-2.5 py-1 rounded-lg"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Certificate Badge / Image</CardTitle>
              <CardDescription className="text-xs">Digital badge or certificate photo</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={certificateImage}
                onChange={(url) => setValue("certificateImage", url)}
                onRemove={() => setValue("certificateImage", "")}
                folder="portfolio/certificates"
                label="Upload Certificate Image"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Certificate PDF</CardTitle>
              <CardDescription className="text-xs">Official PDF document for public download/view</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={certificatePdf}
                onChange={(url) => setValue("certificatePdf", url)}
                onRemove={() => setValue("certificatePdf", "")}
                folder="portfolio/certificates/pdf"
                accept="application/pdf"
                label="Upload Certificate PDF"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Visibility & Placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Published</Label>
                  <p className="text-[11px] text-muted-foreground">Show in Certifications section</p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={(val) => setValue("isPublished", val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">Featured</Label>
                  <p className="text-[11px] text-muted-foreground">Highlighted at top of section</p>
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
