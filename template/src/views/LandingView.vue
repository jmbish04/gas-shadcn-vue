<template>
  <div class="container mx-auto p-4">
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Your Vue 3 GAS App!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the landing page of your Google Apps Script web application, built with Vue 3, Vite, and shadcn/vue.</p>
        <p class="mt-4">Navigate using the menu above to explore different sections.</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
</script>
