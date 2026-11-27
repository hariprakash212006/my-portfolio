import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CertificateForm } from "@/components/admin/CertificateForm";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { id },
  });

  if (!cert) notFound();

  const formatted = {
    ...cert,
    skills: JSON.parse(cert.skills || "[]"),
    issueDate: cert.issueDate.toISOString().split("T")[0],
    expiryDate: cert.expiryDate ? cert.expiryDate.toISOString().split("T")[0] : null,
  };

  return <CertificateForm initialData={formatted} />;
}
