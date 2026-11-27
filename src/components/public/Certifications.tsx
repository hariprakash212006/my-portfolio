"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, ExternalLink, FileDown, Eye, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface CertificateItem {
  id: string;
  title: string;
  issuingOrg: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  issueDate: Date;
  expiryDate?: Date | null;
  doesNotExpire: boolean;
  certificateImage?: string | null;
  certificatePdf?: string | null;
  description?: string | null;
  skills: string; // JSON string
  isFeatured: boolean;
}

interface CertificationsProps {
  certificates: CertificateItem[];
}

export function Certifications({ certificates }: CertificationsProps) {
  const [activeCertModal, setActiveCertModal] = useState<CertificateItem | null>(null);

  return (
    <section id="certifications" className="py-20 md:py-28 border-t border-border/60 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Validated Competencies
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Certifications & Credentials</h2>
          <p className="text-sm text-muted-foreground">
            Official cloud architecture, security, and developer credentials verified by third-party authorities
          </p>
        </div>

        {/* Certificate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const skills: string[] = JSON.parse(cert.skills || "[]");

            return (
              <div
                key={cert.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                      <Award className="h-5 w-5" />
                    </div>
                    {cert.isFeatured && (
                      <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-medium text-foreground/80 mt-0.5">{cert.issuingOrg}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Issued {formatDate(cert.issueDate)}</span>
                    <span>·</span>
                    <span>{cert.doesNotExpire ? "Does not expire" : `Expires ${formatDate(cert.expiryDate)}`}</span>
                  </div>

                  {cert.credentialId && (
                    <div className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md inline-block">
                      ID: {cert.credentialId}
                    </div>
                  )}

                  {cert.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {cert.description}
                    </p>
                  )}

                  {/* Related Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono bg-muted/80 text-muted-foreground px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    {cert.certificateImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5"
                        onClick={() => setActiveCertModal(cert)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    )}

                    {cert.certificatePdf && (
                      <a href={cert.certificatePdf} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-8 text-xs px-2.5">
                          <FileDown className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </a>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center text-xs"
                    >
                      Verify
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Image Preview Modal */}
      <Dialog open={!!activeCertModal} onOpenChange={(open) => !open && setActiveCertModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeCertModal?.title}</DialogTitle>
          </DialogHeader>
          {activeCertModal?.certificateImage && (
            <div className="relative h-96 w-full rounded-xl overflow-hidden bg-muted border border-border mt-2">
              <Image
                src={activeCertModal.certificateImage}
                alt={activeCertModal.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
