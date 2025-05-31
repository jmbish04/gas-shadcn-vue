# Vue 3 + shadcn/vue + Google Apps Script + Gemini AI

A modern Vue 3 application with shadcn/vue components, Tailwind CSS, and Google Apps Script deployment with integrated Gemini AI chat functionality.

## 🚀 Features

- **Vue 3** with TypeScript support
- **Vite** for fast development and building
- **Vue Router** in hash mode (Google Apps Script compatible)
- **Tailwind CSS** for utility-first styling
- **shadcn/vue** for beautiful, accessible UI components
- **Google Apps Script** deployment ready
- **Gemini AI Integration** for intelligent chat functionality
- **Multi-page application** with navigation
- **Responsive design** for all devices

## 🏗️ Architecture

This project combines modern frontend development with Google Apps Script backend services:

- **Frontend**: Vue 3 SPA with shadcn/vue components
- **Backend**: Google Apps Script server-side functions
- **AI**: Google Gemini API integration
- **Deployment**: Single HTML file deployment to Google Apps Script
- **Communication**: `google.script.run` for frontend-backend interaction

## 📁 Project Structure

```
src/
├── App.vue                 # Main application shell with navigation
├── main.ts                 # Vue app initialization
├── router/
│   └── index.ts           # Vue Router configuration (hash mode)
├── views/                 # Page-level components
│   ├── LandingView.vue    # Welcome/home page
│   ├── DataTableView.vue  # Data table with filters and wizard
│   ├── DashboardView.vue  # Dashboard with chart placeholders
│   └── ChatView.vue       # Gemini AI chat interface
├── components/            # Reusable components
│   ├── Navbar.vue         # Global navigation
│   ├── DataTableFilters.vue # Sidebar filters for table page
│   ├── TableConfigWizard.vue # Multi-step table configuration modal
│   └── ui/                # shadcn/vue components
├── types/
│   └── gas.d.ts           # Google Apps Script TypeScript definitions
├── lib/
│   └── utils.ts           # Utility functions
└── assets/
    └── index.css          # Global styles and Tailwind imports

# Google Apps Script Files
Code.gs                     # Main GAS entry point and utilities
GeminiService.gs           # Gemini AI integration service
appsscript.json           # Apps Script manifest
.clasp.json               # Clasp configuration for deployment
```

## 🛠️ Development

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (package manager)
- Google Apps Script CLI (clasp) - `npm install -g @google/clasp`

### Quick Start

1. **Setup environment:**
   ```bash
   ./setup-dev.sh
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   ```

5. **Build for Google Apps Script:**
   ```bash
   pnpm run build:gas
   ```

## 🚀 Google Apps Script Deployment

### Option 1: Automated Deployment with GitHub Actions

Set up automated deployment using GitHub Actions:

1. **Setup GitHub Actions:**
   ```bash
   ./setup-github-actions.sh
   ```

2. **Add Repository Secret:**
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables → Actions
   - Add secret: `CLASP_CREDENTIALS` (content from clasp credentials file)

3. **Deploy:**
   - Push to main/master branch for automatic deployment
   - Or trigger manual deployment from GitHub Actions tab

For detailed setup instructions, see [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

### Option 2: Manual Deployment

1. **Prepare for Deployment:**
   ```bash
   # Build the application for GAS
   pnpm run build:gas

   # Navigate to build directory
   cd gas-dist
   ```

2. **Deploy to Google Apps Script**

```bash
# Push to Apps Script (first time)
clasp create --type webapp --title "Vue GAS App"
clasp push

# Or push to existing project
clasp push

# Deploy as web app
clasp deploy --description "Vue SPA with Gemini AI"
```

### 3. Configure Gemini API

1. Open your Apps Script project: `clasp open`
2. Go to **Project Settings** → **Script Properties**
3. Add property: `GEMINI_API_KEY` with your [Gemini API key](https://makersuite.google.com/app/apikey)

## 🤖 Gemini AI Integration

### Server-Side Functions (GeminiService.gs)

- `chatWithGemini(message, conversationId)` - Chat with conversation history
- `sendToGemini(message, conversationHistory)` - Direct API call
- `clearConversation(conversationId)` - Clear chat history
- `getGeminiCapabilities()` - Get model information

### Frontend Usage

The chat interface automatically detects the Google Apps Script environment:

```javascript
// Development mode - uses mock responses
// Production mode - uses google.script.run to call GAS functions

if (isGAS()) {
  google.script.run
    .withSuccessHandler(response => {
      // Handle Gemini response
    })
    .withFailureHandler(error => {
      // Handle errors
    })
    .chatWithGemini(userMessage);
}
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm build:gas` - Build and prepare for Google Apps Script deployment
- `pnpm preview` - Preview production build

## 🎨 UI Components

This project uses shadcn/vue components with Tailwind CSS:

### Included Components
- **Navigation**: NavigationMenu for main navigation
- **Layout**: Card, ScrollArea for layout structure
- **Forms**: Button, Input, Textarea, Select, Checkbox, Label
- **Data**: Table with sorting and filtering capabilities
- **Feedback**: Dialog, loading states

### Adding New Components

```bash
# Add a new shadcn/vue component
pnpm dlx shadcn-vue@latest add [component-name]
```

## 🗂️ Page Structure

### LandingView
- Welcome page with feature overview
- Navigation to different sections
- Clean, modern design with shadcn/vue components

### DataTableView
- Sortable data table with mock data
- Sidebar filters (DataTableFilters component)
- Table configuration wizard (TableConfigWizard component)
- Export and pagination features

### DashboardView
- Dashboard layout with placeholder charts
- Cards showing key metrics
- Responsive grid layout

### ChatView
- Real-time chat interface with Gemini AI
- Message history and conversation management
- Loading states and error handling
- Automatic environment detection (dev vs production)

2. **Start development server:**
   ```bash
   pnpm run dev
   ```
   The app will be available at `http://localhost:5173/`

3. **Build for production:**
   ```bash
   pnpm run build
   ```
   Built files will be output to the `dist/` directory.

### Adding shadcn/vue Components

To add new shadcn/vue components:

```bash
pnpm dlx shadcn-vue@latest add [component-name]
```

Example:
```bash
pnpm dlx shadcn-vue@latest add badge
```

## 📱 Application Pages

### 1. Landing Page (`/`)
- Welcome page with introduction
- Built with shadcn/vue Card components

### 2. Data Table Page (`/data-table`)
- **Two-column layout:** Main content area and sidebar
- **Data Table:** Displays user data with shadcn/vue Table component
- **Sidebar Filters:** Search, role selection, status checkboxes, date range
- **Configuration Wizard:** Multi-step modal for table customization

### 3. Dashboard Page (`/dashboard`)
- Placeholder chart areas using shadcn/vue Card components
- Ready for chart library integration

### 4. Chat Page (`/chat`)
- Basic chat interface
- shadcn/vue ScrollArea for messages
- Input field and send button

## 🔧 Configuration

### Tailwind CSS
Configured for shadcn/vue with proper content paths, theme variables, and plugins.

### TypeScript
- Path aliases configured (`@/` points to `src/`)
- Strict type checking enabled
- Vue 3 + TypeScript support

### Vue Router
- Hash mode for Google Apps Script compatibility
- Fallback routes for direct navigation/refresh

### Vite Build
- Optimized for Google Apps Script deployment
- Assets inlined for single-file deployment
- TypeScript compilation and type checking

## 🚀 Google Apps Script Deployment

The build output in `dist/` is optimized for Google Apps Script:

1. **Single HTML file:** `index.html` with inlined assets
2. **Hash routing:** Compatible with GAS HtmlService
3. **Optimized assets:** All CSS/JS inlined for GAS compatibility

### Deployment Steps

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Take the generated `dist/index.html` file

3. In your Google Apps Script project:
   - Create an HTML file (e.g., `index.html`)
   - Copy the contents of `dist/index.html`
   - Use `HtmlService.createHtmlOutputFromFile('index')` to serve it

4. For additional GAS-specific functionality, you may need to:
   - Add `google.script.run` calls for server-side functions
   - Handle GAS-specific routing requirements
   - Implement proper error handling for GAS environment

## 🎨 UI Components

This project uses shadcn/vue components for a consistent, beautiful UI:

- **Navigation:** Button components for the main navbar
- **Layout:** Card components for content sections
- **Forms:** Input, Select, Checkbox, Textarea, Button
- **Data Display:** Table components for data presentation
- **Feedback:** Dialog for modals and wizards
- **Utility:** ScrollArea for scrollable content

## 📦 Dependencies

### Core
- Vue 3
- Vue Router 4
- TypeScript

### UI & Styling
- Tailwind CSS
- shadcn/vue
- Lucide Vue Next (icons)
- clsx & tailwind-merge (utility functions)

### Build Tools
- Vite
- PostCSS
- Autoprefixer

## 🔄 Hash Routing for GAS

The router is configured with `createWebHashHistory()` to ensure compatibility with Google Apps Script's HtmlService. This allows for:

- Direct URL navigation
- Browser back/forward functionality
- Refresh handling
- Deep linking support

## 🎯 Next Steps

1. **Add real data:** Replace placeholder data with actual data sources
2. **Implement GAS integration:** Add `google.script.run` calls for server-side functionality
3. **Add charts:** Integrate a chart library (Chart.js, ApexCharts, etc.) for the dashboard
4. **Enhance chat:** Add real-time messaging capabilities
5. **Add authentication:** Implement user authentication if needed
6. **Error handling:** Add proper error boundaries and GAS-specific error handling

## 📝 Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally

## 🤝 Contributing

Feel free to contribute by:
- Adding new shadcn/vue components
- Improving the GAS integration
- Enhancing the UI/UX
- Adding new features

---

**Built with ❤️ using Vue 3, Vite, Tailwind CSS, and shadcn/vue**
