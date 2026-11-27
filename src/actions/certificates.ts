"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { certificateSchema, type CertificateInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCertificateAction(data: CertificateInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = certificateSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { skills, issueDate, expiryDate, ...certData } = validated.data;

    const highestOrder = await prisma.certificate.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    const nextOrder = (highestOrder?.displayOrder ?? 0) + 1;

    const certificate = await prisma.certificate.create({
      data: {
        ...certData,
        skills: JSON.stringify(skills || []),
        issueDate: new Date(issueDate),
        expiryDate: certData.doesNotExpire || !expiryDate ? null : new Date(expiryDate),
        displayOrder: certData.displayOrder || nextOrder,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CERTIFICATE_CREATED",
        entityType: "CERTIFICATE",
        entityId: certificate.id,
        details: `Created certificate: ${certificate.title} (${certificate.issuingOrg})`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true, certificate };
  } catch (error: unknown) {
    console.error("createCertificateAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create certificate" };
  }
}

export async function updateCertificateAction(id: string, data: CertificateInput) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = certificateSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message };
    }

    const { skills, issueDate, expiryDate, ...certData } = validated.data;

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...certData,
        skills: JSON.stringify(skills || []),
        issueDate: new Date(issueDate),
        expiryDate: certData.doesNotExpire || !expiryDate ? null : new Date(expiryDate),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CERTIFICATE_UPDATED",
        entityType: "CERTIFICATE",
        entityId: certificate.id,
        details: `Updated certificate: ${certificate.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true, certificate };
  } catch (error: unknown) {
    console.error("updateCertificateAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update certificate" };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const cert = await prisma.certificate.delete({
      where: { id },
    });

    await prisma.activityLog.create({
      data: {
        action: "CERTIFICATE_DELETED",
        entityType: "CERTIFICATE",
        entityId: id,
        details: `Deleted certificate: ${cert.title}`,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteCertificateAction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete certificate" };
  }
}

export async function toggleCertificatePublishAction(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.certificate.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/certificates");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" };
  }
}
