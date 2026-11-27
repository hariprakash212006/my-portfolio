"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ReorderableEntity =
  | "project"
  | "skill"
  | "experience"
  | "education"
  | "certificate"
  | "achievement"
  | "socialLink";

export async function reorderItemsAction(
  entity: ReorderableEntity,
  orderedIds: string[]
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Update displayOrder in parallel/batch
    await prisma.$transaction(
      orderedIds.map((id, index) => {
        const order = index + 1;
        switch (entity) {
          case "project":
            return prisma.project.update({ where: { id }, data: { displayOrder: order } });
          case "skill":
            return prisma.skill.update({ where: { id }, data: { displayOrder: order } });
          case "experience":
            return prisma.experience.update({ where: { id }, data: { displayOrder: order } });
          case "education":
            return prisma.education.update({ where: { id }, data: { displayOrder: order } });
          case "certificate":
            return prisma.certificate.update({ where: { id }, data: { displayOrder: order } });
          case "achievement":
            return prisma.achievement.update({ where: { id }, data: { displayOrder: order } });
          case "socialLink":
            return prisma.socialLink.update({ where: { id }, data: { displayOrder: order } });
          default:
            throw new Error(`Invalid entity type: ${entity}`);
        }
      })
    );

    revalidatePath("/");
    revalidatePath(`/admin/${entity === "socialLink" ? "settings" : entity + "s"}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("reorderItemsAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to persist ordering",
    };
  }
}
