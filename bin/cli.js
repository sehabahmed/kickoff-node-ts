#!/usr/bin/env node

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Installing your project files...');

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the package directory (where your src files are)
const packageDir = path.join(__dirname);
const targetDir = process.cwd();

// Create a project folder
const projectName = process.argv[2] || 'my-project';
const projectPath = path.join(targetDir, projectName);

if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath, { recursive: true });
}

// Copy all src files to the new project
fs.cpSync(packageDir, path.join(projectPath, 'src'), { recursive: true });

console.log(`✅ Project files copied to ./${projectName}/src/`);
console.log(`📁 Files included: app.ts, server.ts`);
console.log(`🚀 Navigate to ${projectName} to start working!`);