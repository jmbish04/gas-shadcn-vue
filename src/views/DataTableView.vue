<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <aside class="w-1/4 p-4 border-r">
      <DataTableFilters />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold">Data Table</h1>
        <Button @click="openWizard = true">Configure Table</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in placeholderData" :key="item.id">
            <TableCell>{{ item.id }}</TableCell>
            <TableCell>{{ item.name }}</TableCell>
            <TableCell>{{ item.email }}</TableCell>
            <TableCell>{{ item.role }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>

    <TableConfigWizard :open="openWizard" @update:open="openWizard = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTableFilters from '@/components/DataTableFilters.vue';
import TableConfigWizard from '@/components/TableConfigWizard.vue';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const openWizard = ref(false);

const placeholderData = ref([
  { id: 'USR001', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin' },
  { id: 'USR002', name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor' },
  { id: 'USR003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer' },
  { id: 'USR004', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor' },
  { id: 'USR005', name: 'Edward Scissorhands', email: 'edward@example.com', role: 'Viewer' },
]);
</script>
