import { mkdir, readdir, copyFile } from 'fs/promises';
import { join } from 'path';

export async function copyFolder(source, destination) {
  try {
    // Create destination folder if it doesn't exist
    await mkdir(destination, { recursive: true });
    
    // Read source directory
    const entries = await readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = join(source, entry.name);
      const destPath = join(destination, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyFolder(srcPath, destPath);
      } else {
        // Copy files
        await copyFile(srcPath, destPath);
      }
    }
    
    console.log(`✅ Successfully copied folder from ${source} to ${destination}`);
  } catch (error) {
    console.error('❌ Error copying folder:', error);
    throw error;
  }
}