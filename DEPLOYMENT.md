# Google Apps Script Deployment Guide

This guide walks you through deploying your Vue.js + shadcn/vue application to Google Apps Script.

## Prerequisites

1. **Google Apps Script CLI (clasp)** - Install globally:
   ```bash
   npm install -g @google/clasp
   ```

2. **Google Account** - You'll need a Google account to create and deploy Apps Script projects.

3. **Gemini API Key** - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Steps

### 1. Enable Apps Script API
1. Go to [Google Apps Script Settings](https://script.google.com/home/usersettings)
2. Turn on "Google Apps Script API"

### 2. Login to clasp
```bash
clasp login
```

### 3. Build and Deploy

1. **Build the project for Google Apps Script:**
   ```bash
   pnpm run build:gas
   ```

2. **Navigate to the build directory:**
   ```bash
   cd gas-dist
   ```

3. **Push to Google Apps Script:**
   ```bash
   clasp push
   ```

4. **Deploy as a web app:**
   ```bash
   clasp deploy --description "Vue SPA with shadcn/vue and Gemini AI"
   ```

### 4. Configure Gemini API

1. **Open your Apps Script project:**
   ```bash
   clasp open
   ```

2. **Set up your API key:**
   - In the Apps Script editor, go to **Project Settings** (gear icon)
   - Scroll down to **Script Properties**
   - Click **Add script property**
   - Set Name: `GEMINI_API_KEY`
   - Set Value: Your Gemini API key
   - Click **Save script properties**

### 5. Configure Web App Settings

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Choose type: **Web app**
3. Set the following:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (or as needed for your use case)
4. Click **Deploy**
5. Copy the web app URL

## Project Structure in Apps Script

After deployment, your Apps Script project will contain:

- **index.html** - The main Vue.js application (single HTML file with inlined CSS/JS)
- **Code.gs** - Main server-side functions and web app entry point
- **GeminiService.gs** - Gemini AI integration service
- **appsscript.json** - Apps Script manifest

## Available Server Functions

The following server-side functions are available via `google.script.run`:

### Chat Functions
- `chatWithGemini(message, conversationId)` - Send a message to Gemini AI with conversation history
- `sendToGemini(message, conversationHistory)` - Direct Gemini API call
- `clearConversation(conversationId)` - Clear conversation history

### Utility Functions
- `getCurrentUser()` - Get current user information
- `testServerConnection()` - Test server connectivity
- `getAppConfig()` - Get application configuration
- `getGeminiCapabilities()` - Get Gemini model information

## Frontend Integration

The Vue.js frontend automatically detects the Google Apps Script environment and uses `google.script.run` for server communication. In development mode, it falls back to mock responses.

### Example Usage in Vue Components:

```javascript
// Check if running in Google Apps Script
const isGAS = () => {
  return typeof google !== 'undefined' && google.script && google.script.run;
};

// Send message to Gemini
if (isGAS()) {
  google.script.run
    .withSuccessHandler((response) => {
      console.log('Gemini response:', response);
    })
    .withFailureHandler((error) => {
      console.error('Error:', error);
    })
    .chatWithGemini(userMessage);
}
```

## Development Workflow

1. **Local Development:**
   ```bash
   pnpm dev
   ```

2. **Test Build:**
   ```bash
   pnpm run build:gas
   ```

3. **Deploy to Apps Script:**
   ```bash
   cd gas-dist && clasp push
   ```

4. **Test in Apps Script:**
   ```bash
   clasp open
   ```

## Troubleshooting

### Common Issues

1. **"Script function not found"**
   - Make sure you've pushed the latest code with `clasp push`
   - Check that the function name matches exactly

2. **Gemini API errors**
   - Verify your API key is set correctly in Script Properties
   - Check that your API key has proper permissions
   - Review quotas in Google Cloud Console

3. **CORS or loading issues**
   - Ensure the web app is deployed with proper access settings
   - Check that XFrameOptions is set correctly in `Code.gs`

4. **Build errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Check that `terser` is installed for minification

### Logs and Debugging

- Use **Execution transcript** in Apps Script editor to view server-side logs
- Use browser developer tools to debug client-side issues
- Add `console.log()` statements in your `.gs` files for debugging

## Security Notes

- Never expose your Gemini API key in client-side code
- Use Apps Script's built-in security features
- Consider implementing user authentication if needed
- Review and set appropriate access controls for your web app

## Next Steps

After successful deployment:

1. Test all functionality in the live environment
2. Set up monitoring and error handling
3. Consider implementing user authentication
4. Add analytics if needed
5. Document any custom server-side functions

For more information, refer to:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [clasp Documentation](https://github.com/google/clasp)
- [Gemini API Documentation](https://developers.generativeai.google.com/)
