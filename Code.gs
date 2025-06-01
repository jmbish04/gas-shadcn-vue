// Code.gs

function doGet(e) {
  const htmlTemplate = HtmlService.createTemplateFromFile('index'); // From gas-dist/index.html

  try {
    htmlTemplate.styles = HtmlService.createHtmlOutputFromFile('inc_styles.html').getContent();
  } catch (err) {
    Logger.log('Error loading inc_styles.html: ' + err.message + ' Stack: ' + err.stack);
    htmlTemplate.styles = '/* Styles could not be loaded. Check server logs. */';
  }

  try {
    htmlTemplate.scripts = HtmlService.createHtmlOutputFromFile('inc_script.html').getContent();
  } catch (err) {
    Logger.log('Error loading inc_script.html: ' + err.message + ' Stack: ' + err.stack);
    htmlTemplate.scripts = 'console.error("Client-side scripts could not be loaded. Check server logs. Details: ' + escapeJsString(err.message) + '");';
  }

  // For the mock google.script.run, only include it if not in a true GAS environment
  // However, for simplicity in the template, we can just always include it,
  // and the script itself checks if `google.script.run` is already defined.
  // Or, conditionally add it here:
  // htmlTemplate.mock_google_script_run = ''; // Default to empty
  // if (/* some condition to detect non-GAS env, tricky server-side */) {
  //   htmlTemplate.mock_google_script_run = HtmlService.createHtmlOutputFromFile('inc_mock_google_script_run.html').getContent();
  // }
  // For now, let's assume the template always includes the placeholder, and the mock script handles its own existence.
  // So, we need to provide content for it:
  try {
    htmlTemplate.mock_google_script_run = HtmlService.createHtmlOutputFromFile('inc_mock_google_script_run.html').getContent();
  } catch (err) {
    Logger.log('Error loading inc_mock_google_script_run.html: ' + err.message);
    htmlTemplate.mock_google_script_run = '<script>console.error("Could not load google.script.run mock.");</script>';
  }


  return htmlTemplate.evaluate()
    .setTitle('My Vue GAS App') // Set your desired title
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function escapeJsString(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/[\u0000-\u001F]/g, function(match) {
      return '\\x' + ('00' + match.charCodeAt(0).toString(16)).slice(-2);
    });
}

// Your other Code.gs functions (like GeminiService calls, etc.) remain here
// e.g., from your GeminiService.gs or other .gs files if they are meant to be callable from client
function getCurrentUser() {
  try {
    const email = Session.getActiveUser().getEmail();
    const name = Session.getActiveUser().getUsername(); // May not be available depending on domain settings
    // For more robust name fetching, you might need People API if Directory API isn't an option or email is enough
    return { email: email, name: name || email.split('@')[0] };
  } catch (e) {
    // Likely no active user (e.g. anonymous access or service account) or permissions issue
    Logger.log("Error getting current user: " + e.toString());
    return { email: 'unknown', name: 'Unknown User' };
  }
}

function testServerConnection() {
  return { status: 'ok', timestamp: new Date().toISOString(), message: 'Connection to Google Apps Script server successful!' };
}

// Add other server-side functions that your Vue app will call via google.script.run
// For example:
// function getSomeData() {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
//   return sheet.getDataRange().getValues();
// }

// Make sure functions callable from client are not starting with underscore
// and are globally defined in your Code.gs or other .gs files included in the deployment.

/*
Include the content of GeminiService.gs here if you want it all in one Code.gs for clasp,
or ensure your build process copies GeminiService.gs to gas-dist and it's correctly referenced.
The build script above (copyGasFiles) now copies GeminiService.gs.
*/
