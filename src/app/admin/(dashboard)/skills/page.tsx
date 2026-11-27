import React from "react";
import { prisma } from "@/lib/db";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <SkillsManager initialSkills={skills} />;
}
