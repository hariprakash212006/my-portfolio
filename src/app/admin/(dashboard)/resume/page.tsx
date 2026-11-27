import React from "react";
import { prisma } from "@/lib/db";
import { ResumeManager } from "@/components/admin/ResumeManager";

export default async function AdminResumePage() {
  const profile = await prisma.profile.findFirst();

  return <ResumeManager profile={profile} />;
}
