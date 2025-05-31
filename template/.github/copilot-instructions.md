<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
# Instructions for GitHub Copilot

## Package Manager Preference

- When suggesting commands for package management (installing, updating, removing packages, running scripts, executing package binaries), **always use `pnpm`**.
- **Never suggest `npm` or `yarn` commands** unless I explicitly ask for a conversion from `pnpm` to `npm`/`yarn`, or if `pnpm` is clearly not available or suitable for the context.
- For running package executables, use `pnpm exec <command>` (preferred) or `pnpm dlx <command>` (for `npx`-like behavior, especially with `create-*` packages or CLIs like `shadcn-vue`).
- When installing multiple packages, prefer a single `pnpm add <pkg1> <pkg2> ...` command.
- If distinguishing between regular and development dependencies, use `pnpm add <package>` for regular dependencies and `pnpm add -D <package>` for development dependencies.

## Setting up Vite with Vue, TypeScript, Tailwind CSS, and `shadcn-vue`

This guide details the steps to set up a new Vue project using Vite, TypeScript, Tailwind CSS, and `shadcn-vue`, with `pnpm` as the package manager.

**Note:** The following guide is for Tailwind v4. If you are using Tailwind v3, use `shadcn-vue@1.0.3`.

### 1. Create Project

Start by creating a new Vue project using Vite with the TypeScript template:

```bash
pnpm create vite@latest my-vue-app -- --template vue-ts
```

Navigate into your new project directory:
```bash
cd my-vue-app
```

### 2. Add Tailwind CSS

Install Tailwind CSS and its Vite plugin:

```bash
pnpm add tailwindcss @tailwindcss/vite
```

Replace the content of `src/index.css` with the following:

```css name=src/index.css
@import "tailwindcss";
```

### 3. Configure TypeScript Paths

The current version of Vite splits TypeScript configuration. You need to edit `tsconfig.json` and `tsconfig.app.json` to configure path aliases.

**Edit `tsconfig.json`:**
Add the `baseUrl` and `paths` properties to the `compilerOptions` section:

```json name=tsconfig.json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Edit `tsconfig.app.json`:**
Add/update `baseUrl` and `paths` in the `compilerOptions` section to help your IDE resolve paths:

```json name=tsconfig.app.json
{
  // "extends": "@vue/tsconfig/tsconfig.dom.json", // Or your existing extends
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```
*(Note: Ensure other necessary `compilerOptions` in `tsconfig.app.json` like `composite`, `tsBuildInfoFile`, etc., are preserved or correctly set up for your Vue + Vite project).*

### 4. Update `vite.config.ts`

Install the `@types/node` package for Node.js path resolution:

```bash
pnpm add -D @types/node
```

Update your `vite.config.ts` to include the Tailwind CSS plugin and path aliases:

```typescript name=vite.config.ts
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // Corrected import
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()], // Added tailwindcss()
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 5. Initialize `shadcn-vue`

Run the `shadcn-vue init` command to set up your project for `shadcn-vue` components:

```bash
pnpm dlx shadcn-vue@latest init
```

You will be asked a few questions to configure `components.json`. For example:

```text
Which color would you like to use as base color? › Neutral
```
Follow the prompts to complete the initialization.

### 6. Add Components

You can now start adding `shadcn-vue` components to your project.

For example, to add the `Button` component:

```bash
pnpm dlx shadcn-vue@latest add button
```

The command above will add the `Button` component to your project (e.g., in `src/components/ui/button`).

### 7. Usage Example

After adding a component, import and use it in your Vue files:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <Button>Click me</Button>
  </div>
</template>
```

Refer to the [official shadcn-vue documentation](https://www.shadcn-vue.com/) for more detailed information, component APIs, and advanced usage.