import path from 'path';
import type { ManifestItem } from '../types.js';
import { IMAGE_SIZES } from '../config.js';
import { ensureFolder } from './downloader.js';

interface OptimizedPaths {
  cover: string;
  gallery: string;
  thumbnail: string;
  coverUrl: string;
  galleryUrl: string;
  thumbnailUrl: string;
}

export async function optimizeImage(
  inputPath: string,
  item: ManifestItem,
  outputFolder: string
): Promise<OptimizedPaths> {
  const { default: sharp } = await import('sharp');
  ensureFolder(outputFolder);

  const base = item.slug;

  const coverPath = path.join(outputFolder, `${base}-cover.webp`);
  const galleryPath = path.join(outputFolder, `${base}-gallery.webp`);
  const thumbPath = path.join(outputFolder, `${base}-thumb.webp`);

  const src = sharp(inputPath);

  await Promise.all([
    src
      .clone()
      .resize(IMAGE_SIZES.cover.width, IMAGE_SIZES.cover.height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(coverPath),
    src
      .clone()
      .resize(IMAGE_SIZES.gallery.width, IMAGE_SIZES.gallery.height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(galleryPath),
    src
      .clone()
      .resize(IMAGE_SIZES.thumbnail.width, IMAGE_SIZES.thumbnail.height, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(thumbPath),
  ]);

  const urlBase = `/${item.targetFolder}`;
  return {
    cover: coverPath,
    gallery: galleryPath,
    thumbnail: thumbPath,
    coverUrl: `${urlBase}/${base}-cover.webp`,
    galleryUrl: `${urlBase}/${base}-gallery.webp`,
    thumbnailUrl: `${urlBase}/${base}-thumb.webp`,
  };
}
