"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateSiteSettingsAction(data: SiteSettingsInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = siteSettingsSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { navSections, ...settingsData } = validated.data;

    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...settingsData,
          navSections: JSON.stringify(navSections),
        },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          ...settingsData,
          navSections: JSON.stringify(navSections),
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        action: "SETTINGS_UPDATED",
        entityType: "SETTINGS",
        details: "Updated global website and SEO settings",
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: unknown) {
    console.error("updateSiteSettingsAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update settings" };
  }
}
