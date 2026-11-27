import React from "react";
import { prisma } from "@/lib/db";
import { CertificatesManager } from "@/components/admin/CertificatesManager";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <CertificatesManager initialCertificates={certificates} />;
}
