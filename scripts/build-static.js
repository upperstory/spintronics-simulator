#!/usr/bin/env node

/**
 * Build script for creating a static distribution of the Spintronics Simulator
 * This creates a standalone version that can be hosted on any static file server
 * (GitHub Pages, Netlify, Vercel, S3, etc.)
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'public');
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Files and directories to exclude from the build
const EXCLUDE = [
    '.htaccess',
    '.DS_Store',
    'Thumbs.db'
];

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        // Skip excluded files
        if (EXCLUDE.includes(entry.name)) {
            continue;
        }

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Clean the dist directory
 */
function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Create a simple 404.html for SPA routing on static hosts
 */
function create404Page() {
    const content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Spintronics Simulator</title>
    <script>
        // Redirect to main page - useful for SPA routing
        window.location.href = '/';
    </script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>`;
    fs.writeFileSync(path.join(DIST_DIR, '404.html'), content);
}

/**
 * Create a _redirects file for Netlify
 */
function createNetlifyRedirects() {
    const content = `# Netlify redirects
/*    /index.html   200
`;
    fs.writeFileSync(path.join(DIST_DIR, '_redirects'), content);
}

/**
 * Count files in a directory recursively
 */
function countFiles(dir) {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            count += countFiles(path.join(dir, entry.name));
        } else {
            count++;
        }
    }
    return count;
}

/**
 * Get directory size in MB
 */
function getDirSize(dir) {
    let size = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            size += getDirSize(fullPath);
        } else {
            size += fs.statSync(fullPath).size;
        }
    }
    return size;
}

// Main build process
console.log('🔨 Building Spintronics Simulator for static hosting...\n');

// Step 1: Clean dist directory
console.log('📁 Cleaning dist directory...');
cleanDist();

// Step 2: Copy public folder
console.log('📦 Copying public files...');
copyDir(SOURCE_DIR, DIST_DIR);

// Step 3: Create additional files for static hosting
console.log('📝 Creating hosting helper files...');
create404Page();
createNetlifyRedirects();

// Done!
const fileCount = countFiles(DIST_DIR);
const sizeInMB = (getDirSize(DIST_DIR) / (1024 * 1024)).toFixed(2);

console.log('\n✅ Build complete!\n');
console.log(`   Files: ${fileCount}`);
console.log(`   Size:  ${sizeInMB} MB`);
console.log(`   Output: ${DIST_DIR}\n`);
console.log('📤 Deployment options:');
console.log('   • GitHub Pages: Push the dist folder to gh-pages branch');
console.log('   • Netlify: Drag and drop the dist folder to netlify.com/drop');
console.log('   • Vercel: Run "vercel dist" from the project root');
console.log('   • Any static host: Upload the contents of the dist folder\n');
console.log('🖥️  To test locally: npm run serve:static');
