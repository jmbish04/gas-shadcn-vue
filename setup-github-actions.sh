#!/bin/bash

# GitHub Actions Setup Script for Google Apps Script Deployment
# This script helps you set up the necessary secrets for GitHub Actions

echo "🔧 Setting up GitHub Actions for Google Apps Script deployment..."
echo ""

npm install -g @google/clasp

echo "📋 Prerequisites checklist:"
echo "✓ You have a GitHub repository for this project"
echo "✓ You have clasp installed globally (npm install -g @google/clasp)"
echo "✓ You are logged in to clasp (clasp login)"
echo "✓ You have a Google Apps Script project created"
echo ""

echo "🔑 Setting up GitHub Secrets..."
echo ""

# Check if clasp credentials exist
CLASP_CREDS_FILE="$HOME/.config/clasp/credentials.json"

if [ ! -f "$CLASP_CREDS_FILE" ]; then
    echo "❌ Clasp credentials not found at $CLASP_CREDS_FILE"
    echo "Please run 'clasp login' first to authenticate with Google Apps Script."
    exit 1
fi

echo "✅ Found clasp credentials file"
echo ""

echo "📝 GitHub Repository Secrets Setup:"
echo ""
echo "You need to add the following secret to your GitHub repository:"
echo ""
echo "Secret Name: CLASP_CREDENTIALS"
echo "Secret Value: (contents of your clasp credentials file)"
echo ""

echo "🔧 Steps to add the secret:"
echo "1. Go to your GitHub repository"
echo "2. Click on Settings tab"
echo "3. Navigate to Secrets and variables > Actions"
echo "4. Click 'New repository secret'"
echo "5. Name: CLASP_CREDENTIALS"
echo "6. Value: Copy the content below"
echo ""

echo "📄 Copy this content for CLASP_CREDENTIALS:"
echo "----------------------------------------"
cat "$CLASP_CREDS_FILE"
echo ""
echo "----------------------------------------"
echo ""

echo "🚀 Alternative: Auto-copy to clipboard (if xclip is available):"
if command -v xclip &> /dev/null; then
    cat "$CLASP_CREDS_FILE" | xclip -selection clipboard
    echo "✅ Credentials copied to clipboard!"
elif command -v pbcopy &> /dev/null; then
    cat "$CLASP_CREDS_FILE" | pbcopy
    echo "✅ Credentials copied to clipboard!"
else
    echo "⚠️  Clipboard utility not found. Please copy the content manually."
fi

echo ""
echo "🔍 Additional Setup Notes:"
echo ""
echo "1. Make sure your .clasp.json has the correct scriptId"
echo "2. Ensure your Google Apps Script project allows external access"
echo "3. The workflow will:"
echo "   - Build your Vue.js project"
echo "   - Push code to Apps Script on any push"
echo "   - Deploy to production only on main/master branch"
echo ""

echo "📊 Checking current .clasp.json configuration..."
if [ -f ".clasp.json" ]; then
    echo "✅ Found .clasp.json:"
    cat .clasp.json
else
    echo "❌ .clasp.json not found in current directory"
    echo "Make sure you're in the project root and have run 'clasp create' or 'clasp clone'"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Add the CLASP_CREDENTIALS secret to your GitHub repository"
echo "2. Push your code to GitHub"
echo "3. Check the Actions tab to see the deployment workflow"
echo "4. Your Vue.js app will be automatically deployed to Google Apps Script!"
echo ""
echo "🔗 Useful Links:"
echo "- GitHub Secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets"
echo "- Clasp Documentation: https://github.com/google/clasp"
echo "- Apps Script Console: https://script.google.com/"
