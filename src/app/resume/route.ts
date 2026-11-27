import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    select: { resumeUrl: true, resumeName: true },
  });

  if (profile?.resumeUrl) {
    return NextResponse.redirect(profile.resumeUrl, { status: 307 });
  }

  // If no resume uploaded yet, redirect back to homepage
  return NextResponse.redirect(new URL("/#contact", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 307,
  });
}
