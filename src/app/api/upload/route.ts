import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, GIF, SVG, PDF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await uploadFileToCloudinary(buffer, folder, file.name);

    // Save media record in database
    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        fileType: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
        fileSize: uploadRes.fileSize,
        format: uploadRes.format,
        folder,
      },
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        action: "MEDIA_UPLOADED",
        entityType: "MEDIA",
        entityId: media.id,
        details: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error: unknown) {
    console.error("Upload handler error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
