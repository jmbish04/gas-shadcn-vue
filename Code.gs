/**
 * Main server-side entry point for the Google Apps Script web app
 * Serves the Vue.js application and handles routing
 */

/**
 * Serves the main web app
 */
function doGet(e) {
  const htmlOutput = HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Vue GAS App')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return htmlOutput;
}

/**
 * Include CSS and JS files in the HTML template
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Get user information for the current user
 */
function getCurrentUser() {
  try {
    const user = Session.getActiveUser();
    return {
      email: user.getEmail(),
      name: user.getEmail().split('@')[0] // Basic name extraction
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      email: 'anonymous@example.com',
      name: 'Anonymous'
    };
  }
}

/**
 * Test function to verify server-side functionality
 */
function testServerConnection() {
  return {
    status: 'success',
    message: 'Server connection successful!',
    timestamp: new Date().toISOString(),
    scriptId: ScriptApp.getScriptId()
  };
}

/**
 * Get application configuration
 */
function getAppConfig() {
  return {
    appName: 'Vue GAS App',
    version: '1.0.0',
    environment: 'production',
    features: {
      chat: true,
      dashboard: true,
      dataTable: true
    }
  };
}

/**
 * Simple test function for chat functionality
 * Returns a basic response without calling Gemini API
 */
function testChat(message) {
  try {
    return {
      success: true,
      message: `Echo: ${message} - Server is working!`,
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'test',
        environment: 'Google Apps Script'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
