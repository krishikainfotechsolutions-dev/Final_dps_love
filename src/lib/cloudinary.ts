const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
};

export async function uploadToCloudinary(
  file: File,
  folder = "school/misc",
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET!);
  fd.append("folder", folder);

  const isVideo = file.type.startsWith("video/");
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? "video" : "image"}/upload`;
  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id, resource_type: data.resource_type };
}

export function cldOptimized(url: string, width = 800): string {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}