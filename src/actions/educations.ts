"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { educationSchema, type EducationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createEducationAction(data: EducationInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = educationSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { startDate, endDate, ...eduData } = validated.data;

    const highestOrder = await prisma.education.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const education = await prisma.education.create({
      data: {
        ...eduData,
        startDate: new Date(startDate),
        endDate: eduData.isCurrent || !endDate ? null : new Date(endDate),
        displayOrder: eduData.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "EDUCATION_CREATED",
        entityType: "EDUCATION",
        entityId: education.id,
        details: `Created education: ${education.degree} at ${education.institution}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true, education };
  } catch (error: unknown) {
    console.error("createEducationAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create education" };
  }
}

export async function updateEducationAction(id: string, data: EducationInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = educationSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { startDate, endDate, ...eduData } = validated.data;

    const education = await prisma.education.update({
      where: { id },
      data: {
        ...eduData,
        startDate: new Date(startDate),
        endDate: eduData.isCurrent || !endDate ? null : new Date(endDate),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "EDUCATION_UPDATED",
        entityType: "EDUCATION",
        entityId: education.id,
        details: `Updated education: ${education.degree} at ${education.institution}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true, education };
  } catch (error: unknown) {
    console.error("updateEducationAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update education" };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const edu = await prisma.education.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "EDUCATION_DELETED",
        entityType: "EDUCATION",
        entityId: id,
        details: `Deleted education: ${edu.degree} at ${edu.institution}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteEducationAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete education" };
  }
}

export async function toggleEducationPublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.education.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/education");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
