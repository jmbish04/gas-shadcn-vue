#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GAS_DIST_DIR = 'gas-dist';
const BUILD_DIR = 'dist';
const ASSETS_DIR = path.join(BUILD_DIR, 'assets'); // Vite's default assets subfolder

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// This function will create our main index.html template in gas-dist
function createGasIndexTemplate() {
  const templateContent = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Vue GAS App</title>
    <?!= styles ?>
  </head>
  <body>
    <div id="app">Loading application...</div>
    <?!= scripts ?>
    <?!= mock_google_script_run ?>
  </body>
</html>`;
  fs.writeFileSync(path.join(GAS_DIST_DIR, 'index.html'), templateContent);
  console.log('✅ Created gas-dist/index.html template');
}

// This function will create a mock for google.script.run for local dev if needed by the template
function createMockGoogleScriptRunFile() {
  const mockScriptContent = `<script>
// Mock google.script.run for local development if it's not already defined
if (typeof google === 'undefined' || typeof google.script === 'undefined') {
  window.google = {
    script: {
      run: new Proxy({}, {
        get: function(target, prop) {
          return function() {
            const successHandler = {
              withSuccessHandler: function(callback) {
                // Simulate an async call
                console.log(\`Mocked google.script.run.\${prop} called with arguments:\`, Array.from(arguments));
                // You might want to simulate a response for specific functions
                // For example, if prop === 'getUserName', call callback('Test User');
                setTimeout(() => {
                  // Generic mock response or specific ones based on 'prop'
                  if (prop === 'getCurrentUser') {
                     callback({ email: 'dev@example.com', name: 'Development User' });
                  } else {
                     callback('Mocked response for ' + prop);
                  }
                }, 50); 
                return successHandler; // Allow chaining further handlers like withFailureHandler
              },
              withFailureHandler: function(errorCallback) {
                // In this simple mock, we don't simulate failures, but you could
                return successHandler; // Allow chaining
              },
              withUserObject: function(userObj) {
                return successHandler; // Allow chaining
              }
            };
            return successHandler;
          };
        }
      }),
      host: {
        close: function() { console.log('Mock google.script.host.close()'); },
        setHeight: function(height) { console.log('Mock google.script.host.setHeight(' + height + ')'); },
        setWidth: function(width) { console.log('Mock google.script.host.setWidth(' + width + ')'); },
        editor: {
          focus: function() { console.log('Mock google.script.host.editor.focus()'); }
        }
      }
    }
  };
}
</script>`;
  fs.writeFileSync(path.join(GAS_DIST_DIR, 'inc_mock_google_script_run.html'), mockScriptContent);
  console.log('✅ Created gas-dist/inc_mock_google_script_run.html');
}


function processAndInlineAssets() {
  const viteIndexPath = path.join(BUILD_DIR, 'index.html');

  if (!fs.existsSync(viteIndexPath)) {
    console.error(`❌ Vite build output not found at ${viteIndexPath}. Run "pnpm build" first.`);
    process.exit(1);
  }

  let viteHtmlContent = fs.readFileSync(viteIndexPath, 'utf8');

  // Find CSS assets
  const cssRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g;
  let cssMatch;
  let combinedCss = '';
  while ((cssMatch = cssRegex.exec(viteHtmlContent)) !== null) {
    const cssPath = path.join(BUILD_DIR, cssMatch[1].startsWith('/') ? cssMatch[1].substring(1) : cssMatch[1]);
    if (fs.existsSync(cssPath)) {
      console.log(`Found CSS: ${cssPath}`);
      combinedCss += fs.readFileSync(cssPath, 'utf8') + '\\n';
    } else {
      console.warn(`⚠️ CSS file not found: ${cssPath}`);
    }
  }
  fs.writeFileSync(path.join(GAS_DIST_DIR, 'inc_styles.html'), combinedCss);
  console.log('✅ Created gas-dist/inc_styles.html');

  // Find JS assets (modules and regular scripts)
  const jsRegex = /<script[^>]+src="([^"]+)"[^>]*><\\/script>/g; // Simpler regex for src
  let jsMatch;
  let combinedJs = '';
  const scriptSrcs = [];

  // First pass: extract all script sources from Vite's index.html
  // We need to respect the order if there are multiple scripts
  let tempHtmlContent = viteHtmlContent;
  while ((jsMatch = jsRegex.exec(tempHtmlContent)) !== null) {
      const scriptSrc = jsMatch[1].startsWith('/') ? jsMatch[1].substring(1) : jsMatch[1];
      scriptSrcs.push(path.join(BUILD_DIR, scriptSrc));
  }
  
  // Also look for modulepreload links, Vite might use them
  const modulePreloadRegex = /<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g;
  let preloadMatch;
  while ((preloadMatch = modulePreloadRegex.exec(viteHtmlContent)) !== null) {
      const preloadSrc = preloadMatch[1].startsWith('/') ? preloadMatch[1].substring(1) : preloadMatch[1];
      const fullPreloadPath = path.join(BUILD_DIR, preloadSrc);
      // Add only if it's a JS file and not already in scriptSrcs (though modulepreload is often for the main chunk already captured)
      if (fullPreloadPath.endsWith('.js') && !scriptSrcs.includes(fullPreloadPath)) {
          // scriptSrcs.push(fullPreloadPath); // Usually the main JS is already a script tag
          console.log(`Found modulepreload for JS: ${fullPreloadPath} (will be included if it's the main entry)`);
      }
  }


  for (const jsPath of scriptSrcs) {
    if (fs.existsSync(jsPath)) {
      console.log(`Found JS: ${jsPath}`);
      combinedJs += fs.readFileSync(jsPath, 'utf8') + '\\n;\\n'; // Add newline and semicolon for safety
    } else {
      console.warn(`⚠️ JS file not found: ${jsPath}`);
    }
  }

  fs.writeFileSync(path.join(GAS_DIST_DIR, 'inc_script.html'), combinedJs);
  console.log('✅ Created gas-dist/inc_script.html');
}


function copyGasFiles() {
  const gasFiles = ['Code.gs', 'GeminiService.gs']; // Add other .gs files if you have them

  gasFiles.forEach(file => {
    const srcPath = path.join(__dirname, file); // Assuming .gs files are in the root
    const destPath = path.join(GAS_DIST_DIR, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file} to ${GAS_DIST_DIR}`);
    } else {
      console.warn(`⚠️ Warning: ${srcPath} not found, not copied.`);
    }
  });

  const claspJsonPath = path.join(__dirname, '.clasp.json');
  if (fs.existsSync(claspJsonPath)) {
    const claspConfig = JSON.parse(fs.readFileSync(claspJsonPath, 'utf8'));
    claspConfig.rootDir = GAS_DIST_DIR; // Point clasp to the gas-dist directory
    // Important: clasp expects rootDir to be relative to the .clasp.json file,
    // or an absolute path. If .clasp.json is IN gas-dist, rootDir should be empty or not set.
    // For clarity, we'll copy .clasp.json into gas-dist and set rootDir to ""
    const newClaspPath = path.join(GAS_DIST_DIR, '.clasp.json');
    const newClaspConfig = JSON.parse(fs.readFileSync(claspJsonPath, 'utf8')); // Read original again
    newClaspConfig.rootDir = ''; // Clasp will operate from gas-dist
    fs.writeFileSync(newClaspPath, JSON.stringify(newClaspConfig, null, 2));
    console.log(`✅ Created .clasp.json in ${GAS_DIST_DIR} with rootDir cleared`);
  } else {
    console.warn('⚠️ .clasp.json not found in project root. Cannot configure for gas-dist.');
  }

  const appsscriptJsonPath = path.join(__dirname, 'appsscript.json');
  if (fs.existsSync(appsscriptJsonPath)) {
    fs.copyFileSync(appsscriptJsonPath, path.join(GAS_DIST_DIR, 'appsscript.json'));
    console.log(`✅ Copied appsscript.json to ${GAS_DIST_DIR}`);
  } else {
    // Create a default one if it doesn't exist
    createAppsScriptManifest(); 
  }
}

function createAppsScriptManifest() {
  // This function is only called if appsscript.json is missing from the root.
  const manifestPath = path.join(GAS_DIST_DIR, 'appsscript.json');
  if (fs.existsSync(manifestPath)) {
      console.log('ℹ️ appsscript.json already exists in gas-dist.');
      return;
  }

  const manifest = {
    "timeZone": "America/New_York", // Or your preferred timezone
    "dependencies": {},
    "exceptionLogging": "STACKDRIVER",
    "runtimeVersion": "V8",
    "webapp": {
      "access": "ANYONE_ANONYMOUS", // Adjust as needed
      "executeAs": "USER_DEPLOYING" // Or USER_ACCESSING
    },
    "oauthScopes": [ // Add any OAuth scopes your app needs
      "https://www.googleapis.com/auth/script.external_request",
      "https://www.googleapis.com/auth/userinfo.email"
      // e.g., "https://www.googleapis.com/auth/spreadsheets"
    ]
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Created default appsscript.json in gas-dist/');
}

function main() {
  console.log('🚀 Building for Google Apps Script deployment (Option B)...\\n');

  ensureDir(GAS_DIST_DIR);

  // 1. Create the main gas-dist/index.html template that GAS will serve
  createGasIndexTemplate();
  
  // 1b. Create the mock google.script.run include file
  createMockGoogleScriptRunFile();

  // 2. Process Vite's build output (from dist/) to extract and save JS/CSS
  //    into gas-dist/inc_script.html and gas-dist/inc_styles.html
  processAndInlineAssets();

  // 3. Copy .gs files, appsscript.json, and .clasp.json
  copyGasFiles(); // This will also call createAppsScriptManifest if appsscript.json is missing

  console.log('\\n✨ Build complete! Files ready in gas-dist/ directory');
  console.log('\\n📝 Next steps:');
  console.log(`1. Review files in ${GAS_DIST_DIR}/`);
  console.log(`2. (If not already done) cd ${GAS_DIST_DIR}`);
  console.log(`3. (If not already done) clasp login`);
  console.log(`4. (If not already done) clasp create --title "My Vue GAS App" --parentId <your_script_id_if_updating_or_folder_id>`);
  console.log(`   OR ensure .clasp.json in ${GAS_DIST_DIR} has the correct scriptId.`);
  console.log(`5. clasp push -f`);
  console.log(`6. clasp deploy (or manage deployments in the Apps Script editor)`);
  console.log(`   Example: clasp deploy -i <deploymentId_if_updating> -d "New Vue App Version"`);

}

main();
