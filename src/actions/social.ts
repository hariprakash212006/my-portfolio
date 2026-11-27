"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSocialLinkAction(data: SocialLinkInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = socialLinkSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const highestOrder = await prisma.socialLink.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const link = await prisma.socialLink.create({
      data: {
        ...validated.data,
        displayOrder: validated.data.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "SOCIAL_LINK_CREATED",
        entityType: "SOCIAL_LINK",
        entityId: link.id,
        details: `Created social link: ${link.platform}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true, link };
  } catch (error: unknown) {
    console.error("createSocialLinkAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create social link" };
  }
}

export async function updateSocialLinkAction(id: string, data: SocialLinkInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = socialLinkSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const link = await prisma.socialLink.update({
      where: { id },
      data: validated.data,
    });

    await prisma.activityLog.create({
      data: {
        action: "SOCIAL_LINK_UPDATED",
        entityType: "SOCIAL_LINK",
        entityId: link.id,
        details: `Updated social link: ${link.platform}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true, link };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update social link" };
  }
}

export async function deleteSocialLinkAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const link = await prisma.socialLink.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "SOCIAL_LINK_DELETED",
        entityType: "SOCIAL_LINK",
        entityId: id,
        details: `Deleted social link: ${link.platform}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete social link" };
  }
}
