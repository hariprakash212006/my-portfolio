"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFileFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return { success: false, error: "Media not found" };
    }

    if (media.publicId) {
      await deleteFileFromCloudinary(media.publicId);
    }

    await prisma.media.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "MEDIA_DELETED",
        entityType: "MEDIA",
        entityId: id,
        details: `Deleted media file: ${media.name}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/admin/media");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteMediaAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete media" };
  }
}
