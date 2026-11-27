import React from "react";
import { prisma } from "@/lib/db";
import { AchievementsManager } from "@/components/admin/AchievementsManager";

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <AchievementsManager initialAchievements={achievements} />;
}
