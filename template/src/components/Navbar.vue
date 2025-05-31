<template>
  <nav class="border-b bg-background">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold">Vue GAS App</h1>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-1">
          <Button
            v-for="link in navLinks"
            :key="link.name"
            :variant="$route.name === link.name ? 'default' : 'ghost'"
            @click="navigateToPage(link.pageName)"
          >
            {{ link.label }}
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { navigateToPage } from '@/router';

const navLinks = [
  { name: 'Landing', label: 'Home', pageName: '' },
  { name: 'DataTable', label: 'Data Table', pageName: 'data-table' },
  { name: 'Dashboard', label: 'Dashboard', pageName: 'dashboard' },
  { name: 'Chat', label: 'Chat', pageName: 'chat' },
];
</script>
