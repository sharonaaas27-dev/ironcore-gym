import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export async function uploadImage(filePath: string, folder = 'ironcore-gym') {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function uploadVideo(filePath: string, folder = 'ironcore-gym') {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'video',
    chunk_size: 6000000,
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
