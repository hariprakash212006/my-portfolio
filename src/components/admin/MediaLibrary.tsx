"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Search,
  Copy,
  Trash2,
  Check,
  FileText,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteMediaAction } from "@/actions/media";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
  format?: string | null;
  folder?: string | null;
  createdAt: Date;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteMediaAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("File deleted");
      setMediaList(mediaList.filter((m) => m.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete file");
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Media Library</h2>
          <p className="text-xs text-muted-foreground">
            Centralized file and asset storage for projects, certificates, and profile photos
          </p>
        </div>
      </div>

      {/* Uploader Card */}
      <div className="bg-card p-6 rounded-2xl border border-border">
        <h3 className="text-sm font-semibold mb-3">Upload Asset to Cloudinary</h3>
        <ImageUpload
          label="Upload Project Asset, PDF, or Photo"
          folder="portfolio/media"
          onChange={() => {
            // refresh page to load the new media row
            window.location.reload();
          }}
        />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search media files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Grid of Files */}
      {filteredMedia.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No media assets found</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a photo or document above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((m) => {
            const isDoc = m.fileType === "DOCUMENT" || m.url.toLowerCase().endsWith(".pdf");
            return (
              <div
                key={m.id}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-40 w-full bg-muted flex items-center justify-center overflow-hidden border-b border-border">
                  {isDoc ? (
                    <div className="flex flex-col items-center space-y-1 text-red-500">
                      <FileText className="h-10 w-10" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">PDF Document</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.url}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground truncate" title={m.name}>
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {(m.fileSize / 1024).toFixed(1)} KB · {formatDate(m.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => copyUrl(m.url, m.id)}
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" /> Copy Link
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setItemToDelete(m)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Media File?"
        description={`Are you sure you want to delete ${itemToDelete?.name}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
