import { mkdir, copyFile, access } from 'fs/promises';
import { join } from 'path';
import { copyFolder } from './copyFolder.js';

async function createBackup() {
  try {
    // Create backup name with current timestamp
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    const backupDir = join('backups', `backup-${timestamp}`);

    // Create backup directory
    await mkdir(backupDir, { recursive: true });

    // List of directories to copy
    const dirsToBackup = ['src', 'public'];

    // List of individual files to copy
    const filesToBackup = [
      'package.json',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.node.json',
      'vite.config.ts',
      'tailwind.config.js',
      'postcss.config.js',
      'index.html',
      'eslint.config.js'
    ];

    // Copy directories
    for (const dir of dirsToBackup) {
      try {
        await access(dir);
        await copyFolder(dir, join(backupDir, dir));
        console.log(`✅ Directory ${dir} successfully backed up`);
      } catch (err) {
        console.log(`Skipping directory ${dir} - not found`);
      }
    }

    // Copy individual files
    for (const file of filesToBackup) {
      try {
        await access(file);
        await copyFile(file, join(backupDir, file));
        console.log(`✅ File ${file} successfully backed up`);
      } catch (err) {
        console.log(`Skipping file ${file} - not found`);
      }
    }

    console.log(`✅ Backup successfully created in: ${backupDir}`);
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    process.exit(1);
  }
}

createBackup();