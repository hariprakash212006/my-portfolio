import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await prisma.experience.findUnique({
    where: { id },
  });

  if (!exp) notFound();

  const formatted = {
    ...exp,
    responsibilities: JSON.parse(exp.responsibilities || "[]"),
    technologies: JSON.parse(exp.technologies || "[]"),
    startDate: exp.startDate.toISOString().split("T")[0],
    endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
  };

  return <ExperienceForm initialData={formatted} />;
}
