# GitHub Actions for Google Apps Script Deployment

This project includes automated deployment workflows using GitHub Actions to deploy your Vue.js + shadcn/vue application to Google Apps Script.

## 🔧 Setup

### 1. Prerequisites

- GitHub repository for your project
- Google Apps Script project created
- clasp CLI installed and authenticated locally

### 2. Get clasp credentials

First, authenticate with clasp locally:

```bash
npm install -g @google/clasp
clasp login
```

### 3. Run the setup script

```bash
./setup-github-actions.sh
```

This script will:
- Check for clasp credentials
- Show you the content to copy for GitHub secrets
- Provide setup instructions

### 4. Configure GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secret:

| Secret Name | Value |
|-------------|-------|
| `CLASP_CREDENTIALS` | Contents of `~/.config/clasp/credentials.json` |

## 🚀 Available Workflows

### Basic Deployment (`deploy-gas.yml`)

**Triggers:**
- Push to `main` or `master` branch
- Pull requests (build only, no deploy)
- Manual trigger via GitHub UI

**Features:**
- Builds Vue.js project
- Pushes code to Apps Script on every push
- Deploys to production only on main/master branch

### Advanced Deployment (`deploy-gas-advanced.yml`)

**Additional Features:**
- Separate lint/test and deploy jobs
- Build artifact caching
- Custom deployment descriptions
- Force deployment option for non-main branches
- Detailed deployment summaries
- Failure notifications
- Multiple branch support

**Manual Trigger Options:**
- Custom deployment description
- Force deploy from any branch

## 📋 Workflow Details

### Build Process

1. **Install Dependencies:** Uses pnpm for fast, reliable installs
2. **Type Check:** Runs Vue TypeScript compilation
3. **Build for GAS:** Creates optimized build in `gas-dist/`
4. **Push to Apps Script:** Updates your GAS project files
5. **Deploy (main/master only):** Creates new deployment version

### Deployment Strategy

- **Development branches:** Code is pushed but not deployed
- **Main/Master branch:** Full deployment with new version
- **Pull requests:** Build validation only

## 🔍 Monitoring

### Check Deployment Status

1. Go to your repository's **Actions** tab
2. View workflow runs and logs
3. Check deployment summaries

### Apps Script Console

- Visit [Google Apps Script Console](https://script.google.com/)
- Check your project for updated files
- View deployment versions in the deployments section

## 🛠️ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Invalid credentials` | Re-run `clasp login` and update GitHub secret |
| `Script not found` | Check `scriptId` in `.clasp.json` |
| `Permission denied` | Ensure your Google account has access to the script |
| `API not enabled` | Enable Google Apps Script API in Google Cloud Console |

### Debug Steps

1. **Check workflow logs:** Go to Actions tab and view failed runs
2. **Verify credentials:** Ensure `CLASP_CREDENTIALS` secret is correctly set
3. **Test locally:** Run `pnpm run build:gas && cd gas-dist && clasp push`
4. **Check clasp status:** Run `clasp status` in the `gas-dist` directory

### Manual Deployment

If automated deployment fails, you can deploy manually:

```bash
# Build the project
pnpm run build:gas

# Navigate to build directory
cd gas-dist

# Push to Apps Script
clasp push

# Deploy to production
clasp deploy --description "Manual deployment"
```

## 🔒 Security Considerations

- **Credentials:** Never commit clasp credentials to your repository
- **Secrets:** Use GitHub repository secrets for sensitive data
- **Access:** Limit deployment permissions to necessary team members
- **Monitoring:** Review deployment logs regularly

## 📝 Customization

### Modify Deployment Triggers

Edit `.github/workflows/deploy-gas.yml`:

```yaml
on:
  push:
    branches: [ main, develop ]  # Add more branches
  schedule:
    - cron: '0 0 * * 0'  # Weekly deployment
```

### Add Environment Variables

```yaml
env:
  CUSTOM_VAR: ${{ secrets.CUSTOM_SECRET }}
```

### Add Notification Steps

```yaml
- name: Notify Slack
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔗 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [clasp Documentation](https://github.com/google/clasp)
- [Google Apps Script](https://developers.google.com/apps-script)
- [Project Deployment Guide](./DEPLOYMENT.md)
