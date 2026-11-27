import React from "react";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const technologies = await prisma.technology.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return <ProjectForm technologies={technologies} />;
}
