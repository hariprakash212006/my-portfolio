import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, technologies] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          select: { technologyId: true },
        },
      },
    }),
    prisma.technology.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const formattedProject = {
    ...project,
    gallery: JSON.parse(project.gallery || "[]"),
    startDate: project.startDate ? project.startDate.toISOString().split("T")[0] : null,
    endDate: project.endDate ? project.endDate.toISOString().split("T")[0] : null,
    technologyIds: project.technologies.map((t) => t.technologyId),
  };

  return <ProjectForm initialData={formattedProject} technologies={technologies} />;
}
