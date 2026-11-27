import React from "react";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="space-y-6">
      <ProfileForm initialData={profile} />
    </div>
  );
}
