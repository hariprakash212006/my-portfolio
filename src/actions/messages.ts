"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validations";
import { sendContactNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function sendContactMessageAction(data: ContactMessageInput) {
  try {
    const validated = contactMessageSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { name, email, subject, message } = validated.data;

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Send email notification to owner via Resend
    await sendContactNotification({
      name,
      email,
      subject,
      message,
    });

    return { success: true, messageId: contactMessage.id };
  } catch (error: unknown) {
    console.error("sendContactMessageAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
  }
}

export async function toggleMessageReadAction(id: string, isRead: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update message" };
  }
}

export async function toggleMessageArchiveAction(id: string, isArchived: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isArchived },
    });

    revalidatePath("/admin/messages");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update archive status" };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete message" };
  }
}
