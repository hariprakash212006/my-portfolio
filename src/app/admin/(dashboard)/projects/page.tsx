import React from "react";
import { prisma } from "@/lib/db";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      technologies: {
        include: {
          technology: {
            select: { name: true },
          },
        },
      },
    },
  });

  return <ProjectsManager initialProjects={projects} />;
}
