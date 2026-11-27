import { v2 as cloudinary } from "cloudinary";

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  fileSize: number;
  format: string;
}

export async function uploadFileToCloudinary(
  fileBuffer: Buffer,
  folder: string = "portfolio",
  filename?: string
): Promise<UploadResult> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename ? filename.replace(/\.[^/.]+$/, "") : undefined,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              fileSize: result.bytes,
              format: result.format || "unknown",
            });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Graceful Local Fallback: Convert to Data URI for seamless zero-config local testing
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64}`;
  return {
    url: dataUri,
    publicId: `local_${Date.now()}_${filename || "file"}`,
    fileSize: fileBuffer.length,
    format: filename ? filename.split(".").pop() || "bin" : "bin",
  };
}

export async function deleteFileFromCloudinary(publicId: string): Promise<boolean> {
  if (isCloudinaryConfigured && !publicId.startsWith("local_")) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === "ok";
    } catch {
      return false;
    }
  }
  return true;
}
