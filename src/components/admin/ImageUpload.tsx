"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "portfolio",
  accept = "image/*,application/pdf",
  label = "Upload Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max limit is 10MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.media.url);
      toast.success("File uploaded successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isPdf = value?.toLowerCase().endsWith(".pdf") || value?.includes("/pdf");

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group rounded-xl border border-border overflow-hidden bg-muted/40 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            {isPdf ? (
              <div className="h-16 w-16 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs uppercase border border-red-500/20">
                PDF
              </div>
            ) : (
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={value}
                  alt="Uploaded preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono text-muted-foreground truncate">{value}</p>
              <p className="text-xs text-emerald-500 font-medium">Ready</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 pl-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Change
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={isUploading}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click or drag and drop (PNG, JPG, WEBP, PDF up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
