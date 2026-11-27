import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AchievementForm } from "@/components/admin/AchievementForm";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ach = await prisma.achievement.findUnique({
    where: { id },
  });

  if (!ach) notFound();

  const formatted = {
    ...ach,
    date: ach.date.toISOString().split("T")[0],
  };

  return <AchievementForm initialData={formatted} />;
}
