import { v2 as cloudinary } from 'cloudinary';

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export async function uploadImage(file: string, folder: string): Promise<{ url: string; publicId: string }> {
  const result = await getCloudinary().uploader.upload(file, {
    folder: `apon-air-travels/${folder}`,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadVideo(file: string, folder: string): Promise<{ url: string; publicId: string }> {
  const result = await getCloudinary().uploader.upload(file, {
    folder: `apon-air-travels/${folder}`,
    resource_type: 'video',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteAsset(publicId: string): Promise<void> {
  await getCloudinary().uploader.destroy(publicId);
}

export { cloudinary };
