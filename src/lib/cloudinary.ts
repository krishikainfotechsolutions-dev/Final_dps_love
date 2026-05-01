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

/**
 * Maximum-speed Cloudinary URL:
 *
 * f_auto       → WebP on Chrome, AVIF on Safari — best compression per browser
 * q_auto:eco   → More aggressive than q_auto — ~20% smaller, barely noticeable
 * w_{width}    → Resize to exact needed width
 * c_limit      → Never upscale a small image
 * dpr_auto     → Retina gets 2x, normal screen gets 1x — automatically
 * fl_progressive → JPEG loads top-to-bottom progressively (feels faster)
 * fl_lossy     → Forces lossy even on PNGs (much smaller files)
 * e_sharpen    → Slight sharpen after resize so image stays crisp
 */
export function cldOptimized(url: string, width = 800): string {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto:eco,w_${width},c_limit,dpr_auto,fl_progressive,fl_lossy,e_sharpen/`
  );
}

/**
 * Responsive srcset — browser picks the right size automatically.
 * Usage: <img srcSet={cldSrcSet(url)} sizes="(max-width: 640px) 100vw, 50vw" />
 */
export function cldSrcSet(url: string, widths = [480, 800, 1200, 1600]): string {
  if (!url || !url.includes("/upload/")) return "";
  return widths
    .map((w) => `${cldOptimized(url, w)} ${w}w`)
    .join(", ");
}

/**
 * Tiny blur placeholder (30px wide) to show instantly while full image loads.
 * Usage: <img src={cldPlaceholder(url)} style={{filter:'blur(8px)'}} />
 */
export function cldPlaceholder(url: string): string {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/w_30,e_blur:1000,q_1,f_auto/`);
}

// Cloudinary se image delete karo (Cloudflare Pages Function ke zariye)
export async function deleteFromCloudinary(public_id: string): Promise<void> {
  const res = await fetch("/api/delete-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error ?? "Cloudinary delete failed");
  }
}