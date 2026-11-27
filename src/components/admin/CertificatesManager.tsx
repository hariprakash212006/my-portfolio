"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Award, FileEdit, Trash2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { deleteCertificateAction, toggleCertificatePublishAction } from "@/actions/certificates";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface CertificateItem {
  id: string;
  title: string;
  issuingOrg: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificatePdf?: string | null;
  issueDate: Date;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
}

interface CertificatesManagerProps {
  initialCertificates: CertificateItem[];
}

export function CertificatesManager({ initialCertificates }: CertificatesManagerProps) {
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [itemToDelete, setItemToDelete] = useState<CertificateItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePublish = async (id: string, current: boolean) => {
    const next = !current;
    setCertificates(certificates.map((c) => (c.id === id ? { ...c, isPublished: next } : c)));
    const res = await toggleCertificatePublishAction(id, next);
    if (!res.success) {
      toast.error("Failed to update status");
      setCertificates(certificates.map((c) => (c.id === id ? { ...c, isPublished: current } : c)));
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const res = await deleteCertificateAction(itemToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Certificate deleted");
      setCertificates(certificates.filter((c) => c.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Certifications & Credentials</h2>
          <p className="text-xs text-muted-foreground">
            Manage your professional licenses, badges, credential URLs, and PDFs
          </p>
        </div>
        <Link href="/admin/certificates/new">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Certificate
          </Button>
        </Link>
      </div>

      {certificates.length === 0 ? (
        <div className="py-16 text-center border rounded-xl border-dashed border-border p-8 bg-card/40">
          <p className="text-sm font-medium">No certificates registered yet.</p>
        </div>
      ) : (
        <ReorderableList
          entity="certificate"
          items={certificates}
          onOrderChanged={(updated) => setCertificates(updated)}
          renderItem={(cert) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-foreground">{cert.title}</h4>
                    {cert.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-1 py-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">{cert.issuingOrg}</span>
                    <span>·</span>
                    <span>Issued {formatDate(cert.issueDate)}</span>
                    {cert.credentialId && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-[11px]">{cert.credentialId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                {cert.credentialUrl && (
                  <Link href={cert.credentialUrl} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Verify Credential">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Switch
                  checked={cert.isPublished}
                  onCheckedChange={() => handleTogglePublish(cert.id, cert.isPublished)}
                />
                <Link href={`/admin/certificates/${cert.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setItemToDelete(cert)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Certificate?"
        description={`Are you sure you want to delete ${itemToDelete?.title}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
