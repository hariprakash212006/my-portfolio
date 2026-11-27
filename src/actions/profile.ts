"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: ProfileInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const existingProfile = await prisma.profile.findFirst();

    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...validated.data,
          resumeUpdatedAt: validated.data.resumeUrl !== existingProfile.resumeUrl ? new Date() : existingProfile.resumeUpdatedAt,
        },
      });
    } else {
      await prisma.profile.create({
        data: {
          ...validated.data,
          resumeUpdatedAt: validated.data.resumeUrl ? new Date() : null,
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        action: "PROFILE_UPDATED",
        entityType: "PROFILE",
        details: `Updated personal profile information for ${validated.data.name}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/profile");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: unknown) {
    console.error("updateProfileAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" };
  }
}
