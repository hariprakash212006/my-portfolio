import React from "react";
import { prisma } from "@/lib/db";
import { EducationManager } from "@/components/admin/EducationManager";

export default async function AdminEducationPage() {
  const educations = await prisma.education.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <EducationManager initialEducations={educations} />;
}
