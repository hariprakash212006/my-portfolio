"use client";

import React, { useState, useTransition } from "react";
import { FileText, Upload, Download, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { updateProfileAction } from "@/actions/profile";
import { type ProfileInput } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ResumeManagerProps {
  profile: (ProfileInput & { resumeUpdatedAt?: Date | null }) | null;
}

export function ResumeManager({ profile }: ResumeManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl || "");
  const [resumeName, setResumeName] = useState(
    profile?.resumeName || "Hariharan_Software_Engineer_Resume.pdf"
  );

  const handleSave = () => {
    if (!profile) return;
    startTransition(async () => {
      const res = await updateProfileAction({
        ...profile,
        resumeUrl,
        resumeName,
      });

      if (res.success) {
        toast.success("Resume updated successfully");
      } else {
        toast.error(res.error || "Failed to update resume");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Resume Management</h2>
        <p className="text-xs text-muted-foreground">
          Upload and replace your public developer CV / Resume (PDF format)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Upload New Resume</CardTitle>
            <CardDescription className="text-xs">
              Upload your latest resume PDF document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={resumeUrl}
              onChange={(url) => setResumeUrl(url)}
              onRemove={() => setResumeUrl("")}
              folder="portfolio/resumes"
              accept="application/pdf"
              label="Upload Resume PDF"
            />

            <div className="space-y-1">
              <Label className="text-xs font-medium">Download File Name</Label>
              <Input
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g. Hariharan_Senior_Software_Engineer_Resume.pdf"
                className="text-xs font-mono"
              />
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="w-full mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Publish Resume"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Live Resume Status</CardTitle>
            <CardDescription className="text-xs">
              This is the document served when visitors click &quot;Download Resume&quot;
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeUrl ? (
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-foreground truncate">{resumeName}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Updated {formatDate(profile?.resumeUpdatedAt || new Date())}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View Document
                    </Button>
                  </a>
                  <a href={resumeUrl} download={resumeName} className="flex-1">
                    <Button size="sm" className="w-full text-xs">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Test Download
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No resume PDF uploaded yet. Upload a PDF on the left.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
