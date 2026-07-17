import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const CMS_FILES = [
  'src/pages/cms.astro',
  'src/pages/cms/',
  'src/pages/api/cms/',
  'src/components/CmsApp.svelte'
];

const BACKUP_DIR = './cms-backup';

async function buildClean() {
  console.log('🚀 Starting clean build...');
  
  try {
    // 1. Create backup directory (if it doesn't exist)
    console.log('📦 Creating backup directory...');
    try {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
      console.log('  ✓ Backup directory ready');
    } catch (error) {
      console.log(`  ⚠️  Backup directory issue: ${error.message}`);
    }
    
    // 2. Move CMS files to backup directory
    console.log('📦 Moving CMS files to backup...');
    for (const file of CMS_FILES) {
      try {
        const stats = await fs.stat(file);
        const backupPath = path.join(BACKUP_DIR, file);
        
        // Create backup subdirectories if needed
        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        
        if (stats.isDirectory()) {
          // Remove existing backup directory if it exists
          try {
            await fs.rm(backupPath, { recursive: true, force: true });
          } catch {}
          await fs.rename(file, backupPath);
        } else {
          await fs.rename(file, backupPath);
        }
        console.log(`  ✓ Moved ${file}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`  ⚠️  File not found: ${file}`);
        } else {
          console.log(`  ⚠️  Could not move ${file}: ${error.message}`);
        }
      }
    }
    
    // 3. Build the site
    console.log('🔨 Building clean site...');
    execSync('npx astro build', { stdio: 'inherit' });
    
    // 4. Copy CMS files back
    console.log('🔄 Copying CMS files back...');
    for (const file of CMS_FILES) {
      const backupPath = path.join(BACKUP_DIR, file);
      try {
        const stats = await fs.stat(backupPath);
        
        // Create target subdirectories if needed
        await fs.mkdir(path.dirname(file), { recursive: true });
        
        if (stats.isDirectory()) {
          // Remove existing target directory if it exists
          try {
            await fs.rm(file, { recursive: true, force: true });
          } catch {}
          await fs.cp(backupPath, file, { recursive: true });
        } else {
          await fs.cp(backupPath, file);
        }
        console.log(`  ✓ Restored ${file}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`  ⚠️  Backup not found: ${file}`);
        } else {
          console.log(`  ⚠️  Could not restore ${file}: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Clean build completed successfully!');
    console.log(`💾 Backup files kept in: ${BACKUP_DIR}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.log(`💾 Backup files available in: ${BACKUP_DIR}`);
    process.exit(1);
  }
}

buildClean();
