import React from "react";
import { prisma } from "@/lib/db";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const [settings, socialLinks] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const parsedSettings = settings
    ? {
        ...settings,
        navSections: JSON.parse(settings.navSections || "{}"),
      }
    : null;

  return <SettingsManager initialSettings={parsedSettings} initialSocialLinks={socialLinks} />;
}
