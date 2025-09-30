#!/usr/bin/env node
/* eslint-disable no-undef */

/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Kickoff Node TS - Creating your project...\n');

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project name from command line arguments
const projectName = process.argv[2] || 'my-kickoff-project';
const targetDir = path.join(process.cwd(), projectName);

// Check if directory already exists
if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory "${projectName}" already exists!`);
  process.exit(1);
}

try {
  // Create project directory
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Get the package installation directory
  const packageDir = path.join(__dirname, '..');
  
  // Copy source files
  console.log('📁 Copying project files...');
  copyDirectory(path.join(packageDir, 'src'), path.join(targetDir, 'src'));
  
  // Copy configuration files
  const configFiles = [
    'tsconfig.json',
    'eslint.config.mts',
    '.env.example',
    'README.md'
  ];
  
  configFiles.forEach(file => {
    const srcPath = path.join(packageDir, file);
    const destPath = path.join(targetDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  // Create package.json for the new project
  const newPackageJson = {
    name: projectName,
    version: "1.0.0",
    main: "dist/server.js",
    type: "module",
    scripts: {
      build: "tsc",
      lint: "eslint src --ignore-path .eslintignore --ext .ts",
      "lint:fix": "npx eslint src --fix",
      prettier: "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
      "prettier:fix": "npx prettier --write src",
      dev: "ts-node-dev --respawn --transpile-only ./src/server.ts",
      prod: "node ./dist/server.js",
      test: "echo \"Error: no test specified\" && exit 1"
    },
    dependencies: {
      "cors": "^2.8.5",
      "dotenv": "^17.2.2",
      "express": "^5.1.0",
      "http-status": "^2.1.0",
      "mongoose": "^8.18.1",
      "zod": "^4.1.11"
    },
    devDependencies: {
      "@eslint/js": "^9.36.0",
      "@types/cors": "^2.8.19",
      "@types/express": "^5.0.3",
      "@types/node": "^24.6.0",
      "@typescript-eslint/eslint-plugin": "^8.44.0",
      "@typescript-eslint/parser": "^8.44.0",
      "eslint": "^9.36.0",
      "eslint-config-prettier": "^10.1.8",
      "globals": "^16.4.0",
      "jiti": "^2.5.1",
      "prettier": "^3.6.2",
      "ts-node-dev": "^2.0.0",
      "typescript": "^5.9.2",
      "typescript-eslint": "^8.44.0"
    }
  };
  
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(newPackageJson, null, 2)
  );
  
  // Create .gitignore
  const gitignore = `node_modules/
dist/
.env
*.log
.DS_Store
coverage/
.vscode/
.idea/
`;
  fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore);
  
  console.log('✅ Project created successfully!\n');
  console.log('📦 Next steps:');
  console.log(`   cd ${projectName}`);
  console.log('   npm install');
  console.log('   cp .env.example .env  # Configure your environment variables');
  console.log('   npm run dev\n');
  console.log('🎉 Happy coding!');
  
} catch (error) {
  console.error('❌ Error creating project:', error.message);
  // Clean up on error
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  process.exit(1);
}

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}