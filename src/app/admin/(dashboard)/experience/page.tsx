import React from "react";
import { prisma } from "@/lib/db";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <ExperienceManager initialExperiences={experiences} />;
}
