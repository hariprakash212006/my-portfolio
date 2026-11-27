import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EducationForm } from "@/components/admin/EducationForm";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edu = await prisma.education.findUnique({
    where: { id },
  });

  if (!edu) notFound();

  const formatted = {
    ...edu,
    startDate: edu.startDate.toISOString().split("T")[0],
    endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : null,
  };

  return <EducationForm initialData={formatted} />;
}
