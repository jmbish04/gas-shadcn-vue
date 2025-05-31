#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build script for Google Apps Script deployment
 * This script processes the Vite build output to create GAS-compatible files
 */

const GAS_DIST_DIR = 'gas-dist';
const BUILD_DIR = 'dist';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readTemplate() {
  const templatePath = path.join(__dirname, 'gas-template.html');
  return fs.readFileSync(templatePath, 'utf8');
}

function processHtmlFile() {
  const indexPath = path.join(BUILD_DIR, 'index.html');
  const template = readTemplate();

  if (!fs.existsSync(indexPath)) {
    console.error('Build output not found. Run "pnpm build" first.');
    process.exit(1);
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Extract the head and body content from the built HTML
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!headMatch || !bodyMatch) {
    console.error('Could not parse built HTML file');
    process.exit(1);
  }

  let headContent = headMatch[1];
  let bodyContent = bodyMatch[1];

  // Remove the template's basic head content and replace with build content
  let processedTemplate = template.replace(
    /<title>.*?<\/title>/,
    ''
  );

  // Insert the built head content
  processedTemplate = processedTemplate.replace(
    '</head>',
    `${headContent}</head>`
  );

  // Insert the built body content (app div and scripts)
  processedTemplate = processedTemplate.replace(
    '<div id="app"></div>',
    bodyContent
  );

  // Write the final HTML file for GAS
  const outputPath = path.join(GAS_DIST_DIR, 'index.html');
  fs.writeFileSync(outputPath, processedTemplate);

  console.log('✅ Created index.html for Google Apps Script');
}

function copyGasFiles() {
  // Copy .gs files
  const gasFiles = ['Code.gs', 'GeminiService.gs'];

  gasFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(GAS_DIST_DIR, file));
      console.log(`✅ Copied ${file}`);
    } else {
      console.warn(`⚠️  Warning: ${file} not found`);
    }
  });

  // Copy clasp configuration with proper settings for gas-dist
  if (fs.existsSync('.clasp.json')) {
    const claspConfig = JSON.parse(fs.readFileSync('.clasp.json', 'utf8'));
    // Update rootDir to empty string for gas-dist deployment
    claspConfig.rootDir = '';
    fs.writeFileSync(path.join(GAS_DIST_DIR, '.clasp.json'), JSON.stringify(claspConfig, null, 2));
    console.log('✅ Created .clasp.json for deployment');
  }

  // Copy appsscript.json if it exists
  if (fs.existsSync('appsscript.json')) {
    fs.copyFileSync('appsscript.json', path.join(GAS_DIST_DIR, 'appsscript.json'));
    console.log('✅ Copied appsscript.json');
  }
}

function createAppsScriptManifest() {
  const manifestPath = path.join(GAS_DIST_DIR, 'appsscript.json');

  if (!fs.existsSync(manifestPath)) {
    const manifest = {
      "timeZone": "America/New_York",
      "dependencies": {},
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "webapp": {
        "access": "ANYONE_ANONYMOUS",
        "executeAs": "USER_DEPLOYING"
      }
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Created appsscript.json manifest');
  }
}

function main() {
  console.log('🚀 Building for Google Apps Script deployment...\n');

  // Ensure gas-dist directory exists
  ensureDir(GAS_DIST_DIR);

  // Process the HTML file
  processHtmlFile();

  // Copy GAS-specific files
  copyGasFiles();

  // Create Apps Script manifest if needed
  createAppsScriptManifest();

  console.log('\n✨ Build complete! Files ready in gas-dist/ directory');
  console.log('\n📝 Next steps:');
  console.log('1. cd gas-dist');
  console.log('2. clasp push');
  console.log('3. clasp deploy --description "Vue SPA with shadcn/vue"');
}

main();
