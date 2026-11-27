"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { skillSchema, type SkillInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSkillAction(data: SkillInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = skillSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const highestOrder = await prisma.skill.findFirst({
      where: { category: validated.data.category },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const skill = await prisma.skill.create({
      data: {
        ...validated.data,
        displayOrder: validated.data.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_CREATED",
        entityType: "SKILL",
        entityId: skill.id,
        details: `Created skill: ${skill.name} (${skill.category})`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, skill };
  } catch (error: unknown) {
    console.error("createSkillAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create skill" };
  }
}

export async function updateSkillAction(id: string, data: SkillInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = skillSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: validated.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_UPDATED",
        entityType: "SKILL",
        entityId: skill.id,
        details: `Updated skill: ${skill.name}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true, skill };
  } catch (error: unknown) {
    console.error("updateSkillAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update skill" };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const skill = await prisma.skill.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "SKILL_DELETED",
        entityType: "SKILL",
        entityId: id,
        details: `Deleted skill: ${skill.name}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteSkillAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete skill" };
  }
}

export async function toggleSkillPublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.skill.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
