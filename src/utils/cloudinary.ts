const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  originalName: string;
}

/**
 * Upload a single file directly to Cloudinary using an unsigned upload preset.
 * No API secret is needed — this is safe for client-side use.
 */
export const uploadFileToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "chat-app/uploads");

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Cloudinary upload failed (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    originalName: file.name,
  };
};

/**
 * Upload multiple files to Cloudinary in parallel.
 * Returns an array of results in the same order as the input files.
 */
export const uploadFilesToCloudinary = async (
  files: File[]
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(files.map((file) => uploadFileToCloudinary(file)));
};
