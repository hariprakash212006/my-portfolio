"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { achievementSchema, type AchievementInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createAchievementAction(data: AchievementInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = achievementSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { date, ...achData } = validated.data;

    const highestOrder = await prisma.achievement.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const achievement = await prisma.achievement.create({
      data: {
        ...achData,
        date: new Date(date),
        displayOrder: achData.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ACHIEVEMENT_CREATED",
        entityType: "ACHIEVEMENT",
        entityId: achievement.id,
        details: `Created achievement: ${achievement.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/achievements");

    return { success: true, achievement };
  } catch (error: unknown) {
    console.error("createAchievementAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create achievement" };
  }
}

export async function updateAchievementAction(id: string, data: AchievementInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = achievementSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { date, ...achData } = validated.data;

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...achData,
        date: new Date(date),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ACHIEVEMENT_UPDATED",
        entityType: "ACHIEVEMENT",
        entityId: achievement.id,
        details: `Updated achievement: ${achievement.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/achievements");

    return { success: true, achievement };
  } catch (error: unknown) {
    console.error("updateAchievementAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update achievement" };
  }
}

export async function deleteAchievementAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const ach = await prisma.achievement.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "ACHIEVEMENT_DELETED",
        entityType: "ACHIEVEMENT",
        entityId: id,
        details: `Deleted achievement: ${ach.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/achievements");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteAchievementAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete achievement" };
  }
}

export async function toggleAchievementPublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.achievement.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/achievements");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
