"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: ProjectInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { technologyIds, gallery, startDate, endDate, ...projectData } = validated.data;

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: projectData.slug },
    });
    if (existing) {
      return { success: false, error: "A project with this URL slug already exists." };
    }

    const highestOrder = await prisma.project.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        gallery: JSON.stringify(gallery || []),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        displayOrder: projectData.displayOrder || nextOrder,
      },
    });

    if (technologyIds && technologyIds.length > 0) {
      for (const techId of technologyIds) {
        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: techId,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_CREATED",
        entityType: "PROJECT",
        entityId: project.id,
        details: `Created project: ${project.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return { success: true, project };
  } catch (error: unknown) {
    console.error("createProjectAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create project" };
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { technologyIds, gallery, startDate, endDate, ...projectData } = validated.data;

    // Check slug collision
    const existingSlug = await prisma.project.findFirst({
      where: { slug: projectData.slug, NOT: { id } },
    });
    if (existingSlug) {
      return { success: false, error: "A different project with this slug already exists." };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        gallery: JSON.stringify(gallery || []),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // Update relational technologies
    await prisma.projectTechnology.deleteMany({
      where: { projectId: id },
    });

    if (technologyIds && technologyIds.length > 0) {
      for (const techId of technologyIds) {
        await prisma.projectTechnology.create({
          data: {
            projectId: id,
            technologyId: techId,
          },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_UPDATED",
        entityType: "PROJECT",
        entityId: project.id,
        details: `Updated project: ${project.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");

    return { success: true, project };
  } catch (error: unknown) {
    console.error("updateProjectAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await prisma.project.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "PROJECT_DELETED",
        entityType: "PROJECT",
        entityId: id,
        details: `Deleted project: ${project.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteProjectAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete project" };
  }
}

export async function toggleProjectPublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await prisma.project.update({
      where: { id },
      data: { isPublished },
    });

    await prisma.activityLog.create({
      data: {
        action: isPublished ? "PROJECT_PUBLISHED" : "PROJECT_UNPUBLISHED",
        entityType: "PROJECT",
        entityId: id,
        details: `${isPublished ? "Published" : "Unpublished"} project: ${project.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");

    return { success: true };
  } catch (error: unknown) {
    console.error("toggleProjectPublishAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
