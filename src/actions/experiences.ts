"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExperienceAction(data: ExperienceInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = experienceSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { responsibilities, technologies, startDate, endDate, ...expData } = validated.data;

    const highestOrder = await prisma.experience.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const experience = await prisma.experience.create({
      data: {
        ...expData,
        responsibilities: JSON.stringify(responsibilities || []),
        technologies: JSON.stringify(technologies || []),
        startDate: new Date(startDate),
        endDate: expData.isCurrent || !endDate ? null : new Date(endDate),
        displayOrder: expData.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_CREATED",
        entityType: "EXPERIENCE",
        entityId: experience.id,
        details: `Created experience: ${experience.jobTitle} at ${experience.company}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");

    return { success: true, experience };
  } catch (error: unknown) {
    console.error("createExperienceAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create experience" };
  }
}

export async function updateExperienceAction(id: string, data: ExperienceInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = experienceSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { responsibilities, technologies, startDate, endDate, ...expData } = validated.data;

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...expData,
        responsibilities: JSON.stringify(responsibilities || []),
        technologies: JSON.stringify(technologies || []),
        startDate: new Date(startDate),
        endDate: expData.isCurrent || !endDate ? null : new Date(endDate),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_UPDATED",
        entityType: "EXPERIENCE",
        entityId: experience.id,
        details: `Updated experience: ${experience.jobTitle} at ${experience.company}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");

    return { success: true, experience };
  } catch (error: unknown) {
    console.error("updateExperienceAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update experience" };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const exp = await prisma.experience.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "EXPERIENCE_DELETED",
        entityType: "EXPERIENCE",
        entityId: id,
        details: `Deleted experience: ${exp.jobTitle} at ${exp.company}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteExperienceAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete experience" };
  }
}

export async function toggleExperiencePublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.experience.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
