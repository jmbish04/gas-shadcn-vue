<template>
  <div id="app" class="min-h-screen bg-background">
    <Navbar />
    <main class="container mx-auto py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
</script>

<style>
/* Global styles are imported in main.ts */
</style>
