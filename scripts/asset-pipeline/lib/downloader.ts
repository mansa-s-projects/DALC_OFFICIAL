import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { PUBLIC_DIR } from '../config.js';
import type { ManifestItem } from '../types.js';

export function ensureFolder(folderPath: string): void {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }
}

export async function downloadImage(url: string, destPath: string): Promise<void> {
  await mkdir(path.dirname(destPath), { recursive: true });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  const { writeFile } = await import('fs/promises');
  await writeFile(destPath, Buffer.from(buffer));
}

export function getLocalPath(item: ManifestItem, suffix: string): string {
  return path.join(PUBLIC_DIR, item.targetFolder, `${item.slug}-${suffix}.jpg`);
}

export function getLocalWebpPath(item: ManifestItem, suffix: string): string {
  return path.join(PUBLIC_DIR, item.targetFolder, `${item.slug}-${suffix}.webp`);
}

export function getPublicUrl(item: ManifestItem, suffix: string): string {
  return `/${item.targetFolder}/${item.slug}-${suffix}.webp`;
}

void createWriteStream;
